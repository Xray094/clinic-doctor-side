import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  CircleCheckBig,
  LayoutDashboard,
  LogOut,
  UserCircle2,
  Stethoscope,
  Bell,
  Sparkles,
  LoaderCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useDoctorDashboard } from "../repos/doctorRepo";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { data, isLoading, isError } = useDoctorDashboard();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("medics-theme");
    const nextTheme = savedTheme === "light" ? "light" : "dark";

    setTheme(nextTheme);
    if (nextTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const doctorName = useMemo(() => {
    if (!user) return "Doctor";
    return user.attributes.first_name;
  }, [user]);

  const stats = {
    today_appointments: data?.today_appointments ?? 0,
    pending_appointments: data?.pending_appointments ?? 0,
    completed_today: data?.completed_today ?? 0,
  };

  const dashboardCards = [
    {
      title: "Today's Appointments",
      value: stats.today_appointments,
      hint: "Scheduled for this day",
      icon: <CalendarDays size={20} />,
    },
    {
      title: "Pending Appointments",
      value: stats.pending_appointments,
      hint: "Need confirmation or follow-up",
      icon: <ClipboardList size={20} />,
    },
    {
      title: "Completed Today",
      value: stats.completed_today,
      hint: "Marked complete today",
      icon: <CircleCheckBig size={20} />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      localStorage.setItem("medics-theme", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }

      return nextTheme;
    });
  };

  return (
    <main
      className={`h-screen w-full overflow-hidden bg-linear-to-br ${
        theme === "light"
          ? "from-medics-bg via-white to-medics-light/60"
          : "from-medics-bg via-[#122425] to-[#183638]"
      }`}
    >
      <div className="grid h-full w-full gap-4 p-4 lg:grid-cols-[260px_1fr]">
        <aside className="flex h-full flex-col rounded-3xl border border-medics-light/70 bg-medics-bg/70 p-4 shadow-2xl backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3 border-b border-medics-light/40 pb-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-medics-primary to-medics-secondary text-white shadow-lg shadow-medics-primary/40">
              <Stethoscope size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-accent">Medics</p>
              <p className="text-sm font-bold text-medics-dark">Doctor Console</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button className="flex w-full items-center gap-3 rounded-xl border border-medics-primary/50 bg-medics-primary/20 px-4 py-3 text-left text-sm font-bold text-medics-dark">
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl border border-medics-light/70 bg-medics-bg/30 px-4 py-3 text-left text-sm font-semibold text-medics-accent transition-colors hover:border-medics-secondary/70 hover:text-medics-dark">
              <CalendarDays size={18} />
              Appointments
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl border border-medics-light/70 bg-medics-bg/40 px-4 py-3 text-sm font-bold text-medics-dark transition-all hover:border-medics-secondary"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </aside>

        <section className="h-full overflow-y-auto rounded-3xl border border-medics-light/70 bg-medics-bg/60 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-medics-secondary">Dashboard</p>
              <h1 className="mt-2 text-2xl font-black text-medics-dark sm:text-3xl">Welcome back, Dr. {doctorName}</h1>
              <p className="mt-1 text-sm font-medium text-medics-accent">Your clinic overview for today.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-xl border border-medics-light/60 bg-medics-bg/40 px-3 py-2 text-sm font-semibold text-medics-dark transition-all hover:border-medics-secondary"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-xl border border-medics-light/60 bg-medics-bg/40 text-medics-accent transition-colors hover:text-medics-dark">
                <Bell size={16} />
              </button>
              <button
                onClick={() => navigate("/doctors/profile")}
                className="inline-flex items-center gap-2 rounded-xl border border-medics-light/60 bg-medics-bg/40 px-3 py-2 text-sm font-semibold text-medics-dark transition-all hover:border-medics-secondary"
              >
                <UserCircle2 size={18} />
                Profile
              </button>
            </div>
          </header>

          {isLoading ? (
            <div className="grid min-h-70 place-items-center rounded-2xl border border-medics-light/60 bg-medics-bg/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-medics-accent">
                <LoaderCircle size={18} className="animate-spin" />
                Loading dashboard metrics...
              </div>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
              Could not load dashboard data. Please try again.
            </div>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                {dashboardCards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-2xl border border-medics-light/60 bg-linear-to-b from-medics-bg/30 to-medics-bg/10 p-5"
                  >
                    <div className="mb-4 inline-flex rounded-xl bg-medics-primary/15 p-2 text-medics-accent">
                      {card.icon}
                    </div>
                    <h2 className="text-sm font-bold text-medics-secondary">{card.title}</h2>
                    <p className="mt-2 text-4xl font-black leading-none text-medics-dark">{card.value}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-medics-accent/85">{card.hint}</p>
                  </article>
                ))}
              </section>

              <section className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
                <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/20 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-medics-dark">Today Focus</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-medics-primary/15 px-3 py-1 text-xs font-bold text-medics-accent">
                      <Sparkles size={13} />
                      On Track
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3 text-sm font-medium text-medics-accent">
                      Appointment desk is clear and synced.
                    </div>
                    <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3 text-sm font-medium text-medics-accent">
                      Keep follow-up pace steady during afternoon slots.
                    </div>
                    <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3 text-sm font-medium text-medics-accent">
                      Review pending appointments from the Appointments tab.
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/20 p-5">
                  <h3 className="text-lg font-black text-medics-dark">Status Summary</h3>
                  <div className="mt-4 space-y-3 text-sm font-semibold">
                    <div className="flex items-center justify-between rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
                      <span className="text-medics-secondary">Today</span>
                      <span className="text-medics-dark">{stats.today_appointments}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
                      <span className="text-medics-secondary">Pending</span>
                      <span className="text-medics-dark">{stats.pending_appointments}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
                      <span className="text-medics-secondary">Completed</span>
                      <span className="text-medics-dark">{stats.completed_today}</span>
                    </div>
                  </div>
                </article>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}