import { useState } from "react";
import { Plus, Search, PencilLine, Trash2 } from "lucide-react";
import { useDeletePatientMutation, usePatientsQuery, useSavePatientMutation } from "../../repos/adminRepo";

const emptyForm = {
  user: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    user_status: "active",
    wallet_balance: "0.00",
  },
  emergency_contact_name: "",
  emergency_contact_phone: "",
  allergies: "",
  chronic_diseases: "",
  weight: "",
  height: "",
  gender: "male",
  blood_type: "A+",
  date_of_birth: "",
};

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function AdminPatientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading } = usePatientsQuery({ page, perPage: 5, search });
  const savePatientMutation = useSavePatientMutation();
  const deletePatientMutation = useDeletePatientMutation();
  const patients = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, totalPages: 1, total: 0 };

  const startCreate = () => {
    setSelectedPatient(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const startEdit = (patient) => {
    setSelectedPatient(patient);
    setForm({
      user: {
        id: patient.user?.id,
        first_name: patient.user?.first_name ?? "",
        last_name: patient.user?.last_name ?? "",
        email: patient.user?.email ?? "",
        phone: patient.user?.phone ?? "",
        password: "",
        user_status: patient.user?.user_status ?? "active",
        wallet_balance: patient.user?.wallet_balance ?? "0.00",
      },
      emergency_contact_name: patient.emergency_contact_name ?? "",
      emergency_contact_phone: patient.emergency_contact_phone ?? "",
      allergies: patient.allergies ?? "",
      chronic_diseases: patient.chronic_diseases ?? "",
      weight: patient.weight ?? "",
      height: patient.height ?? "",
      gender: patient.gender ?? "male",
      blood_type: patient.blood_type ?? "A+",
      date_of_birth: patient.date_of_birth ?? "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedPatient(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    savePatientMutation.mutate(
      {
        id: selectedPatient?.id,
        user: form.user,
        emergency_contact_name: form.emergency_contact_name,
        emergency_contact_phone: form.emergency_contact_phone,
        allergies: form.allergies,
        chronic_diseases: form.chronic_diseases,
        weight: form.weight,
        height: form.height,
        gender: form.gender,
        blood_type: form.blood_type,
        date_of_birth: form.date_of_birth,
      },
      { onSuccess: () => closeForm() },
    );
  };

  return (
    <>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-medics-dark/70 p-4 backdrop-blur-sm" onClick={closeForm}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-medics-light/60 bg-medics-bg p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Patient register form</p>
                <h2 className="mt-1 text-xl font-black text-medics-dark">{selectedPatient ? "Edit patient" : "Create patient"}</h2>
              </div>
              <button type="button" onClick={closeForm} className="rounded-2xl border border-medics-light/60 px-3 py-2 text-sm font-bold text-medics-dark">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="First name"><input value={form.user.first_name} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, first_name: event.target.value } }))} className="input" /></Field>
              <Field label="Last name"><input value={form.user.last_name} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, last_name: event.target.value } }))} className="input" /></Field>
              <Field label="Email"><input value={form.user.email} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, email: event.target.value } }))} className="input" /></Field>
              <Field label="Phone"><input value={form.user.phone} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, phone: event.target.value } }))} className="input" /></Field>
              <Field label="Password"><input value={form.user.password} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, password: event.target.value } }))} className="input" /></Field>
              <Field label="User status"><select value={form.user.user_status} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, user_status: event.target.value } }))} className="input"><option value="active">active</option><option value="pending">pending</option><option value="suspended">suspended</option></select></Field>
              <Field label="Wallet balance"><input value={form.user.wallet_balance} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, wallet_balance: event.target.value } }))} className="input" /></Field>
              <Field label="Emergency contact name"><input value={form.emergency_contact_name} onChange={(event) => setForm((current) => ({ ...current, emergency_contact_name: event.target.value }))} className="input" /></Field>
              <Field label="Emergency contact phone"><input value={form.emergency_contact_phone} onChange={(event) => setForm((current) => ({ ...current, emergency_contact_phone: event.target.value }))} className="input" /></Field>
              <Field label="Allergies"><input value={form.allergies} onChange={(event) => setForm((current) => ({ ...current, allergies: event.target.value }))} className="input" /></Field>
              <Field label="Chronic diseases"><input value={form.chronic_diseases} onChange={(event) => setForm((current) => ({ ...current, chronic_diseases: event.target.value }))} className="input" /></Field>
              <Field label="Weight"><input value={form.weight} onChange={(event) => setForm((current) => ({ ...current, weight: event.target.value }))} className="input" /></Field>
              <Field label="Height"><input value={form.height} onChange={(event) => setForm((current) => ({ ...current, height: event.target.value }))} className="input" /></Field>
              <Field label="Gender"><select value={form.gender} onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))} className="input"><option value="male">male</option><option value="female">female</option></select></Field>
              <Field label="Blood type"><select value={form.blood_type} onChange={(event) => setForm((current) => ({ ...current, blood_type: event.target.value }))} className="input">{bloodTypes.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>
              <Field label="Date of birth"><input type="date" value={form.date_of_birth} onChange={(event) => setForm((current) => ({ ...current, date_of_birth: event.target.value }))} className="input" /></Field>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-medics-primary to-medics-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-medics-primary/20"><Plus size={16} />{selectedPatient ? "Update patient" : "Save patient"}</button>
              {selectedPatient && <button type="button" onClick={closeForm} className="w-full rounded-2xl border border-medics-light/60 px-4 py-3 text-sm font-bold text-medics-dark">Cancel edit</button>}
            </form>
          </div>
        </div>
      )}

    <div className="grid gap-4">
      <section className="space-y-4">
        <div className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Patient accounts</p>
              <h2 className="mt-1 text-xl font-black text-medics-dark">Create, edit, and delete patients</h2>
            </div>
            <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-medics-primary to-medics-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-medics-primary/20"><Plus size={16} />New patient</button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex min-w-72 flex-1 items-center rounded-2xl border border-medics-light/60 bg-medics-bg/35"><Search size={16} className="ml-4 text-medics-accent" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patients..." className="w-full bg-transparent px-3 py-3 text-sm outline-none text-medics-dark" /></div>
            <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/35 px-4 py-3 text-sm font-semibold text-medics-dark">Total: {meta.total}</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <table className="min-w-full divide-y divide-medics-light/50">
            <thead className="bg-medics-bg/55"><tr className="text-left text-xs font-bold uppercase tracking-[0.16em] text-medics-secondary"><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Blood</th><th className="px-4 py-3">Emergency contact</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-medics-light/40 bg-medics-bg/20">
              {isLoading ? (<tr><td colSpan="4" className="px-4 py-8 text-center text-sm font-semibold text-medics-accent">Loading patients...</td></tr>) : patients.length ? patients.map((patient) => (<tr key={patient.id} className="text-sm text-medics-dark"><td className="px-4 py-4"><p className="font-bold">{patient.user?.first_name} {patient.user?.last_name}</p><p className="text-xs text-medics-accent">{patient.user?.email}</p></td><td className="px-4 py-4">{patient.blood_type}</td><td className="px-4 py-4"><p className="font-semibold">{patient.emergency_contact_name}</p><p className="text-xs text-medics-accent">{patient.emergency_contact_phone}</p></td><td className="px-4 py-4"><div className="flex gap-2"><button onClick={() => startEdit(patient)} className="inline-flex items-center gap-1 rounded-xl border border-medics-light/60 px-3 py-2 text-xs font-bold text-medics-dark"><PencilLine size={14} />Edit</button><button onClick={() => deletePatientMutation.mutate(patient.id)} className="inline-flex items-center gap-1 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200"><Trash2 size={14} />Delete</button></div></td></tr>)) : (<tr><td colSpan="4" className="px-4 py-8 text-center text-sm font-semibold text-medics-accent">No patients found.</td></tr>)}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-between"><button disabled={meta.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-medics-light/60 px-3 py-2 text-sm font-semibold text-medics-dark disabled:opacity-40">Previous</button><button disabled={meta.page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-medics-light/60 px-3 py-2 text-sm font-semibold text-medics-dark disabled:opacity-40">Next</button></div>
        </div>
      </section>

    </div>
    </>
  );
}

function Field({ label, children }) {
  return <label className="block space-y-1.5"><span className="ml-1 text-xs font-bold uppercase tracking-[0.18em] text-medics-secondary">{label}</span>{children}</label>;
}
