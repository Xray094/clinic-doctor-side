import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserCircle2, Send, LoaderCircle, Bell, CircleDot } from "lucide-react";
import { useChatWorkspace } from "../hooks/useChatWorkspace";
import { getPatientIdentity } from "../utils/patientUtils";

export default function ChatWorkspace() {
  const navigate = useNavigate();
  const {
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
    isLoadingMessages,
    handleSearchById,
    handleSendMessage,
  } = useChatWorkspace();

  const messageBottomRef = useRef(null);
  const selectedPatientName = selectedPatient ? getPatientIdentity(selectedPatient).name : "";

  useEffect(() => {
    messageBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[340px_1fr]">
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
              const patientName = getPatientIdentity(patient).name;

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
                    <p className="text-sm font-bold text-medics-dark">{patientName}</p>
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

      <section className="min-h-0 rounded-2xl border border-medics-light/60 bg-medics-bg/30 p-4">
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
          <div className="flex h-full min-h-0 flex-col">
            <header className="mb-3 flex items-center justify-between rounded-xl border border-medics-light/60 bg-medics-bg/30 px-3 py-2">
              <button
                onClick={() => navigate(`/patients/${selectedPatient.id}`)}
                className="rounded-lg border border-medics-light/60 px-3 py-1 text-xs font-bold text-medics-dark transition-colors hover:border-medics-secondary"
              >
                Profile
              </button>

              <p className="text-sm font-black text-medics-dark">{selectedPatientName}</p>
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
