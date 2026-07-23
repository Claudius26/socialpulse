import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { KeyRound, MailCheck } from "lucide-react";
import { setUser } from "../features/auth/authSlice";
import AuthShell from "../components/auth/AuthShell";

const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setEmail(p.get("email") || "");
  }, [location.search]);

  const verify = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    if (!email) return setError("Missing email — please register or sign in again.");
    if (otp.trim().length < 4) return setError("Enter the code from your email.");
    setLoading(true);
    try {
      const res = await fetch(`${backendBase}/api/email/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",   // store the HttpOnly session cookies
        body: JSON.stringify({ email, otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Verification failed.");
      // Verified → we're signed in.
      dispatch(setUser({ user: data.user, summary: data.summary, token: data.token, refresh: data.refresh }));
      navigate("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError(""); setInfo("");
    if (!email) return setError("Missing email — please register or sign in again.");
    setResending(true);
    try {
      await fetch(`${backendBase}/api/email/resend/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setInfo("A new code has been sent. Check your inbox (and spam).");
    } catch {
      setError("Could not resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell>
      <div>
        <div className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 mb-3">
          <MailCheck size={24} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Verify your email
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          We emailed a 6-digit code to {email ? <strong className="text-slate-700 dark:text-slate-200">{email}</strong> : "your email"}.
          Enter it below to activate your account.
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

        <form onSubmit={verify} className="mt-5 space-y-4" noValidate>
          <div className="relative">
            <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="input pl-11 tracking-[0.3em] font-semibold"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-lg btn-primary w-full">
            {loading ? "Verifying…" : "Verify & continue"}
          </button>
        </form>

        <button
          type="button"
          onClick={resend}
          disabled={resending}
          className="mt-3 w-full text-center text-sm text-brand-600 dark:text-brand-400 hover:underline"
        >
          {resending ? "Sending…" : "Didn't get it? Resend code"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Wrong email?{" "}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Register again
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}