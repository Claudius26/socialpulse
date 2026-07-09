import { useState, useEffect } from "react";
import {
  Globe, MessageSquareText, PhoneCall, ShieldCheck, Zap, Headphones,
  Instagram, Send, MessageCircle, Facebook, Apple, Sun, Moon,
} from "lucide-react";
import Logo from "../Logo";
import GoogleSignInButton from "../GoogleSignInButton";
import { applyTheme, getInitialTheme } from "../../utils/theme";

/* Light/dark switch — the auth pages sit outside the navbar, so they carry
   their own toggle. Persists via the shared theme util. */
function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  useEffect(() => { applyTheme(theme); }, [theme]);
  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      className="grid place-items-center w-10 h-10 rounded-xl text-slate-600 dark:text-yellow-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

// Features shown on the dark brand side (both login & register).
const BRAND_FEATURES = [
  { icon: Globe, title: "Virtual Numbers", desc: "Choose from 100+ countries and get numbers instantly." },
  { icon: MessageSquareText, title: "SMS & OTP", desc: "Receive OTPs and SMS for verifications securely." },
  { icon: PhoneCall, title: "Receive Calls", desc: "Get incoming calls on your virtual numbers worldwide." },
];

// Trust strip shown under the form (both pages).
const TRUST_FEATURES = [
  { icon: ShieldCheck, title: "Secure & Private", desc: "Your data is encrypted and protected." },
  { icon: Zap, title: "Instant Delivery", desc: "Get SMS & calls in real-time." },
  { icon: Globe, title: "100+ Countries", desc: "Numbers from around the world." },
  { icon: Headphones, title: "24/7 Support", desc: "We're here to help you anytime." },
];

/* Stylized phone + OTP illustration — pure CSS/SVG, no image asset needed. */
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[230px] h-[300px] sm:h-[330px]">
      {/* Phone body */}
      <div className="absolute right-2 top-2 w-[150px] h-[290px] rounded-[26px] bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl p-3">
        <div className="mx-auto mt-1 mb-3 h-1.5 w-12 rounded-full bg-white/20" />
        <p className="text-white text-sm font-semibold px-1">My Numbers</p>
        <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">🇺🇸</span>
            <span className="text-white text-[13px] font-semibold">+1 415 123 4567</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[10px] text-white/60">United States</span>
            <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-500/20 rounded-full px-2 py-0.5">Active</span>
          </div>
        </div>
      </div>

      {/* OTP message card (overlapping, front) */}
      <div className="absolute left-0 top-24 w-[168px] rounded-2xl bg-white shadow-2xl p-3 ring-1 ring-black/5">
        <div className="flex items-center gap-1.5">
          <span className="grid place-items-center w-5 h-5 rounded-md bg-emerald-500 text-white">
            <MessageCircle size={12} />
          </span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Messages</span>
          <span className="ml-auto text-[9px] text-slate-400">now</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 leading-snug">Your OTP code is</p>
        <p className="text-xl font-extrabold text-brand-600 tracking-wide leading-tight">482931</p>
        <p className="text-[10px] text-slate-400">Valid for 10 minutes.</p>
      </div>

      {/* Floating social chips */}
      <span className="absolute -left-1 top-6 grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-amber-400 text-white shadow-lg">
        <Instagram size={17} />
      </span>
      <span className="absolute left-8 bottom-2 grid place-items-center w-9 h-9 rounded-xl bg-emerald-500 text-white shadow-lg">
        <MessageCircle size={17} />
      </span>
      <span className="absolute right-0 top-0 grid place-items-center w-9 h-9 rounded-xl bg-sky-500 text-white shadow-lg">
        <Send size={17} />
      </span>
      <span className="absolute -right-1 bottom-16 grid place-items-center w-9 h-9 rounded-xl bg-slate-900 text-white shadow-lg ring-1 ring-white/20 font-bold text-sm">
        𝕏
      </span>
    </div>
  );
}

/* Social sign-in row. Google is the real, working flow; the others are visual
   placeholders that tell the user they're coming (so nothing silently breaks). */
export function SocialAuth() {
  const [note, setNote] = useState("");
  const hasGoogle = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const soon = (name) => setNote(`${name} sign-in is coming soon.`);

  return (
    <div>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs text-slate-400">or continue with</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      {hasGoogle && (
        <div className="mb-3 flex justify-center">
          <GoogleSignInButton />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => soon("Facebook")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <Facebook size={18} className="text-[#1877F2]" /> Facebook
        </button>
        <button type="button" onClick={() => soon("Apple")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <Apple size={18} /> Apple
        </button>
      </div>
      {note && <p className="mt-2 text-center text-xs text-slate-400">{note}</p>}
    </div>
  );
}

/* Small "explore numbers" promo card shown under the form. */
export function ExploreCard() {
  return (
    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
      <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
        <Globe size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Virtual Numbers for Every Need</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Perfect for OTP verification, account signups, and global communication.</p>
      </div>
    </div>
  );
}

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Static top bar — stays pinned while everything below scrolls under it. */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-14 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70">
        <Logo size={30} />
        <ThemeToggle />
      </header>

      <div className="flex items-stretch lg:items-center justify-center lg:p-6 lg:min-h-[calc(100vh-3.5rem)]">
        <div className="w-full lg:max-w-6xl bg-white dark:bg-slate-900 lg:rounded-3xl lg:shadow-2xl overflow-hidden grid lg:grid-cols-2">
        {/* ================= BRAND / HERO SIDE ================= */}
        <div
          className="relative overflow-hidden text-white px-7 py-9 sm:px-10 sm:py-12 rounded-b-[32px] lg:rounded-none"
          style={{ background: "linear-gradient(160deg,#0d2350 0%,#0a1734 55%,#070f22 100%)" }}
        >
          {/* dotted glow backdrop */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(rgba(99,102,241,0.35) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
          />
          <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />

          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              Connect <span className="text-sky-300">Smarter.</span>
              <br />Communicate <span className="text-sky-300">Better.</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-sm">
              Get virtual numbers for SMS verification, receive calls, and stay connected across the globe.
            </p>

            <div className="my-7">
              <PhoneMockup />
            </div>

            <ul className="space-y-4">
              {BRAND_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.title} className="flex items-start gap-3">
                    <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-white/10 text-brand-200">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{f.title}</p>
                      <p className="text-xs text-slate-400">{f.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["from-rose-400 to-pink-500", "from-sky-400 to-indigo-500", "from-amber-400 to-orange-500", "from-emerald-400 to-teal-500"].map((g, i) => (
                  <span key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} ring-2 ring-[#0a1734]`} />
                ))}
              </div>
              <span className="text-xs text-slate-300">Trusted by 12,000+ users worldwide</span>
            </div>
          </div>
        </div>

        {/* ================= FORM SIDE ================= */}
        <div className="bg-white dark:bg-slate-900 px-6 py-8 sm:px-10 sm:py-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            {children}

            {/* Trust strip */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TRUST_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="text-center">
                    <span className="inline-grid place-items-center w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 mb-1.5">
                      <Icon size={16} />
                    </span>
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">{f.title}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}