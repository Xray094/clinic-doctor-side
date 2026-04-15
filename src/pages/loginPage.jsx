import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../schemas/loginSchema";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Pill,
  ClipboardList,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useLogin } from "../repos/loginRepo";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const { mutate : login} = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleFormSubmit = async (data) => {
    const payload = data
    login(payload, {
      onSuccess: () => {
        navigate("/home");
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    });
  };

  const getInputWrapperClass = (fieldName) => `
    flex items-center rounded-xl border transition-all duration-200 bg-medics-bg/40
    ${
      errors[fieldName]
        ? "border-red-400 ring-4 ring-red-50"
        : "border-medics-light focus-within:border-medics-primary focus-within:ring-4 focus-within:ring-medics-primary/10"
    }
  `;

  return (
    <div className="flex min-h-screen font-sans overflow-hidden bg-medics-bg">
      {/* ── LEFT PANEL (Branding) ── */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 relative overflow-hidden px-10 py-10 bg-gradient-to-br from-medics-primary via-medics-secondary to-medics-bg">
        {/* Abstract Background Shapes */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

        {/* Brand Logo Section */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/20">
            <img
              className="w-7 h-7"
              src="src/assets/Medics-Logo.png"
              alt="Medics Logo"
            />
          </div>
          <span className="text-white text-2xl font-black tracking-wide">
            Medics
          </span>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-xl bg-white/20">
              <img
                className="w-16 h-16"
                src="src/assets/Medics-Logo.png"
                alt="Hero Logo"
              />
            </div>
          </div>
          <h2 className="text-white text-4xl font-black leading-tight mb-4">
            Healthcare,
            <br />
            reimagined.
          </h2>
          <p className="text-white/70 text-sm max-w-xs mx-auto leading-relaxed">
            A seamless platform for modern doctors to deliver better, faster,
            smarter care.
          </p>
        </div>

        {/* Features List */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: <Calendar size={18} />, label: "Smart Scheduling" },
            { icon: <Pill size={18} />, label: "e-Prescriptions" },
            { icon: <ClipboardList size={18} />, label: "Patient Records" },
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md"
            >
              <span className="text-white">{f.icon}</span>
              <span className="text-white text-sm font-bold">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (Login Form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-medics-bg to-medics-light/10">
        <div
          className={`w-full max-w-md bg-medics-bg/70 rounded-3xl shadow-2xl px-9 py-10 border border-medics-light backdrop-blur-sm`}
        >
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-medics-primary to-medics-secondary shadow-lg shadow-medics-primary/30">
                <img
                  className="w-8 h-8"
                  src="src/assets/Medics-Logo.png"
                  alt="Form Logo"
                />
              </div>
              <h1 className="text-2xl font-black text-medics-dark mb-1">
                Sign in to Medics
              </h1>
              <p className="text-sm font-medium text-medics-accent">
                Doctor Portal Access
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-medics-secondary uppercase tracking-widest ml-1"
              >
                Email Address
              </label>
              <div className={getInputWrapperClass("email")}>
                <Mail className="ml-4 mr-2 text-medics-accent" size={18} />
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="doctor@medics.com"
                  className="flex-1 bg-transparent py-4 pr-4 text-sm font-medium outline-none text-medics-dark"
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 font-semibold ml-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-medics-secondary uppercase tracking-widest ml-1"
              >
                Password
              </label>
              <div className={getInputWrapperClass("password")}>
                <Lock className="ml-4 mr-2 text-medics-accent" size={18} />
                <input
                  {...register("password")}
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent py-4 text-sm font-medium outline-none text-medics-dark"
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="px-4 text-medics-accent hover:text-medics-secondary transition-colors focus:outline-none"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1 font-semibold ml-1">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full py-4 rounded-2xl text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-medics-primary to-medics-secondary hover:shadow-xl hover:shadow-medics-primary/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>
        <p className="mt-8 text-xs text-medics-accent/80">
          © 2026 Medics System • Clinical Standard v4.2
        </p>
      </div>
    </div>
  );
}
