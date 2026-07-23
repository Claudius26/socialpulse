import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, User, Mail, Globe, Lock, ArrowRight, Gift, Search, ChevronDown, Check } from "lucide-react";
import { SUPPORTED_COUNTRIES } from "../data/supportedCountries";
import PhoneInput from "react-phone-input-2";

/* Searchable country dropdown — a trigger that opens a filterable list, so the
   user can scroll OR type to find their country. Values are the country name
   (kept as-is for the backend + currency mapping). */
function CountrySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  useEffect(() => { if (open) setQuery(""); }, [open]);

  const selected = SUPPORTED_COUNTRIES.find((c) => c.name === value);
  const q = query.trim().toLowerCase();
  const filtered = SUPPORTED_COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.currency.toLowerCase().includes(q)
  );

  return (
    <div ref={wrapRef} className="relative">
      <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="input pl-11 pr-10 text-left flex items-center"
      >
        <span className={selected ? "text-slate-900 dark:text-slate-100 truncate" : "text-slate-400 dark:text-slate-500"}>
          {selected ? `${selected.flag} ${selected.name} (${selected.currency})` : "Select country"}
        </span>
        <ChevronDown size={16} className={`absolute right-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 input px-3 py-2">
              <Search className="w-4 h-4 text-brand-500 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full outline-none text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-auto">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-slate-500 dark:text-slate-400">No results.</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => { onChange(c.name); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                    c.name === value ? "bg-brand-50 dark:bg-brand-950/50" : ""
                  }`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="text-slate-800 dark:text-slate-200">{c.name}</span>
                  <span className="ml-auto text-xs text-slate-400">{c.currency}</span>
                  {c.name === value && <Check size={15} className="text-brand-600 dark:text-brand-400" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
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
  const location = useLocation();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    password2: "",
    referral_code: "",
  });

  // Prefill the referral code from a shared link (?ref=CODE).
  useEffect(() => {
    const ref = new URLSearchParams(location.search).get("ref");
    if (ref) setFormData((f) => ({ ...f, referral_code: ref.trim() }));
  }, [location.search]);
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
    if (!formData.country.trim()) return "Please select your country.";
    // Phone is optional, but if given it must be a complete local number.
    if (hasPhone && phoneDigits.length < selectedCountry.dial.length + 6)
      return `Please enter a complete ${selectedCountry.name} phone number, or leave it blank.`;
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
          phone: hasPhone ? `+${phoneDigits}` : undefined,
          country: formData.country,
          password: formData.password,
          password2: formData.password2,
          referral_code: formData.referral_code.trim() || undefined,
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
      // New accounts must verify their email before they can sign in.
      if (data.requires_verification) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`);
        return;
      }
      dispatch(setUser({ user: data.user, summary: data.summary, token: data.token, refresh: data.refresh }));
      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      setLoading(false);
      dispatch(setAuthError("Network error. Please try again later."));
    }
  };

  const set = (k) => (e) => setFormData({ ...formData, [k]: e.target.value });

  // The selected country drives the phone field's dial code, so a phone number
  // always matches the account's country (a Nigerian can only enter a +234
  // number, a Ghanaian a +233, etc.). Phone stays OPTIONAL.
  const selectedCountry = SUPPORTED_COUNTRIES.find((c) => c.name === formData.country);
  const phoneIso2 = selectedCountry?.iso2 || "ng";
  const phoneDigits = (formData.phone || "").replace(/\D/g, "");
  // "Has a real number" = more than just the country's dial code prefix.
  const hasPhone = selectedCountry
    ? phoneDigits.length > selectedCountry.dial.length
    : false;

  const handleCountryChange = (name) => {
    // Reset the phone when the country changes so a previous country's dial code
    // can never linger on the number.
    setFormData((f) => ({ ...f, country: name, phone: "" }));
  };

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

          {/* Country FIRST (searchable) — it drives the phone field's dial code below. */}
          <CountrySelect value={formData.country} onChange={handleCountryChange} />

          {/* Phone is OPTIONAL, and locked to the selected country's dial code:
              a Nigerian can only enter a +234 number, a Ghanaian a +233, etc. */}
          <div>
            <PhoneInput
              key={phoneIso2}                 /* remount when country changes so the prefix updates */
              country={phoneIso2}
              value={formData.phone}
              onChange={(val) => setFormData((f) => ({ ...f, phone: val }))}
              disabled={!formData.country}
              disableDropdown                 /* can't switch to another country's code */
              countryCodeEditable={false}     /* can't edit the +234 prefix away */
              placeholder={formData.country ? "Phone number (optional)" : "Select your country first"}
              inputProps={{ name: "phone" }}
            />
            <p className="mt-1.5 text-xs text-slate-400">
              {formData.country
                ? `Optional — must be a ${selectedCountry?.name} (+${selectedCountry?.dial}) number.`
                : "Optional — choose your country first."}
            </p>
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

          <div className="relative">
            <Gift size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Referral code (optional)" value={formData.referral_code}
              onChange={set("referral_code")} autoCapitalize="characters" className="input pl-11 uppercase" />
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