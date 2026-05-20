import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getMessagesByPatientId } from "../services/chatService";
import { usePatientMessagesQuery, useSendPatientMessageMutation } from "../repos/chatRepo";
import { usePatientByIdQuery, usePatientsQuery } from "../repos/patientRepo";
import echo from "../services/echo";
import {
  buildNotification,
  normalizeBroadcastMessage,
  normalizeConversationPayload,
} from "../utils/chatUtils";
import { useAuthStore } from "../store/useAuthStore";

function playNotifySound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(920, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.14);
  } catch (_) {
    // Ignore browser/device audio limitations.
  }
}

async function fetchMessagesForPatient(patientId) {
  const response = await getMessagesByPatientId(patientId);
  return normalizeConversationPayload(response);
}

export function useChatWorkspace({ isChatOpen = true } = {}) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id ? String(user.id) : null;
  const seenLatestByPatientRef = useRef({});
  const subscribedConversationsRef = useRef(new Set());

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [appliedSearchId, setAppliedSearchId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});

  const patientsQuery = usePatientsQuery();
  const searchPatientQuery = usePatientByIdQuery(appliedSearchId);
  const sendMessageMutation = useSendPatientMessageMutation();

  const selectedPatientId = selectedPatient?.id;
  const messagesQuery = usePatientMessagesQuery(selectedPatientId, {
    staleTime: Infinity,
  });

  const sourcePatients = patientsQuery.data || [];
  const searchPatient = searchPatientQuery.data;

  const listedPatients = useMemo(() => {
    const list = appliedSearchId ? (searchPatient ? [searchPatient] : []) : sourcePatients;
    return list;
  }, [appliedSearchId, searchPatient, sourcePatients]);

  const sortedPatients = useMemo(() => {
    const list = [...listedPatients];
    list.sort((a, b) => {
      const aUnread = unreadMap[a.id] ? 1 : 0;
      const bUnread = unreadMap[b.id] ? 1 : 0;
      if (aUnread !== bUnread) return bUnread - aUnread;
      return Number(a.id) - Number(b.id);
    });
    return list;
  }, [listedPatients, unreadMap]);

  const messages = messagesQuery.data?.messages || [];

  const searchError = useMemo(() => {
    if (!appliedSearchId || searchPatientQuery.isLoading) return "";
    return searchPatient ? "" : "No patient found for this ID.";
  }, [appliedSearchId, searchPatientQuery.isLoading, searchPatient]);

  const isLoadingPatients = appliedSearchId ? searchPatientQuery.isLoading : patientsQuery.isLoading;

  const markAsRead = (patientId) => {
    setUnreadMap((prev) => ({ ...prev, [patientId]: false }));
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    markAsRead(patient.id);
  };

  const handleSearchById = async (event) => {
    event.preventDefault();
    const value = searchId.trim();
    if (!value) {
      setAppliedSearchId("");
      return;
    }
    setAppliedSearchId(value);
  };

  const handleSendMessage = async () => {
    if (!selectedPatientId) return;

    const body = newMessage.trim();
    if (!body) return;

    const queryKey = ["chat-messages", selectedPatientId];
    const previousThread = queryClient.getQueryData(queryKey) || { conversationId: null, messages: [] };
    const tempMessage = {
      id: `temp-${Date.now()}`,
      body,
      sender_user_id: user?.id ?? null,
      time: "sending...",
    };

    setNewMessage("");
    queryClient.setQueryData(queryKey, {
      ...previousThread,
      messages: [...previousThread.messages, tempMessage],
    });

    try {
      const response = await sendMessageMutation.mutateAsync({
        receiverId: Number(selectedPatientId),
        body,
      });

      let sentMessage = normalizeBroadcastMessage(response);
      
      // Safety Fallback for normalization structural edge cases
      if (!sentMessage?.id && response?.data?.message?.id) {
        sentMessage = {
          id: response.data.message.id,
          body: response.data.message.attributes?.body || response.data.message.body,
          sender_user_id: response.data.message.attributes?.sender_user_id || user?.id,
          time: response.data.message.attributes?.created_at,
        };
      }

      queryClient.setQueryData(queryKey, (currentThread = previousThread) => {
        // Clear out temporary processing tags
        const cleanMessages = currentThread.messages.filter(
          (message) => !String(message.id).startsWith("temp-")
        );

        // De-duplicate if Echo intercepted and appended this message before our HTTP response finalized
        const alreadyAppendedByEcho = cleanMessages.some(
          (msg) => String(msg.id) === String(sentMessage.id)
        );

        if (alreadyAppendedByEcho) {
          return {
            ...currentThread,
            messages: cleanMessages,
          };
        }

        return {
          conversationId: currentThread.conversationId ?? previousThread.conversationId,
          messages: cleanMessages.concat(sentMessage),
        };
      });
    } catch (_) {
      queryClient.setQueryData(queryKey, previousThread);
    }
  };

  useEffect(() => {
    if (!selectedPatientId) return;

    const matchingPatient = sortedPatients.find((patient) => String(patient.id) === String(selectedPatientId));
    if (matchingPatient) {
      setSelectedPatient(matchingPatient);
    }
  }, [sortedPatients, selectedPatientId]);

  useEffect(() => {
    if (!sourcePatients.length) return undefined;

    let cancelled = false;

    const subscribeToThread = (patient, thread) => {
      const conversationId = thread?.conversationId;
      const channelName = conversationId ? `chat.${conversationId}` : null;

      if (!channelName || subscribedConversationsRef.current.has(channelName)) {
        return;
      }

      subscribedConversationsRef.current.add(channelName);

      echo.private(channelName).listen(".message.sent", (event) => {
        let incomingMessage = normalizeBroadcastMessage(event);

        // Structural Extraction Guard: Parse nested Laravel JSON:API attributes directly if utility returns null
        if (!incomingMessage?.id && event?.message?.id) {
          incomingMessage = {
            id: event.message.id,
            body: event.message.attributes?.body || event.message.body,
            sender_user_id: event.message.attributes?.sender_user_id,
            time: event.message.attributes?.created_at,
          };
        }

        if (!incomingMessage?.id || !incomingMessage?.body) return;
        const matchesCurrentUser = currentUserId && String(incomingMessage.sender_user_id) === currentUserId;

        const queryKey = ["chat-messages", patient.id];
        queryClient.setQueryData(queryKey, (currentThread = { conversationId, messages: [] }) => {
          // Absolute Check against matching Database ID arrays
          const isDuplicate = currentThread.messages.some(
            (msg) => String(msg.id) === String(incomingMessage.id)
          );

          if (isDuplicate) {
            return currentThread;
          }

          // Clean out temporary instances if the incoming websocket signature is confirmed ours
          const cleanMessages = currentThread.messages.filter((msg) => {
            const tempMatchesCurrentUser = matchesCurrentUser && String(msg.id).startsWith("temp-") && msg.body === incomingMessage.body;
            if (tempMatchesCurrentUser) {
              return false;
            }
            return true;
          });

          return {
            conversationId: currentThread.conversationId ?? conversationId,
            messages: [...cleanMessages, incomingMessage],
          };
        });

        seenLatestByPatientRef.current[patient.id] = incomingMessage.id;
      });
    };

    const hydrateThreads = async () => {
      const threads = await Promise.all(
        sourcePatients.map(async (patient) => {
          try {
            const thread = await queryClient.fetchQuery({
              queryKey: ["chat-messages", patient.id],
              queryFn: () => fetchMessagesForPatient(patient.id),
              staleTime: Infinity,
            });

            return { patient, thread };
          } catch (_) {
            return { patient, thread: { conversationId: null, messages: [] } };
          }
        }),
      );

      if (cancelled) return;

      threads.forEach(({ patient, thread }) => {
        queryClient.setQueryData(["chat-messages", patient.id], thread);

        const lastMessage = thread.messages.at(-1);
        if (lastMessage?.id) {
          seenLatestByPatientRef.current[patient.id] = lastMessage.id;
        }

        subscribeToThread(patient, thread);
      });
    };

    hydrateThreads();

    return () => {
      cancelled = true;
    };
  }, [queryClient, sourcePatients, user?.id]);

  useEffect(() => {
    if (!user?.id) return undefined;

    const channelName = `App.Models.User.${user.id}`;

    echo.private(channelName).notification((notification) => {
      const patientId = notification?.patient_id;
      if (!patientId) return;

      const patient = sourcePatients.find((entry) => String(entry.id) === String(patientId));
      if (!patient) return;

      const isActiveThread = String(selectedPatientId) === String(patient.id) && isChatOpen;
      const notificationId = String(notification?.message_id || notification?.conversation_id || Date.now());

      if (!isActiveThread) {
        const item = {
          ...buildNotification(patient, notification?.body || "New message received."),
          id: notificationId,
        };

        setUnreadMap((prev) => ({ ...prev, [patient.id]: true }));
        setNotifications((prev) => [item, ...prev.filter((entry) => entry.id !== item.id)].slice(0, 6));
        playNotifySound();
      }

      if (notification?.message_id) {
        seenLatestByPatientRef.current[patient.id] = String(notification.message_id);
      }
    });

    return () => {
      echo.leave(channelName);
    };
  }, [isChatOpen, selectedPatientId, sourcePatients, user?.id]);

  useEffect(() => {
    return () => {
      subscribedConversationsRef.current.forEach((channelName) => {
        echo.leave(channelName);
      });
      subscribedConversationsRef.current.clear();
    };
  }, []);

  return {
    searchId,
    setSearchId,
    newMessage,
    setNewMessage,
    selectedPatient,
    selectPatient,
    sortedPatients,
    notifications,
    unreadMap,
    messages,
    searchError,
    isLoadingPatients,
    isLoadingMessages: messagesQuery.isLoading,
    handleSearchById,
    handleSendMessage,
  };
}