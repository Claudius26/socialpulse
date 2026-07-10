import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, User, Mail, Phone, Globe, Lock, ArrowRight } from "lucide-react";
import { SUPPORTED_COUNTRIES } from "../data/supportedCountries";
import {
  setUser,
  setError as setAuthError,
  selectAuthError,
} from "../features/auth/authSlice";
import AuthShell, { SocialAuth, ExploreCard } from "../components/auth/AuthShell";

const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

function Register() {
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const clearMessages = () => {
    dispatch(setAuthError(null));
    setSuccessMessage("");
    setLocalError(null);
  };

  const validate = () => {
    if (!formData.full_name.trim()) return "Please enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      return "Please enter a valid email.";
    if (!formData.phone.trim()) return "Please enter your phone number.";
    if (!formData.country.trim()) return "Please select your country.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (formData.password !== formData.password2)
      return "Passwords do not match.";
    if (!agree) return "Please accept the Terms of Service and Privacy Policy.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const clientErr = validate();
    if (clientErr) {
      setLocalError(clientErr);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${backendBase}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          country: formData.country,
          password: formData.password,
          password2: formData.password2,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        const firstError =
          data?.password?.[0] ||
          data?.email?.[0] ||
          data?.phone?.[0] ||
          data?.error ||
          "Registration failed. Please check your input.";
        dispatch(setAuthError(firstError));
        return;
      }
      dispatch(setUser({ user: data.user, summary: data.summary, token: data.token }));
      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      setLoading(false);
      dispatch(setAuthError("Network error. Please try again later."));
    }
  };

  const set = (k) => (e) => setFormData({ ...formData, [k]: e.target.value });

  return (
    <AuthShell>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Let&rsquo;s get you started with SocialPulse.
        </p>

        {(authError || successMessage || localError) && (
          <div
            role="alert"
            className={`mt-4 p-3 rounded-xl text-sm border ${
              authError || localError
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300"
                : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300"
            }`}
          >
            {localError || authError || successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Full name" value={formData.full_name}
              onChange={set("full_name")} className="input pl-11" required />
          </div>

          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" placeholder="Email" value={formData.email}
              onChange={set("email")} className="input pl-11" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="tel" placeholder="Phone number" value={formData.phone}
                onChange={set("phone")} className="input pl-11" required />
            </div>
            <div className="relative">
              <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <select value={formData.country} onChange={set("country")} className="input pl-11" required>
                <option value="">Select country</option>
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name} ({c.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password}
              onChange={set("password")} className="input pl-11 pr-12" required />
            <button type="button" onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={showConfirm ? "text" : "password"} placeholder="Confirm password" value={formData.password2}
              onChange={set("password2")} className="input pl-11 pr-12" required />
            <button type="button" onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500/30" />
            <span>I agree to the <Link to="/terms" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</Link></span>
          </label>

          <button type="submit" disabled={loading} className="btn btn-lg btn-primary w-full">
            {loading ? "Creating account..." : (<>Create Account <ArrowRight size={18} /></>)}
          </button>
        </form>

        <SocialAuth />
        <ExploreCard />

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default Register;