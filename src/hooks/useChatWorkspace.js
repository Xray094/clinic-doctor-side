import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getMessagesByPatientId } from "../services/chatService";
import { usePatientMessagesQuery, useSendPatientMessageMutation } from "../repos/chatRepo";
import { usePatientByIdQuery, usePatientsQuery } from "../repos/patientRepo";
import { buildNotification, normalizeMessagesPayload } from "../utils/chatUtils";

const MESSAGE_POLL_MS = 2500;
const INBOX_POLL_MS = 12000;

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
  return normalizeMessagesPayload(response);
}

export function useChatWorkspace() {
  const queryClient = useQueryClient();
  const seenLatestByPatientRef = useRef({});

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
    refetchInterval: selectedPatientId ? MESSAGE_POLL_MS : false,
    staleTime: 0,
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

  const messages = messagesQuery.data || [];

  const searchError = useMemo(() => {
    if (!appliedSearchId || searchPatientQuery.isLoading) return "";
    return searchPatient ? "" : "No patient found for this ID.";
  }, [appliedSearchId, searchPatientQuery.isLoading, searchPatient]);

  const isLoadingPatients = appliedSearchId ? searchPatientQuery.isLoading : patientsQuery.isLoading;

  const notifyIncoming = (patient, text) => {
    const item = buildNotification(patient, text);
    setNotifications((prev) => [item, ...prev].slice(0, 6));
    playNotifySound();
  };

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
    const previousMessages = queryClient.getQueryData(queryKey) || [];
    const tempMessage = {
      id: `temp-${Date.now()}`,
      body,
      isMine: true,
      time: "sending...",
    };

    setNewMessage("");
    queryClient.setQueryData(queryKey, [...previousMessages, tempMessage]);

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: Number(selectedPatientId),
        body,
      });

      await queryClient.invalidateQueries({ queryKey });
    } catch (_) {
      queryClient.setQueryData(queryKey, previousMessages);
    }
  };

  useEffect(() => {
    if (!selectedPatientId || !messages.length) return;

    const latest = messages[messages.length - 1];
    const lastSeen = seenLatestByPatientRef.current[selectedPatientId];

    if (latest?.id && latest.id !== lastSeen) {
      if (lastSeen && !latest.isMine) {
        notifyIncoming(selectedPatient, latest.body);
      }

      seenLatestByPatientRef.current[selectedPatientId] = latest.id;
    }
  }, [messages, selectedPatientId, selectedPatient]);

  useEffect(() => {
    if (!selectedPatientId) return;

    const matchingPatient = sortedPatients.find((patient) => String(patient.id) === String(selectedPatientId));
    if (matchingPatient) {
      setSelectedPatient(matchingPatient);
    }
  }, [sortedPatients, selectedPatientId]);

  useEffect(() => {
    if (!sourcePatients.length) return;

    const timer = setInterval(async () => {
      const checks = await Promise.all(
        sourcePatients.map(async (patient) => {
          try {
            const latest = await queryClient.fetchQuery({
              queryKey: ["chat-messages", patient.id],
              queryFn: () => fetchMessagesForPatient(patient.id),
              staleTime: 0,
            });

            const last = latest[latest.length - 1];
            return { patient, last };
          } catch (_) {
            return { patient, last: null };
          }
        }),
      );

      checks.forEach(({ patient, last }) => {
        if (!last || last.isMine) return;

        const previousSeen = seenLatestByPatientRef.current[patient.id];
        if (previousSeen && previousSeen !== last.id && String(selectedPatientId) !== String(patient.id)) {
          setUnreadMap((prev) => ({ ...prev, [patient.id]: true }));
          notifyIncoming(patient, last.body);
        }

        seenLatestByPatientRef.current[patient.id] = last.id;
      });
    }, INBOX_POLL_MS);

    return () => clearInterval(timer);
  }, [queryClient, sourcePatients, selectedPatientId]);

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
