import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";

const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("request"); // "request" | "confirm"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const post = (path, body) =>
    fetch(`${backendBase}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const requestCode = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    if (!email.trim()) return setError("Please enter your email.");
    setLoading(true);
    try {
      const res = await post("/api/password/reset/request/", { email: email.trim() });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Something went wrong.");
      setInfo("If that email is registered, a 6-digit code has been sent. Check your inbox (and spam).");
      setStep("confirm");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    if (!otp.trim()) return setError("Enter the code from your email.");
    if (pw.length < 6) return setError("Password must be at least 6 characters.");
    if (pw !== pw2) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const res = await post("/api/password/reset/confirm/", {
        email: email.trim(), otp: otp.trim(), new_password: pw,
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Could not reset password.");
      setInfo("Password reset! Redirecting to sign in…");
      setTimeout(() => navigate("/login"), 1400);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {step === "request"
            ? "Enter your email and we'll send you a reset code."
            : "Enter the code we emailed you and choose a new password."}
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
            {error}
          </div>
        )}
        {info && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm">
            {info}
          </div>
        )}

        {step === "request" ? (
          <form onSubmit={requestCode} className="mt-5 space-y-4" noValidate>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" autoCapitalize="none" placeholder="Email address"
                value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-lg btn-primary w-full">
              {loading ? "Sending…" : (<>Send reset code <ArrowRight size={18} /></>)}
            </button>
          </form>
        ) : (
          <form onSubmit={confirmReset} className="mt-5 space-y-4" noValidate>
            <div className="relative">
              <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input inputMode="numeric" maxLength={6} placeholder="6-digit code"
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="input pl-11 tracking-[0.3em] font-semibold" required />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type={showPw ? "text" : "password"} placeholder="New password"
                value={pw} onChange={(e) => setPw(e.target.value)} className="input pl-11 pr-12" required />
              <button type="button" onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type={showPw ? "text" : "password"} placeholder="Confirm new password"
                value={pw2} onChange={(e) => setPw2(e.target.value)} className="input pl-11" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-lg btn-primary w-full">
              {loading ? "Resetting…" : "Reset password"}
            </button>
            <button type="button" onClick={() => { setStep("request"); setError(""); setInfo(""); }}
              className="w-full text-center text-sm text-slate-500 dark:text-slate-400 hover:underline">
              Use a different email / resend code
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}