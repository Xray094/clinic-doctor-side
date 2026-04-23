import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, HeartPulse, LoaderCircle, Ruler, ShieldAlert, UserCircle2, UserRound } from "lucide-react";
import { usePatientByIdQuery } from "../repos/patientRepo";
import { formatDateOnly, getPatientIdentity } from "../utils/patientUtils";

export default function PatientProfilePage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { data: patient, isLoading, isError, error } = usePatientByIdQuery(patientId);

  const patientIdentity = useMemo(() => getPatientIdentity(patient), [patient]);
  const { name, user } = patientIdentity;

  const attrs = patient?.attributes || {};
  const medical = attrs?.medical_details || {};
  const habits = attrs?.habits || {};
  const physical = attrs?.physical_stats || {};

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-medics-bg to-[#13292b] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex items-center justify-between rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-4 backdrop-blur-sm">
          <button
            onClick={() => navigate("/doctors/dashboard", { state: { openChat: true } })}
            className="inline-flex items-center gap-2 rounded-xl border border-medics-light/60 bg-medics-bg/40 px-3 py-2 text-sm font-semibold text-medics-dark transition-all hover:border-medics-secondary"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </header>

        {isLoading ? (
          <section className="grid min-h-80 place-items-center rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 text-medics-accent">
            <div className="inline-flex items-center gap-2 text-sm font-semibold">
              <LoaderCircle size={18} className="animate-spin" />
              Loading patient profile...
            </div>
          </section>
        ) : isError ? (
          <section className="rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
            {error?.response?.data?.message || "Could not load patient details."}
          </section>
        ) : (
          <section className="grid gap-4">
            <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-medics-primary/20 text-medics-dark">
                  <UserCircle2 size={32} />
                </div>

                <div>
                  <h1 className="text-2xl font-black text-medics-dark">{name}</h1>
                  <p className="mt-1 text-sm font-semibold text-medics-secondary">Patient ID: {patient?.id || "N/A"}</p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
                  <StatPill label="Gender" value={attrs?.gender} />
                  <StatPill label="Blood Type" value={attrs?.blood_type} />
                </div>
              </div>
            </article>

            <section className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 shadow-xl backdrop-blur-sm">
                <SectionHeader icon={<UserRound size={16} />} title="Account & Contact" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoRow label="Date of Birth" value={formatDateOnly(attrs?.date_of_birth)} />
                  <InfoRow label="Email" value={user?.email} />
                  <InfoRow label="Phone" value={user?.phone} />
                  <InfoRow label="Status" value={user?.user_status} />
                  <InfoRow label="Emergency Contact" value={attrs?.emergency_contact_name} />
                  <InfoRow label="Emergency Phone" value={attrs?.emergency_contact_phone} />
                </div>
              </article>

              <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 shadow-xl backdrop-blur-sm">
                <SectionHeader icon={<HeartPulse size={16} />} title="Medical Details" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoRow label="Allergies" value={medical?.allergies} />
                  <InfoRow label="Chronic Diseases" value={medical?.chronic_diseases} />
                  <InfoRow label="Smoker" value={habits?.is_smoker ? "Yes" : "No"} />
                  <InfoRow label="Drinks Alcohol" value={habits?.drinks_alcohol ? "Yes" : "No"} />
                </div>
              </article>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 shadow-xl backdrop-blur-sm">
                <SectionHeader icon={<Ruler size={16} />} title="Physical Stats" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoRow label="Weight (kg)" value={physical?.weight} />
                  <InfoRow label="Height (cm)" value={physical?.height} />
                </div>
              </article>

              <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 shadow-xl backdrop-blur-sm">
                <SectionHeader icon={<ShieldAlert size={16} />} title="Quick Notes" />
                <div className="mt-4 space-y-3 text-sm font-semibold text-medics-secondary">
                  <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
                    Keep this profile open while chatting for quick context.
                  </div>
                  <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
                    Confirm emergency contact details before critical follow-up.
                  </div>
                </div>
              </article>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-medics-primary/12 px-3 py-2 text-sm font-black text-medics-dark">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-3 py-2 text-right md:text-left">
      <p className="text-[10px] font-bold uppercase tracking-wide text-medics-secondary">{label}</p>
      <p className="mt-1 text-sm font-bold text-medics-dark">{value || "N/A"}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-medics-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-medics-dark">{value || "N/A"}</p>
    </div>
  );
}
