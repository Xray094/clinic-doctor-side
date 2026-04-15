import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseMedical,
  GraduationCap,
  BadgeCheck,
  Timer,
  IdCard,
  Wallet,
  Mail,
  Phone,
  UserCircle2,
  LoaderCircle,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useDoctorProfile } from "../repos/doctorRepo";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const doctorId = useMemo(() => {
    return user?.id ?? user?.attributes?.id ?? user?.doctor_id ?? null;
  }, [user]);

  const { data, isLoading, isError } = useDoctorProfile(doctorId);

  const doctorData = data?.data;
  const details = doctorData?.attributes;
  const account = doctorData?.relationships?.user;

  const fullName = `${account?.first_name ?? "Doctor"} ${account?.last_name ?? ""}`.trim();

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-medics-bg  p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-4 backdrop-blur-sm">
          <button
            onClick={() => navigate("/doctors/dashboard")}
            className="inline-flex items-center gap-2 rounded-xl border border-medics-light/60 bg-medics-bg/40 px-3 py-2 text-sm font-semibold text-medics-dark transition-all hover:border-medics-secondary"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </header>

        {isLoading ? (
          <section className="grid min-h-80 place-items-center rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 text-medics-accent">
            <div className="inline-flex items-center gap-2 text-sm font-semibold">
              <LoaderCircle size={18} className="animate-spin" />
              Loading profile...
            </div>
          </section>
        ) : isError || !doctorData ? (
          <section className="rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
            Could not load profile details.
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-medics-primary/20 text-medics-dark">
                  <UserCircle2 size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-medics-dark">{fullName}</h1>
                  <p className="mt-1 text-sm font-semibold text-medics-secondary">{details?.specialization ?? "No specialization"}</p>
                  <p className="mt-1 text-xs font-medium text-medics-accent">License: {details?.license_number ?? "N/A"}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoRow icon={<BriefcaseMedical size={16} />} label="Specialization" value={details?.specialization} />
                <InfoRow icon={<GraduationCap size={16} />} label="Education" value={details?.education} />
                <InfoRow icon={<BadgeCheck size={16} />} label="Certification" value={details?.certification} />
                <InfoRow icon={<Timer size={16} />} label="Experience" value={`${details?.years_of_experience ?? 0} years`} />
                <InfoRow icon={<IdCard size={16} />} label="License Number" value={details?.license_number} />
                <InfoRow icon={<Wallet size={16} />} label="Session Price" value={`$${details?.session_price ?? "0.00"}`} />
              </div>

              <div className="mt-4 rounded-xl border border-medics-light/60 bg-medics-bg/30 p-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-medics-secondary">Bio</h2>
                <p className="mt-2 text-sm leading-relaxed text-medics-dark">{details?.bio ?? "No bio available."}</p>
              </div>
            </article>

            <article className="rounded-2xl border border-medics-light/60 bg-medics-bg/60 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-lg font-black text-medics-dark">Account Details</h2>
              <div className="mt-4 space-y-3">
                <InfoRow icon={<Mail size={16} />} label="Email" value={account?.email} />
                <InfoRow icon={<Phone size={16} />} label="Phone" value={account?.phone ?? "Not provided"} />
                <InfoRow icon={<Wallet size={16} />} label="Wallet Balance" value={`$${account?.wallet_balance ?? "0.00"}`} />
                <InfoRow icon={<BadgeCheck size={16} />} label="Status" value={account?.user_status ?? "Unknown"} />
              </div>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-medics-light/60 bg-medics-bg/30 px-4 py-3">
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-medics-secondary">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-medics-dark">{value ?? "N/A"}</p>
    </div>
  );
}
