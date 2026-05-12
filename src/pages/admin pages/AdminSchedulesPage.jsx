import { useMemo, useState } from "react";
import { Plus, Search, PencilLine, Trash2 } from "lucide-react";
import { useDeleteScheduleMutation, useDoctorsQuery, useSchedulesQuery, useSaveScheduleMutation } from "../../repos/adminRepo";

const emptyForm = {
  doctor_id: "",
  day_of_week: "sunday",
  start_time: "08:00",
  end_time: "14:00",
  slot_duration: 30,
  status: "active",
};

const dayOptions = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];

export default function AdminSchedulesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [doctorId, setDoctorId] = useState("all");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data } = useSchedulesQuery({ page, perPage: 5, search, doctorId });
  const { data: doctorsData } = useDoctorsQuery({ page: 1, perPage: 100, search: "" });
  const saveScheduleMutation = useSaveScheduleMutation();
  const deleteScheduleMutation = useDeleteScheduleMutation();
  const schedules = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, totalPages: 1, total: 0 };
  const doctors = doctorsData?.data ?? [];

  const doctorOptions = useMemo(() => doctors, [doctors]);

  const startCreate = () => {
    setSelectedSchedule(null);
    setForm((current) => ({ ...emptyForm, doctor_id: doctorOptions[0]?.id ?? current.doctor_id }));
  };

  const startEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setForm({
      doctor_id: schedule.doctor_id,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      slot_duration: schedule.slot_duration,
      status: schedule.status,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveScheduleMutation.mutate(
      { id: selectedSchedule?.id, ...form },
      { onSuccess: () => startCreate() },
    );
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4">
        <div className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Doctor schedules</p>
              <h2 className="mt-1 text-xl font-black text-medics-dark">Check and filter working schedules</h2>
            </div>
            <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-medics-primary to-medics-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-medics-primary/20"><Plus size={16} />New schedule</button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex min-w-72 flex-1 items-center rounded-2xl border border-medics-light/60 bg-medics-bg/35"><Search size={16} className="ml-4 text-medics-accent" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search schedules..." className="w-full bg-transparent px-3 py-3 text-sm outline-none text-medics-dark" /></div>
            <select value={doctorId} onChange={(event) => setDoctorId(event.target.value)} className="rounded-2xl border border-medics-light/60 bg-medics-bg/35 px-4 py-3 text-sm font-semibold text-medics-dark"><option value="all">All doctors</option>{doctorOptions.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.user?.first_name} {doctor.user?.last_name}</option>)}</select>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <table className="min-w-full divide-y divide-medics-light/50">
            <thead className="bg-medics-bg/55"><tr className="text-left text-xs font-bold uppercase tracking-[0.16em] text-medics-secondary"><th className="px-4 py-3">Doctor</th><th className="px-4 py-3">Day</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-medics-light/40 bg-medics-bg/20">
              {schedules.length ? schedules.map((schedule) => (<tr key={schedule.id} className="text-sm text-medics-dark"><td className="px-4 py-4"><p className="font-bold">{schedule.doctor?.user?.first_name} {schedule.doctor?.user?.last_name}</p><p className="text-xs text-medics-accent">{schedule.doctor?.specialization}</p></td><td className="px-4 py-4">{schedule.day_of_week}</td><td className="px-4 py-4">{schedule.start_time} - {schedule.end_time}<p className="text-xs text-medics-accent">{schedule.slot_duration} minutes</p></td><td className="px-4 py-4">{schedule.status}</td><td className="px-4 py-4"><div className="flex gap-2"><button onClick={() => startEdit(schedule)} className="inline-flex items-center gap-1 rounded-xl border border-medics-light/60 px-3 py-2 text-xs font-bold text-medics-dark"><PencilLine size={14} />Edit</button><button onClick={() => deleteScheduleMutation.mutate(schedule.id)} className="inline-flex items-center gap-1 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200"><Trash2 size={14} />Delete</button></div></td></tr>)) : (<tr><td colSpan="5" className="px-4 py-8 text-center text-sm font-semibold text-medics-accent">No schedules found.</td></tr>)}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-between"><button disabled={meta.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-medics-light/60 px-3 py-2 text-sm font-semibold text-medics-dark disabled:opacity-40">Previous</button><div className="text-sm font-semibold text-medics-accent">Page {meta.page} / {meta.totalPages}</div><button disabled={meta.page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-medics-light/60 px-3 py-2 text-sm font-semibold text-medics-dark disabled:opacity-40">Next</button></div>
        </div>
      </section>

      <aside className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Schedule form</p>
        <h2 className="mt-1 text-xl font-black text-medics-dark">{selectedSchedule ? "Edit schedule" : "Create schedule"}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field label="Doctor"><select value={form.doctor_id} onChange={(event) => setForm((current) => ({ ...current, doctor_id: event.target.value }))} className="input">{doctorOptions.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.user?.first_name} {doctor.user?.last_name}</option>)}</select></Field>
          <Field label="Day of week"><select value={form.day_of_week} onChange={(event) => setForm((current) => ({ ...current, day_of_week: event.target.value }))} className="input">{dayOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>
          <Field label="Start time"><input type="time" value={form.start_time} onChange={(event) => setForm((current) => ({ ...current, start_time: event.target.value }))} className="input" /></Field>
          <Field label="End time"><input type="time" value={form.end_time} onChange={(event) => setForm((current) => ({ ...current, end_time: event.target.value }))} className="input" /></Field>
          <Field label="Slot duration"><input type="number" min="5" value={form.slot_duration} onChange={(event) => setForm((current) => ({ ...current, slot_duration: event.target.value }))} className="input" /></Field>
          <Field label="Status"><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="input"><option value="active">active</option><option value="inactive">inactive</option><option value="on_leave">on_leave</option></select></Field>
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-medics-primary to-medics-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-medics-primary/20"><Plus size={16} />{selectedSchedule ? "Update schedule" : "Save schedule"}</button>
          {selectedSchedule && <button type="button" onClick={startCreate} className="w-full rounded-2xl border border-medics-light/60 px-4 py-3 text-sm font-bold text-medics-dark">Cancel edit</button>}
        </form>
      </aside>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block space-y-1.5"><span className="ml-1 text-xs font-bold uppercase tracking-[0.18em] text-medics-secondary">{label}</span>{children}</label>;
}
