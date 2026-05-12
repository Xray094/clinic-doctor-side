import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useAppointmentsQuery, useDeleteAppointmentMutation } from "../../repos/adminRepo";

export default function AdminAppointmentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAppointmentsQuery({ page, perPage: 5, search });
  const deleteAppointmentMutation = useDeleteAppointmentMutation();
  const appointments = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, totalPages: 1, total: 0 };

  return (
    <section className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Appointments</p>
          <h2 className="mt-1 text-xl font-black text-medics-dark">Review and delete appointments</h2>
        </div>
        <div className="flex min-w-72 flex-1 items-center rounded-2xl border border-medics-light/60 bg-medics-bg/35 md:max-w-xl"><Search size={16} className="ml-4 text-medics-accent" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search appointments..." className="w-full bg-transparent px-3 py-3 text-sm outline-none text-medics-dark" /></div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-medics-light/60">
        <table className="min-w-full divide-y divide-medics-light/50">
          <thead className="bg-medics-bg/55"><tr className="text-left text-xs font-bold uppercase tracking-[0.16em] text-medics-secondary"><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Doctor</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead>
          <tbody className="divide-y divide-medics-light/40 bg-medics-bg/20">
            {isLoading ? (<tr><td colSpan="5" className="px-4 py-8 text-center text-sm font-semibold text-medics-accent">Loading appointments...</td></tr>) : appointments.length ? appointments.map((appointment) => (<tr key={appointment.id} className="text-sm text-medics-dark"><td className="px-4 py-4"><p className="font-bold">{appointment.patient?.user?.first_name} {appointment.patient?.user?.last_name}</p><p className="text-xs text-medics-accent">{appointment.reason}</p></td><td className="px-4 py-4"><p className="font-bold">{appointment.doctor?.user?.first_name} {appointment.doctor?.user?.last_name}</p><p className="text-xs text-medics-accent">{appointment.doctor?.specialization}</p></td><td className="px-4 py-4">{appointment.appointment_date}<p className="text-xs text-medics-accent">{appointment.start_time} - {appointment.end_time}</p></td><td className="px-4 py-4">{appointment.status}</td><td className="px-4 py-4"><button onClick={() => deleteAppointmentMutation.mutate(appointment.id)} className="inline-flex items-center gap-1 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200"><Trash2 size={14} />Delete</button></td></tr>)) : (<tr><td colSpan="5" className="px-4 py-8 text-center text-sm font-semibold text-medics-accent">No appointments found.</td></tr>)}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button disabled={meta.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-medics-light/60 px-3 py-2 text-sm font-semibold text-medics-dark disabled:opacity-40">Previous</button>
        <div className="text-sm font-semibold text-medics-accent">Page {meta.page} / {meta.totalPages}</div>
        <button disabled={meta.page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-medics-light/60 px-3 py-2 text-sm font-semibold text-medics-dark disabled:opacity-40">Next</button>
      </div>
    </section>
  );
}
