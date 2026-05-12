import { useState } from "react";
import { Plus, Search, PencilLine, Trash2 } from "lucide-react";
import { useDeleteVacationMutation, useDoctorsQuery, useSaveVacationMutation, useVacationsQuery } from "../../repos/adminRepo";

const emptyForm = {
  doctor_id: "",
  start_date: "",
  end_date: "",
  reason: "",
  status: "pending",
};

export default function AdminVacationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [doctorId, setDoctorId] = useState("all");
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data } = useVacationsQuery({ page, perPage: 5, search, doctorId });
  const { data: doctorsData } = useDoctorsQuery({ page: 1, perPage: 100, search: "" });
  const saveVacationMutation = useSaveVacationMutation();
  const deleteVacationMutation = useDeleteVacationMutation();
  const vacations = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, totalPages: 1, total: 0 };
  const doctors = doctorsData?.data ?? [];

  const startCreate = () => {
    setSelectedVacation(null);
    setForm({ ...emptyForm, doctor_id: doctors[0]?.id ?? "" });
    setIsFormOpen(true);
  };

  const startEdit = (vacation) => {
    setSelectedVacation(vacation);
    setForm({
      doctor_id: vacation.doctor_id,
      start_date: vacation.start_date,
      end_date: vacation.end_date,
      reason: vacation.reason,
      status: vacation.status,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedVacation(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveVacationMutation.mutate({ id: selectedVacation?.id, ...form }, { onSuccess: () => closeForm() });
  };

  return (
    <>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-medics-dark/70 p-4 backdrop-blur-sm" onClick={closeForm}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-medics-light/60 bg-medics-bg p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Vacation form</p>
                <h2 className="mt-1 text-xl font-black text-medics-dark">{selectedVacation ? "Edit vacation" : "Create vacation"}</h2>
              </div>
              <button type="button" onClick={closeForm} className="rounded-2xl border border-medics-light/60 px-3 py-2 text-sm font-bold text-medics-dark">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Doctor"><select value={form.doctor_id} onChange={(event) => setForm((current) => ({ ...current, doctor_id: event.target.value }))} className="input">{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.user?.first_name} {doctor.user?.last_name}</option>)}</select></Field>
              <Field label="Start date"><input type="date" value={form.start_date} onChange={(event) => setForm((current) => ({ ...current, start_date: event.target.value }))} className="input" /></Field>
              <Field label="End date"><input type="date" value={form.end_date} onChange={(event) => setForm((current) => ({ ...current, end_date: event.target.value }))} className="input" /></Field>
              <Field label="Reason"><textarea rows="4" value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} className="input" /></Field>
              <Field label="Status"><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="input"><option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option></select></Field>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-medics-primary to-medics-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-medics-primary/20"><Plus size={16} />{selectedVacation ? "Update vacation" : "Save vacation"}</button>
              {selectedVacation && <button type="button" onClick={closeForm} className="w-full rounded-2xl border border-medics-light/60 px-4 py-3 text-sm font-bold text-medics-dark">Cancel edit</button>}
            </form>
          </div>
        </div>
      )}

    <div className="grid gap-4">
      <section className="space-y-4">
        <div className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Doctor vacations</p>
              <h2 className="mt-1 text-xl font-black text-medics-dark">Add and review vacation days</h2>
            </div>
            <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-medics-primary to-medics-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-medics-primary/20"><Plus size={16} />New vacation</button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex min-w-72 flex-1 items-center rounded-2xl border border-medics-light/60 bg-medics-bg/35"><Search size={16} className="ml-4 text-medics-accent" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vacations..." className="w-full bg-transparent px-3 py-3 text-sm outline-none text-medics-dark" /></div>
            <select value={doctorId} onChange={(event) => setDoctorId(event.target.value)} className="rounded-2xl border border-medics-light/60 bg-medics-bg/35 px-4 py-3 text-sm font-semibold text-medics-dark"><option value="all">All doctors</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.user?.first_name} {doctor.user?.last_name}</option>)}</select>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <table className="min-w-full divide-y divide-medics-light/50">
            <thead className="bg-medics-bg/55"><tr className="text-left text-xs font-bold uppercase tracking-[0.16em] text-medics-secondary"><th className="px-4 py-3">Doctor</th><th className="px-4 py-3">Vacation days</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-medics-light/40 bg-medics-bg/20">
              {vacations.length ? vacations.map((vacation) => (<tr key={vacation.id} className="text-sm text-medics-dark"><td className="px-4 py-4"><p className="font-bold">{vacation.doctor?.user?.first_name} {vacation.doctor?.user?.last_name}</p><p className="text-xs text-medics-accent">{vacation.doctor?.specialization}</p></td><td className="px-4 py-4">{vacation.start_date} → {vacation.end_date}</td><td className="px-4 py-4">{vacation.reason}</td><td className="px-4 py-4">{vacation.status}</td><td className="px-4 py-4"><div className="flex gap-2"><button onClick={() => startEdit(vacation)} className="inline-flex items-center gap-1 rounded-xl border border-medics-light/60 px-3 py-2 text-xs font-bold text-medics-dark"><PencilLine size={14} />Edit</button><button onClick={() => deleteVacationMutation.mutate(vacation.id)} className="inline-flex items-center gap-1 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200"><Trash2 size={14} />Delete</button></div></td></tr>)) : (<tr><td colSpan="5" className="px-4 py-8 text-center text-sm font-semibold text-medics-accent">No vacations found.</td></tr>)}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-between"><button disabled={meta.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-medics-light/60 px-3 py-2 text-sm font-semibold text-medics-dark disabled:opacity-40">Previous</button><div className="text-sm font-semibold text-medics-accent">Page {meta.page} / {meta.totalPages}</div><button disabled={meta.page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-medics-light/60 px-3 py-2 text-sm font-semibold text-medics-dark disabled:opacity-40">Next</button></div>
        </div>
      </section>

    </div>
    </>
  );
}

function Field({ label, children }) {
  return <label className="block space-y-1.5"><span className="ml-1 text-xs font-bold uppercase tracking-[0.18em] text-medics-secondary">{label}</span>{children}</label>;
}
