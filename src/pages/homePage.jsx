import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ClipboardCheck,
  Clock3,
  Activity,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore()

  const doctorName = useMemo(() => {
    if (!user) return "Doctor";
    return user.attributes.first_name;
  }, [user]);

  const todayHighlights = [
    {
      title: "Appointments Today",
      value: "18",
      trend: "+12% this week",
      icon: <Calendar size={20} />,
    },
    {
      title: "Reports Pending",
      value: "7",
      trend: "2 urgent",
      icon: <ClipboardCheck size={20} />,
    },
    {
      title: "Avg. Consultation",
      value: "14m",
      trend: "-2m from yesterday",
      icon: <Clock3 size={20} />,
    },
  ];

  const quickActions = [
    "Start New Consultation",
    "Review Critical Labs",
    "Open e-Prescriptions",
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-[#f3fbfa] via-white to-[#e8f8f6] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-medics-light bg-white p-6 shadow-xl sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-medics-primary/10" />
          <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-medics-secondary/10" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-medics-secondary">
                Medics Command Center
              </p>
              <h1 className="mt-2 text-2xl font-black text-medics-dark sm:text-4xl">
                Welcome back, {doctorName}
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium text-[#587a77] sm:text-base">
                Your schedule is aligned, patient flow is stable, and your critical updates are ready.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-medics-light bg-[#f4fdfc] px-5 py-3 text-sm font-bold text-medics-dark transition-all hover:border-medics-accent hover:bg-white"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {todayHighlights.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-medics-light bg-white p-5 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-xl bg-medics-bg p-2 text-medics-secondary">
                {item.icon}
              </div>
              <h2 className="text-sm font-bold text-[#5d7f7c]">{item.title}</h2>
              <p className="mt-2 text-3xl font-black text-medics-dark">{item.value}</p>
              <p className="mt-1 text-xs font-semibold text-medics-secondary">{item.trend}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-medics-light bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-medics-dark">Live Activity</h3>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#ecf9f8] px-3 py-1 text-xs font-bold text-medics-secondary">
                <Activity size={14} />
                Stable
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                "3 new patient check-ins completed",
                "Lab update received for Room 204",
                "Follow-up reminder sent to 5 patients",
              ].map((entry) => (
                <div
                  key={entry}
                  className="rounded-xl border border-medics-light/80 bg-[#f8fdfd] px-4 py-3 text-sm font-medium text-[#486764]"
                >
                  {entry}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-medics-light bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-medics-dark">Quick Actions</h3>
            <div className="mt-4 space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action}
                  className="group flex w-full items-center justify-between rounded-xl border border-medics-light bg-[#f7fdfc] px-4 py-3 text-left text-sm font-bold text-[#416764] transition-all hover:border-medics-accent"
                >
                  {action}
                  <ChevronRight
                    size={16}
                    className="text-medics-secondary transition-transform group-hover:translate-x-1"
                  />
                </button>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}