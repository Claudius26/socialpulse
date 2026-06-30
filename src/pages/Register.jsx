import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";
import { SUPPORTED_COUNTRIES } from "../data/supportedCountries";
import {
  setUser,
  setError as setAuthError,
  selectAuthError,
} from "../features/auth/authSlice";

import socialImage from "../images/socialImage.jpg";

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
    if (!formData.country.trim()) return "Please enter your country.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (formData.password !== formData.password2)
      return "Passwords do not match.";
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
            alt="Join SocialPulse"
            className="relative w-2/3 md:w-3/4 rounded-2xl shadow-2xl ring-1 ring-white/20"
          />
          <div className="relative text-center">
            <h3 className="text-xl md:text-2xl font-bold">Create an account</h3>
            <p className="mt-2 text-brand-100/90 text-sm md:text-base">
              Join SocialPulse to manage boosts, wallet and virtual numbers.
            </p>
          </div>

          <div className="relative flex items-center gap-2 text-sm text-brand-100/90">
            <ShieldCheck size={16} /> Your data stays protected
          </div>

          <button
            onClick={() => navigate("/")}
            className="relative btn btn-sm bg-white/15 text-white hover:bg-white/25 border border-white/20"
          >
            Visit Landing
          </button>
        </div>

        {/* Form panel */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10">
          <p className="eyebrow mb-2">Get started</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Create your SocialPulse account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Fast, secure sign up in just a few seconds
          </p>

          {(authError || successMessage || localError) && (
            <div
              role="alert"
              className={`mb-4 p-3 rounded-xl text-sm border ${
                authError || localError
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300"
                  : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {localError || authError || successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Phone number</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="input"
                  required
                >
                  <option value="">Select your country</option>
                  {SUPPORTED_COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={(e) =>
                    setFormData({ ...formData, password2: e.target.value })
                  }
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-lg btn-primary w-full"
            >
              {loading ? "Registering..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Login
            </Link>
          </p>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="btn btn-sm btn-ghost"
            >
              <ArrowLeft size={16} /> Back to Landing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
