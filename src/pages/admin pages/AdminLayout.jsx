import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Stethoscope, ClipboardList, CalendarDays, LogOut, Sun, Moon, Shield, UserRound, BedDouble, BadgeDollarSign } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/admin/patients", label: "Patients", icon: UserRound },
  { to: "/admin/appointments", label: "Appointments", icon: ClipboardList },
  { to: "/admin/schedules", label: "Schedules", icon: CalendarDays },
  { to: "/admin/vacations", label: "Vacations", icon: BedDouble },
];

const pageTitles = {
  "/admin/dashboard": "Admin Dashboard",
  "/admin/doctors": "Doctors Management",
  "/admin/patients": "Patients Management",
  "/admin/appointments": "Appointments Review",
  "/admin/schedules": "Doctor Schedules",
  "/admin/vacations": "Doctor Vacations",
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
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

  const currentTitle = useMemo(() => pageTitles[location.pathname] ?? "Admin Area", [location.pathname]);

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

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <main className={`min-h-screen w-full bg-linear-to-br ${theme === "light" ? "from-medics-bg via-white to-medics-light/60" : "from-medics-bg via-[#122425] to-[#183638]"}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-400 gap-4 p-4 xl:p-6">
        <aside className="hidden w-72 shrink-0 flex-col rounded-4xl border border-medics-light/70 bg-medics-bg/72 p-4 shadow-2xl backdrop-blur-sm xl:flex">
          <div className="flex items-center gap-3 border-b border-medics-light/40 pb-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-medics-primary to-medics-secondary text-white shadow-lg shadow-medics-primary/40">
              <Shield size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-medics-accent">Medics</p>
              <p className="text-base font-black text-medics-dark">Admin Console</p>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "border-medics-primary/50 bg-medics-primary/18 text-medics-dark shadow-lg shadow-medics-primary/10"
                        : "border-medics-light/70 bg-medics-bg/30 text-medics-accent hover:border-medics-secondary/70 hover:text-medics-dark"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 pt-4">
            <button
              onClick={toggleTheme}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-medics-light/60 bg-medics-bg/40 px-4 py-3 text-sm font-bold text-medics-dark transition-all hover:border-medics-secondary"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light theme" : "Dark theme"}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-medics-light/60 bg-medics-bg/40 px-4 py-3 text-sm font-bold text-medics-dark transition-all hover:border-medics-secondary"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-4xl border border-medics-light/70 bg-medics-bg/60 shadow-2xl backdrop-blur-sm">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-medics-light/40 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-medics-secondary">Admin workspace</p>
              <h1 className="mt-1 text-2xl font-black text-medics-dark sm:text-3xl">{currentTitle}</h1>
              <p className="mt-1 text-sm font-medium text-medics-accent">Mock-ready screens for doctors, patients, schedules, and appointments.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-2xl border border-medics-light/60 bg-medics-bg/40 px-4 py-3 text-sm font-semibold text-medics-dark md:flex">
                <BadgeDollarSign size={16} className="text-medics-accent" />
                {user?.attributes?.first_name ?? "Admin"} {user?.attributes?.last_name ?? ""}
              </div>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-2xl border border-medics-light/60 bg-medics-bg/40 px-3 py-2 text-sm font-semibold text-medics-dark transition-all hover:border-medics-secondary xl:hidden"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                Theme
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
