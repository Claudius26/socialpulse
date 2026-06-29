import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Eye, EyeOff, Sparkles, ShieldCheck, Home } from "lucide-react";
import { setUser, setError, selectAuthError } from "../features/auth/authSlice";
import socialImage from "../images/socialImage.jpg";


function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector(selectAuthError);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  const validate = () => {
    if (!formData.email.trim()) return "Please enter your email.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) return "Please enter a valid email.";
    if (!formData.password) return "Please enter your password.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="w-full max-w-4xl card overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden md:flex flex-col items-center justify-center p-8 lg:p-10 bg-gradient-to-br from-brand-600 to-violet-600 text-white gap-6 overflow-hidden">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />

          <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} /> SocialPulse
          </span>

          <img
            src={socialImage}
            alt="Social Pulse"
            className="relative w-3/4 rounded-2xl shadow-2xl ring-1 ring-white/20"
          />
          <div className="relative text-center">
            <h3 className="text-2xl font-bold">Welcome back!</h3>
            <p className="mt-2 text-brand-100/90">
              Sign in to manage your boosts, wallet and virtual numbers.
            </p>
          </div>

          <div className="relative flex items-center gap-2 text-sm text-brand-100/90">
            <ShieldCheck size={16} /> Bank-grade security
          </div>

          <button
            onClick={() => navigate("/")}
            className="relative btn btn-sm bg-white/15 text-white hover:bg-white/25 border border-white/20"
          >
            <Home size={16} /> Home
          </button>
        </div>

        {/* Form panel */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10">
          <p className="eyebrow mb-2">Sign in</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Sign in to SocialPulse
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Fast, secure access to your account
          </p>

          {(authError || localError) && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
              {localError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pr-12"
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500/30"
                />
                <span className="text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link to="/support" className="font-medium text-brand-600 dark:text-brand-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-lg btn-primary w-full"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
            Don&rsquo;t have an account?{" "}
            <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
