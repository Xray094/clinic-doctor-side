import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserCircle2, Send, LoaderCircle, Bell, CircleDot } from "lucide-react";
import { getMessagesByPatientId, sendMessageToPatient } from "../services/chatService";
import { getPatientById, getPatients } from "../services/patientService";

const MESSAGE_POLL_MS = 2500;
const INBOX_POLL_MS = 12000;

function getPatientName(patient) {
  const first = patient?.relationships?.user?.first_name || patient?.attributes?.first_name || "Patient";
  const last = patient?.relationships?.user?.last_name || patient?.attributes?.last_name || "";
  return `${first} ${last}`.trim();
}

function normalizePatients(payload) {
  const list = payload?.data?.data || payload?.data || payload;
  return Array.isArray(list) ? list : [];
}

function normalizeMessages(payload) {
  const list = payload?.data?.data || payload?.data || payload;
  const items = Array.isArray(list) ? list : [];

  return items
    .map((item) => ({
      id: item?.id,
      body: item?.attributes?.body || "",
      isMine: Boolean(item?.attributes?.is_mine),
      time: item?.attributes?.created_at || "",
    }))
    .filter((x) => x.id && x.body)
    .reverse();
}

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
    // Ignore audio errors (browser policy/device)
  }
}

export default function ChatWorkspace() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchId, setSearchId] = useState("");
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});

  const seenLatestByPatientRef = useRef({});
  const messageBottomRef = useRef(null);

  const sortedPatients = useMemo(() => {
    const list = [...patients];
    list.sort((a, b) => {
      const aUnread = unreadMap[a.id] ? 1 : 0;
      const bUnread = unreadMap[b.id] ? 1 : 0;
      if (aUnread !== bUnread) return bUnread - aUnread;
      return Number(a.id) - Number(b.id);
    });
    return list;
  }, [patients, unreadMap]);

  const selectedName = useMemo(() => getPatientName(selectedPatient), [selectedPatient]);

  const loadPatients = async () => {
    setIsLoadingPatients(true);
    try {
      const payload = await getPatients();
      const data = normalizePatients(payload);
      setPatients(data);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const loadMessagesForPatient = async (patientId, withSpinner = true) => {
    if (!patientId) return [];

    if (withSpinner) setIsLoadingMessages(true);
    try {
      const payload = await getMessagesByPatientId(patientId);
      return normalizeMessages(payload);
    } finally {
      if (withSpinner) setIsLoadingMessages(false);
    }
  };

  const markAsRead = (patientId) => {
    setUnreadMap((prev) => ({ ...prev, [patientId]: false }));
  };

  const notifyIncoming = (patient, text) => {
    const item = {
      id: `${Date.now()}-${Math.random()}`,
      patientId: patient.id,
      title: `New message from ${getPatientName(patient)}`,
      body: text,
      at: new Date().toLocaleTimeString(),
    };

    setNotifications((prev) => [item, ...prev].slice(0, 6));
    playNotifySound();
  };

  const refreshInboxPreview = async () => {
    if (!patients.length) return;

    const checks = await Promise.all(
      patients.map(async (patient) => {
        try {
          const latest = await loadMessagesForPatient(patient.id, false);
          const last = latest[latest.length - 1];
          if (!last) return { patient, last: null };
          return { patient, last };
        } catch (_) {
          return { patient, last: null };
        }
      }),
    );

    checks.forEach(({ patient, last }) => {
      if (!last || last.isMine) return;

      const previousSeen = seenLatestByPatientRef.current[patient.id];
      if (previousSeen && previousSeen !== last.id && selectedPatient?.id !== patient.id) {
        setUnreadMap((prev) => ({ ...prev, [patient.id]: true }));
        notifyIncoming(patient, last.body);
      }

      seenLatestByPatientRef.current[patient.id] = last.id;
    });
  };

  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    markAsRead(patient.id);

    const chatMessages = await loadMessagesForPatient(patient.id, true);
    setMessages(chatMessages);

    const latest = chatMessages[chatMessages.length - 1];
    if (latest) {
      seenLatestByPatientRef.current[patient.id] = latest.id;
    }
  };

  const handleSearchById = async (event) => {
    event.preventDefault();

    const value = searchId.trim();
    if (!value) {
      setSearchError("");
      loadPatients();
      return;
    }

    setSearchError("");
    try {
      const payload = await getPatientById(value);
      const patient = payload?.data?.data || payload?.data || payload;

      if (patient?.id) {
        setPatients([patient]);
      } else {
        setPatients([]);
        setSearchError("No patient found for this ID.");
      }
    } catch (_) {
      setPatients([]);
      setSearchError("No patient found for this ID.");
    }
  };

  const handleSendMessage = async () => {
    if (!selectedPatient?.id) return;

    const body = newMessage.trim();
    if (!body) return;

    setNewMessage("");

    const temp = {
      id: `temp-${Date.now()}`,
      body,
      isMine: true,
      time: "sending...",
    };
    setMessages((prev) => [...prev, temp]);

    try {
      await sendMessageToPatient({ receiverId: Number(selectedPatient.id), body });
      const fresh = await loadMessagesForPatient(selectedPatient.id, false);
      setMessages(fresh);
    } catch (_) {
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatient?.id) return;

    const timer = setInterval(async () => {
      const fresh = await loadMessagesForPatient(selectedPatient.id, false);
      const last = fresh[fresh.length - 1];
      const lastSeen = seenLatestByPatientRef.current[selectedPatient.id];

      if (last?.id && last?.id !== lastSeen) {
        if (!last.isMine) {
          notifyIncoming(selectedPatient, last.body);
        }
        seenLatestByPatientRef.current[selectedPatient.id] = last.id;
      }

      setMessages(fresh);
    }, MESSAGE_POLL_MS);

    return () => clearInterval(timer);
  }, [selectedPatient]);

  useEffect(() => {
    const timer = setInterval(() => {
      refreshInboxPreview();
    }, INBOX_POLL_MS);

    return () => clearInterval(timer);
  }, [patients, selectedPatient]);

  useEffect(() => {
    messageBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid h-[calc(100vh-180px)] min-h-130 gap-4 lg:grid-cols-[340px_1fr]">
      <aside
        className={`rounded-2xl border border-medics-light/60 bg-medics-bg/30 p-4 ${
          selectedPatient ? "lg:w-[320px]" : ""
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-medics-dark">Patient Chat</h3>
          <Bell size={18} className="text-medics-accent" />
        </div>

        <form onSubmit={handleSearchById} className="mb-3">
          <div className="flex items-center gap-2 rounded-xl border border-medics-light/60 bg-medics-bg/30 px-3 py-2">
            <Search size={16} className="text-medics-accent" />
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Search by patient ID"
              className="w-full bg-transparent text-sm font-medium text-medics-dark outline-none"
            />
          </div>
        </form>

        {searchError && (
          <p className="mb-3 rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200">
            {searchError}
          </p>
        )}

        <div className="mb-3 space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                const target = sortedPatients.find((p) => String(p.id) === String(n.patientId));
                if (target) selectPatient(target);
              }}
              className="w-full rounded-xl border border-medics-light/50 bg-medics-bg/35 px-3 py-2 text-left transition-colors hover:border-medics-secondary"
            >
              <p className="text-xs font-bold text-medics-secondary">{n.title}</p>
              <p className="mt-1 line-clamp-1 text-xs text-medics-accent">{n.body}</p>
              <p className="mt-1 text-[10px] font-semibold text-medics-accent/80">{n.at}</p>
            </button>
          ))}
        </div>

        <div className="max-h-[62vh] space-y-2 overflow-y-auto pr-1">
          {isLoadingPatients ? (
            <div className="grid h-28 place-items-center text-sm font-semibold text-medics-accent">
              <LoaderCircle size={17} className="animate-spin" />
            </div>
          ) : (
            sortedPatients.map((patient) => {
              const isSelected = String(selectedPatient?.id) === String(patient.id);
              const hasUnread = Boolean(unreadMap[patient.id]);

              return (
                <button
                  key={patient.id}
                  onClick={() => selectPatient(patient)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-all ${
                    isSelected
                      ? "border-medics-primary/60 bg-medics-primary/15"
                      : "border-medics-light/60 bg-medics-bg/30 hover:border-medics-secondary"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-medics-dark">{getPatientName(patient)}</p>
                    <p className="mt-1 text-xs font-medium text-medics-accent">ID: {patient.id}</p>
                  </div>

                  {hasUnread ? (
                    <span className="inline-flex h-4 w-4 rounded-full bg-red-500" />
                  ) : (
                    <CircleDot size={14} className="text-medics-accent/30" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 p-4">
        {!selectedPatient ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <UserCircle2 size={44} className="mx-auto text-medics-accent" />
              <p className="mt-3 text-sm font-semibold text-medics-secondary">
                Select a patient to open live chat
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <header className="mb-3 flex items-center justify-between rounded-xl border border-medics-light/60 bg-medics-bg/30 px-3 py-2">
              <button
                onClick={() => navigate(`/patients/${selectedPatient.id}`)}
                className="rounded-lg border border-medics-light/60 px-3 py-1 text-xs font-bold text-medics-dark transition-colors hover:border-medics-secondary"
              >
                Profile
              </button>

              <p className="text-sm font-black text-medics-dark">{selectedName}</p>
              <span className="text-xs font-semibold text-medics-accent">ID: {selectedPatient.id}</span>
            </header>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-xl border border-medics-light/60 bg-medics-bg/25 p-3">
              {isLoadingMessages ? (
                <div className="grid h-full place-items-center text-sm font-semibold text-medics-accent">
                  <LoaderCircle size={17} className="animate-spin" />
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[74%] rounded-2xl px-3 py-2 text-sm ${
                        msg.isMine
                          ? "bg-medics-primary text-white"
                          : "border border-medics-light/60 bg-medics-bg/40 text-medics-dark"
                      }`}
                    >
                      <p>{msg.body}</p>
                      <p className={`mt-1 text-[10px] font-semibold ${msg.isMine ? "text-white/80" : "text-medics-accent"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messageBottomRef} />
            </div>

            <footer className="mt-3 flex items-center gap-2 rounded-xl border border-medics-light/60 bg-medics-bg/30 p-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message"
                className="w-full rounded-lg bg-transparent px-2 py-2 text-sm font-medium text-medics-dark outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className="inline-flex items-center gap-1 rounded-lg bg-medics-primary px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                <Send size={14} />
                Send
              </button>
            </footer>
          </div>
        )}
      </section>
    </div>
  );
}
