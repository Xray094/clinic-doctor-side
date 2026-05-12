import { useMemo, useState } from "react";
import { AlertCircle, ArrowLeftRight, CalendarDays, Plus, Search, Trash2, PencilLine } from "lucide-react";
import { useDeleteDoctorMutation, useDoctorsQuery, useSaveDoctorMutation } from "../../repos/adminRepo";
import { getDoctorOptions, listAppointmentsByDoctor } from "../../services/mockClinicStore";

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
  specialization: "General Practitioner",
  bio: "",
  education: "",
  certification: "",
  years_of_experience: 1,
  session_price: "25.00",
  license_number: "",
  gender: "male",
};

const specializationOptions = [
  "General Practitioner",
  "Cardiologist",
  "Pulmonologist",
  "Gastroenterologist",
  "Otolaryngologist",
  "Dentist",
  "Ophthalmologist",
  "Urologist",
  "Hepatologist",
  "Traumatologist",
  "Gynecologist",
  "Neurologist",
  "Geneticist",
];

export default function AdminDoctorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [activeView, setActiveView] = useState("manage");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const params = { page, perPage: 5, search };
  const { data, isLoading } = useDoctorsQuery(params);
  const saveDoctorMutation = useSaveDoctorMutation();
  const deleteDoctorMutation = useDeleteDoctorMutation();
  const doctors = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, totalPages: 1, total: 0 };
  const doctorOptions = useMemo(() => getDoctorOptions(), [data]);

  const startCreate = () => {
    setSelectedDoctor(null);
    setForm(emptyForm);
    setActiveView("manage");
    setIsFormOpen(true);
  };

  const startEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setForm({
      user: {
        id: doctor.user?.id,
        first_name: doctor.user?.first_name ?? "",
        last_name: doctor.user?.last_name ?? "",
        email: doctor.user?.email ?? "",
        phone: doctor.user?.phone ?? "",
        password: "",
        user_status: doctor.user?.user_status ?? "active",
        wallet_balance: doctor.user?.wallet_balance ?? "0.00",
      },
      specialization: doctor.specialization ?? "General Practitioner",
      bio: doctor.bio ?? "",
      education: doctor.education ?? "",
      certification: doctor.certification ?? "",
      years_of_experience: doctor.years_of_experience ?? 1,
      session_price: doctor.session_price ?? "25.00",
      license_number: doctor.license_number ?? "",
      gender: doctor.gender ?? "male",
    });
    setActiveView("manage");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedDoctor(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveDoctorMutation.mutate(
      {
        id: selectedDoctor?.id,
        user: form.user,
        specialization: form.specialization,
        bio: form.bio,
        education: form.education,
        certification: form.certification,
        years_of_experience: form.years_of_experience,
        session_price: form.session_price,
        license_number: form.license_number,
        gender: form.gender,
      },
      {
        onSuccess: () => {
          closeForm();
        },
      },
    );
  };

  const doctorSchedules = useMemo(() => {
    if (!selectedDoctor) {
      return [];
    }

    return doctorOptions.find((doctor) => doctor.id === selectedDoctor.id)?.schedules ?? [];
  }, [doctorOptions, selectedDoctor]);

  const doctorVacations = useMemo(() => {
    if (!selectedDoctor) {
      return [];
    }

    return doctorOptions.find((doctor) => doctor.id === selectedDoctor.id)?.vacations ?? [];
  }, [doctorOptions, selectedDoctor]);

  return (
    <>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-medics-dark/70 p-4 backdrop-blur-sm" onClick={closeForm}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-medics-light/60 bg-medics-bg p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Doctor register form</p>
                <h2 className="mt-1 text-xl font-black text-medics-dark">{selectedDoctor ? "Edit doctor account" : "Create doctor account"}</h2>
                <p className="mt-1 text-sm font-medium text-medics-accent">Saving here creates login-ready mock users with the same backend-ready fields.</p>
              </div>
              <button type="button" onClick={closeForm} className="rounded-2xl border border-medics-light/60 px-3 py-2 text-sm font-bold text-medics-dark">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <FieldGroup label="First name"><input value={form.user.first_name} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, first_name: event.target.value } }))} className="input" /></FieldGroup>
              <FieldGroup label="Last name"><input value={form.user.last_name} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, last_name: event.target.value } }))} className="input" /></FieldGroup>
              <FieldGroup label="Email"><input type="email" value={form.user.email} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, email: event.target.value } }))} className="input" /></FieldGroup>
              <FieldGroup label="Phone"><input value={form.user.phone} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, phone: event.target.value } }))} className="input" /></FieldGroup>
              <FieldGroup label="Password"><input value={form.user.password} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, password: event.target.value } }))} placeholder={selectedDoctor ? "Leave empty to keep current password" : "Required for login"} className="input" /></FieldGroup>
              <FieldGroup label="Status"><select value={form.user.user_status} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, user_status: event.target.value } }))} className="input"><option value="active">active</option><option value="pending">pending</option><option value="suspended">suspended</option></select></FieldGroup>
              <FieldGroup label="Wallet balance"><input value={form.user.wallet_balance} onChange={(event) => setForm((current) => ({ ...current, user: { ...current.user, wallet_balance: event.target.value } }))} className="input" /></FieldGroup>
              <FieldGroup label="Specialization"><select value={form.specialization} onChange={(event) => setForm((current) => ({ ...current, specialization: event.target.value }))} className="input">{specializationOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></FieldGroup>
              <FieldGroup label="Education"><input value={form.education} onChange={(event) => setForm((current) => ({ ...current, education: event.target.value }))} className="input" /></FieldGroup>
              <FieldGroup label="Certification"><input value={form.certification} onChange={(event) => setForm((current) => ({ ...current, certification: event.target.value }))} className="input" /></FieldGroup>
              <FieldGroup label="Years of experience"><input type="number" min="0" value={form.years_of_experience} onChange={(event) => setForm((current) => ({ ...current, years_of_experience: event.target.value }))} className="input" /></FieldGroup>
              <FieldGroup label="Session price"><input value={form.session_price} onChange={(event) => setForm((current) => ({ ...current, session_price: event.target.value }))} className="input" /></FieldGroup>
              <FieldGroup label="License number"><input value={form.license_number} onChange={(event) => setForm((current) => ({ ...current, license_number: event.target.value }))} className="input" /></FieldGroup>
              <FieldGroup label="Gender"><select value={form.gender} onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))} className="input"><option value="male">male</option><option value="female">female</option></select></FieldGroup>
              <FieldGroup label="Bio"><textarea rows="4" value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} className="input" /></FieldGroup>

              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-medics-primary to-medics-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-medics-primary/20">
                <Plus size={16} />
                {selectedDoctor ? "Update doctor" : "Save doctor"}
              </button>

              {selectedDoctor && (
                <button type="button" onClick={closeForm} className="w-full rounded-2xl border border-medics-light/60 px-4 py-3 text-sm font-bold text-medics-dark">Cancel edit</button>
              )}

              {selectedDoctor && (
                <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 p-4 text-sm text-medics-accent">
                  <p className="font-bold text-medics-dark">Related appointments</p>
                  <div className="mt-3 space-y-2">
                    {listAppointmentsByDoctor(selectedDoctor.id).slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="rounded-xl border border-medics-light/60 bg-medics-bg/35 px-3 py-2">
                        {appointment.appointment_date} · {appointment.status}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
      <section className="space-y-4">
        <div className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medics-secondary">Doctor accounts</p>
              <h2 className="mt-1 text-xl font-black text-medics-dark">Create, edit, and delete doctors</h2>
            </div>
            <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-medics-primary to-medics-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-medics-primary/20">
              <Plus size={16} />
              New doctor
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex min-w-72 flex-1 items-center rounded-2xl border border-medics-light/60 bg-medics-bg/35">
              <Search size={16} className="ml-4 text-medics-accent" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search doctors, email, specialization..." className="w-full bg-transparent px-3 py-3 text-sm outline-none text-medics-dark" />
            </div>
            <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/35 px-4 py-3 text-sm font-semibold text-medics-dark">Total: {meta.total}</div>
            <div className="rounded-2xl border border-medics-light/60 bg-medics-bg/35 px-4 py-3 text-sm font-semibold text-medics-dark">Page {meta.page} / {meta.totalPages}</div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-medics-light/60 bg-medics-bg/25 p-5">
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-medics-light/60 bg-medics-bg/30 p-1 text-sm font-bold text-medics-accent">
            {["manage", "schedules", "vacations"].map((tab) => (
              <button key={tab} onClick={() => setActiveView(tab)} className={`flex-1 rounded-xl px-4 py-2 capitalize transition-all ${activeView === tab ? "bg-medics-primary/18 text-medics-dark" : "hover:text-medics-dark"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeView === "manage" && (
            <div className="overflow-hidden rounded-[1.5rem] border border-medics-light/60">
              <table className="min-w-full divide-y divide-medics-light/50">
                <thead className="bg-medics-bg/55">
                  <tr className="text-left text-xs font-bold uppercase tracking-[0.16em] text-medics-secondary">
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Specialization</th>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3">Schedule</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-medics-light/40 bg-medics-bg/20">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-sm font-semibold text-medics-accent">Loading doctors...</td>
                    </tr>
                  ) : doctors.length ? doctors.map((doctor) => (
                    <tr key={doctor.id} className="text-sm text-medics-dark">
                      <td className="px-4 py-4">
                        <p className="font-bold">{doctor.user?.first_name} {doctor.user?.last_name}</p>
                        <p className="text-xs text-medics-accent">{doctor.user?.email}</p>
                      </td>
                      <td className="px-4 py-4">{doctor.specialization}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold">{doctor.user?.user_status}</p>
                        <p className="text-xs text-medics-accent">${doctor.session_price}</p>
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-medics-accent">{doctor.schedules_count} schedules · {doctor.vacations_count} vacations</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => startEdit(doctor)} className="inline-flex items-center gap-1 rounded-xl border border-medics-light/60 px-3 py-2 text-xs font-bold text-medics-dark"><PencilLine size={14} />Edit</button>
                          <button onClick={() => deleteDoctorMutation.mutate(doctor.id)} className="inline-flex items-center gap-1 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200"><Trash2 size={14} />Delete</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-sm font-semibold text-medics-accent">No doctors found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeView === "schedules" && (
            <div className="space-y-3">
              {doctorOptions.map((doctor) => (
                <div key={doctor.id} className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-medics-dark">{doctor.user?.first_name} {doctor.user?.last_name}</p>
                      <p className="text-sm text-medics-accent">{doctor.specialization}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-medics-primary/12 px-3 py-1 text-xs font-bold text-medics-secondary">
                      <CalendarDays size={12} />
                      {doctor.schedules_count} schedules
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {(doctor.schedules ?? []).map((schedule) => (
                      <div key={schedule.id} className="rounded-xl border border-medics-light/60 bg-medics-bg/40 px-3 py-2 text-sm font-medium text-medics-dark">{schedule.day_of_week} · {schedule.start_time}-{schedule.end_time} · {schedule.status}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === "vacations" && (
            <div className="space-y-3">
              {doctorOptions.map((doctor) => (
                <div key={doctor.id} className="rounded-2xl border border-medics-light/60 bg-medics-bg/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-medics-dark">{doctor.user?.first_name} {doctor.user?.last_name}</p>
                      <p className="text-sm text-medics-accent">{doctor.vacations_count} vacation records</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-medics-primary/12 px-3 py-1 text-xs font-bold text-medics-secondary">
                      <ArrowLeftRight size={12} />
                      Ready for leave planning
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {(doctor.vacations ?? []).map((vacation) => (
                      <div key={vacation.id} className="rounded-xl border border-medics-light/60 bg-medics-bg/40 px-3 py-2 text-sm font-medium text-medics-dark">{vacation.start_date} → {vacation.end_date} · {vacation.status}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-medics-accent">
            <button disabled={meta.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-medics-light/60 px-3 py-2 disabled:opacity-40">Previous</button>
            <button disabled={meta.page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-medics-light/60 px-3 py-2 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

function FieldGroup({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="ml-1 text-xs font-bold uppercase tracking-[0.18em] text-medics-secondary">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "input";
