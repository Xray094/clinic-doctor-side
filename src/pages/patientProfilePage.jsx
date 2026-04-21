import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, UserCircle2 } from "lucide-react";
import { getPatientById } from "../services/patientService";

export default function PatientProfilePage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPatient = async () => {
      setIsLoading(true);
      setError("");

      try {
        const payload = await getPatientById(patientId);
        const patientData = payload?.data?.data ?? payload?.data ?? payload;

        if (!cancelled) {
          setPatient(patientData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || "Could not load patient details.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    if (patientId) {
      loadPatient();
    }

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const name = useMemo(() => {
    const first = patient?.relationships?.user?.first_name || "Patient";
    const last = patient?.relationships?.user?.last_name || "";
    return `${first} ${last}`.trim();
  }, [patient]);

  const attrs = patient?.attributes || {};
  const medical = attrs?.medical_details || {};
  const habits = attrs?.habits || {};
  const physical = attrs?.physical_stats || {};

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-medics-bg to-[#13292b] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-4">
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
        ) : error ? (
          <section className="rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
            {error}
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-medics-primary/20 text-medics-dark">
                  <UserCircle2 size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-medics-dark">{name}</h1>
                  <p className="mt-1 text-sm font-semibold text-medics-secondary">Patient ID: {patient?.id || "N/A"}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoRow label="Date of Birth" value={attrs?.date_of_birth} />
                <InfoRow label="Gender" value={attrs?.gender} />
                <InfoRow label="Blood Type" value={attrs?.blood_type} />
                <InfoRow label="Emergency Contact" value={attrs?.emergency_contact_name} />
                <InfoRow label="Emergency Phone" value={attrs?.emergency_contact_phone} />
                <InfoRow label="Allergies" value={medical?.allergies} />
                <InfoRow label="Chronic Diseases" value={medical?.chronic_diseases} />
                <InfoRow label="Weight" value={physical?.weight} />
                <InfoRow label="Height" value={physical?.height} />
                <InfoRow label="Smoker" value={habits?.is_smoker ? "Yes" : "No"} />
                <InfoRow label="Drinks Alcohol" value={habits?.drinks_alcohol ? "Yes" : "No"} />
              </div>
            </article>

            <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-lg font-black text-medics-dark">Patient Summary</h2>
              <div className="mt-4 space-y-3 text-sm font-semibold text-medics-secondary">
                <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
                  Keep this profile open while chatting for quick context.
                </div>
                <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
                  Use emergency details before planning critical follow-up.
                </div>
              </div>
            </article>
          </section>
        )}
      </div>
    </main>
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
