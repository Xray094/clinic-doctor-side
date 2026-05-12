import { useMemo } from "react";
import { BadgeCheck, CalendarDays, ClipboardList, HeartPulse, LoaderCircle, Stethoscope, BedDouble, ArrowUpRight } from "lucide-react";
import { useAdminOverview } from "../../repos/adminRepo";

const statCards = [
  { key: "doctors", label: "Doctors", icon: Stethoscope },
  { key: "patients", label: "Patients", icon: HeartPulse },
  { key: "appointments", label: "Appointments", icon: ClipboardList },
  { key: "schedules", label: "Schedules", icon: CalendarDays },
  { key: "vacations", label: "Vacations", icon: BedDouble },
];

const formatName = (person) => `${person?.user?.first_name ?? "Unknown"} ${person?.user?.last_name ?? ""}`.trim();

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminOverview();

  const cards = useMemo(() => {
    if (!data) {
      return [];
    }

    return statCards.map((card) => ({
      ...card,
      value: data.totals[card.key] ?? 0,
    }));
  }, [data]);

  return isLoading ? (
    <div className="grid min-h-[50vh] place-items-center rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/40">
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-medics-accent">
        <LoaderCircle size={18} className="animate-spin" />
        Loading admin overview...
      </div>
    </div>
  ) : isError ? (
    <div className="rounded-[1.75rem] border border-red-400/40 bg-red-500/10 p-5 text-sm font-semibold text-red-200">Could not load admin overview.</div>
  ) : (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.key} className="rounded-[1.75rem] border border-medics-light/60 bg-linear-to-b from-medics-bg/35 to-medics-bg/15 p-5 shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex rounded-2xl bg-medics-primary/15 p-3 text-medics-accent">
                  <Icon size={20} />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-medics-primary/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-medics-secondary">
                  <BadgeCheck size={12} />
                  Live mock
                </span>
              </div>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-medics-secondary">{card.label}</p>
              <p className="mt-1 text-4xl font-black text-medics-dark">{card.value}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Overview</p>
              <h2 className="mt-1 text-xl font-black text-medics-dark">Admin summary</h2>
            </div>
            <ArrowUpRight size={20} className="text-medics-accent" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InfoChip label="Today appointments" value={data.focus.today_appointments} />
            <InfoChip label="Pending appointments" value={data.focus.pending_appointments} />
            <InfoChip label="Completed appointments" value={data.focus.completed_appointments} />
            <InfoChip label="Active schedules" value={data.focus.active_schedules} />
            <InfoChip label="Vacation days" value={data.focus.vacation_days} />
            <InfoChip label="Active accounts" value={data.totals.active_accounts} />
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Quick notes</p>
          <h2 className="mt-1 text-xl font-black text-medics-dark">What is ready now</h2>
          <div className="mt-4 space-y-3 text-sm font-medium text-medics-accent">
            <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">Doctor accounts use register-style forms with login-ready credentials.</div>
            <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">Appointments are paginated and support delete-only admin review.</div>
            <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">Schedules and vacation days are separated so backend mapping stays simple later.</div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <OverviewList title="Recent doctors" items={data.recent_doctors} emptyLabel="No doctors yet" renderItem={(doctor) => (
          <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
            <p className="font-bold text-medics-dark">{formatName(doctor)}</p>
            <p className="text-sm text-medics-accent">{doctor.specialization}</p>
          </div>
        )} />
        <OverviewList title="Recent appointments" items={data.recent_appointments} emptyLabel="No appointments yet" renderItem={(appointment) => (
          <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
            <p className="font-bold text-medics-dark">{formatName(appointment.patient)} with {formatName(appointment.doctor)}</p>
            <p className="text-sm text-medics-accent">{appointment.appointment_date} · {appointment.status}</p>
          </div>
        )} />
        <OverviewList title="Recent vacations" items={data.recent_vacations} emptyLabel="No vacations yet" renderItem={(vacation) => (
          <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
            <p className="font-bold text-medics-dark">{formatName(vacation.doctor)}</p>
            <p className="text-sm text-medics-accent">{vacation.start_date} to {vacation.end_date}</p>
          </div>
        )} />
      </section>
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-medics-secondary">{label}</p>
      <p className="mt-1 text-2xl font-black text-medics-dark">{value}</p>
    </div>
  );
}

function OverviewList({ title, items, emptyLabel, renderItem }) {
  return (
    <article className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">{title}</p>
      <div className="mt-4 space-y-3">{items.length ? items.map((item) => <div key={item.id}>{renderItem(item)}</div>) : <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3 text-sm font-medium text-medics-accent">{emptyLabel}</div>}</div>
    </article>
  );
}
