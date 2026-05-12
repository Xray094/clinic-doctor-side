import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { loginMockAccount, mockAdminCredentials } from "../../services/mockClinicStore";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password is required"),
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: mockAdminCredentials,
  });

  useEffect(() => {
    const currentRole = user?.role ?? user?.attributes?.role ?? user?.roles?.[0];
    if (isAuthenticated && currentRole === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogin = async (payload) => {
    const response = loginMockAccount({ ...payload, role: "admin" });

    if (!response) {
      return;
    }

    setAuth(response.data.user, response.data.token);
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-medics-bg">
      <section className="hidden w-6/12 flex-col justify-between bg-linear-to-br from-medics-primary via-medics-secondary to-[#102325] p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/75">Medics</p>
            <h1 className="text-2xl font-black text-white">Admin Control Room</h1>
          </div>
        </div>

        <div className="max-w-lg space-y-6">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/70">Mock admin login</p>
          <h2 className="text-5xl font-black leading-tight text-white">Manage doctors, patients, and schedules before the backend is ready.</h2>
          <p className="text-base leading-7 text-white/75">This login is wired to the same future-ready shape as the Laravel backend. Every record is mock today, but the layouts and payloads mirror the models already.</p>
        </div>

        <div className="grid gap-3 rounded-4xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white/75">
            <Sparkles size={14} />
            Default credentials
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold">Email: {mockAdminCredentials.email}</div>
          <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold">Password: {mockAdminCredentials.password}</div>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center p-5 sm:p-8 lg:w-6/12">
        <div className="w-full max-w-lg rounded-4xl border border-medics-light/70 bg-medics-bg/70 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-medics-secondary">Admin sign in</p>
              <h2 className="mt-2 text-3xl font-black text-medics-dark">Welcome back</h2>
              <p className="mt-1 text-sm font-medium text-medics-accent">Enter the admin account to open the console.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="ml-1 block text-xs font-bold uppercase tracking-[0.22em] text-medics-secondary">Email address</label>
              <div className={`flex items-center rounded-2xl border bg-medics-bg/40 transition-all ${errors.email ? "border-red-400 ring-4 ring-red-50" : "border-medics-light focus-within:border-medics-primary focus-within:ring-4 focus-within:ring-medics-primary/10"}`}>
                <Mail size={18} className="ml-4 mr-2 text-medics-accent" />
                <input {...register("email")} className="w-full bg-transparent py-4 pr-4 text-sm font-medium outline-none text-medics-dark" placeholder="admin@medics.local" />
              </div>
              {errors.email && <p className="flex items-center gap-1 text-xs font-semibold text-red-500"><AlertCircle size={12} />{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 block text-xs font-bold uppercase tracking-[0.22em] text-medics-secondary">Password</label>
              <div className={`flex items-center rounded-2xl border bg-medics-bg/40 transition-all ${errors.password ? "border-red-400 ring-4 ring-red-50" : "border-medics-light focus-within:border-medics-primary focus-within:ring-4 focus-within:ring-medics-primary/10"}`}>
                <Lock size={18} className="ml-4 mr-2 text-medics-accent" />
                <input {...register("password")} type={showPassword ? "text" : "password"} className="w-full bg-transparent py-4 text-sm font-medium outline-none text-medics-dark" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="px-4 text-medics-accent transition-colors hover:text-medics-secondary">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="flex items-center gap-1 text-xs font-semibold text-red-500"><AlertCircle size={12} />{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-medics-primary to-medics-secondary px-4 py-4 text-sm font-extrabold text-white shadow-lg shadow-medics-primary/30 transition-all hover:shadow-xl hover:shadow-medics-primary/40 disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <>Open admin panel <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>}
            </button>

            <button
              type="button"
              onClick={() => {
                setValue("email", mockAdminCredentials.email);
                setValue("password", mockAdminCredentials.password);
              }}
              className="w-full rounded-2xl border border-medics-light/60 bg-medics-bg/35 px-4 py-3 text-sm font-bold text-medics-dark transition-all hover:border-medics-secondary"
            >
              Fill mock admin credentials
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
