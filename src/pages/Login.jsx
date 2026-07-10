import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react";
import { setUser, setError, selectAuthError } from "../features/auth/authSlice";
import AuthShell, { SocialAuth, ExploreCard } from "../components/auth/AuthShell";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector(selectAuthError);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [lockUntil, setLockUntil] = useState(0);   // ms timestamp the lock ends
  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState("email");         // "email" | "username" (placeholder only)

  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  // Tick every second while locked so the countdown updates.
  useEffect(() => {
    if (!lockUntil) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lockUntil]);

  const lockRemaining = Math.max(0, Math.ceil((lockUntil - now) / 1000));
  const isLocked = lockRemaining > 0;
  const mmss = `${String(Math.floor(lockRemaining / 60)).padStart(2, "0")}:${String(lockRemaining % 60).padStart(2, "0")}`;

  const validate = () => {
    if (!formData.email.trim()) return "Please enter your email or username.";
    if (formData.email.includes("@") && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      return "Please enter a valid email.";
    if (!formData.password) return "Please enter your password.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    dispatch(setError(null));
    setLocalError(null);
    const clientErr = validate();
    if (clientErr) {
      setLocalError(clientErr);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${backendBase}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        // 429 = too many failed attempts: lock the button + count down.
        if (response.status === 429 && data.retry_after) {
          setLockUntil(Date.now() + Number(data.retry_after) * 1000);
        }
        dispatch(setError(data.error || "Login failed"));
        return;
      }
      dispatch(setUser({ user: data.user, summary: data.summary, token: data.token }));
      navigate("/dashboard");
    } catch {
      setLoading(false);
      dispatch(setError("Network error. Please try again."));
    }
  };

  return (
    <AuthShell>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back! <span className="align-middle">👋</span>
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Log in to access your virtual numbers and manage your account.
        </p>

        {/* Tabs (placeholder hint only — the field accepts email OR username) */}
        <div className="mt-6 flex gap-6 border-b border-slate-200 dark:border-slate-800 text-sm font-semibold">
          {[["email", "Email / Phone"], ["username", "Username"]].map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`-mb-px pb-2 border-b-2 transition ${
                tab === k
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {(authError || localError) && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
            {localError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoCapitalize="none"
              placeholder={tab === "username" ? "Your username" : "Email or phone number"}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input pl-11"
              required
            />
          </div>

          <div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input pl-11 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isLocked}
            className="btn btn-lg btn-primary w-full"
          >
            {isLocked ? `Try again in ${mmss}` : loading ? "Signing in..." : (<>Log In <ArrowRight size={18} /></>)}
          </button>
        </form>

        <SocialAuth />
        <ExploreCard />

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don&rsquo;t have an account?{" "}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default Login;