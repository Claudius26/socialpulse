import { motion } from "framer-motion";
import {
  MessageCircle, Instagram, Send, ShieldCheck, Phone, PhoneCall,
  CheckCircle2, Zap, Wifi, Tv, Droplets, Music2,
} from "lucide-react";
import heroWoman from "../images/hero-woman.jpg";

/**
 * Landing hero — a real portrait with live product UI (glass cards + app icons)
 * floating over the empty side of the photo. Everything except the photo is live
 * DOM, so it's crisp, theme-aware and reads as a product, not a flyer.
 */

const APP_ICONS = [
  { pos: "top-[6%] left-[30%]", bg: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", Icon: Instagram },
  { pos: "top-[18%] left-[15%]", bg: "#25D366", Icon: MessageCircle },
  { pos: "top-[3%] left-[52%]", bg: "#229ED9", Icon: Send },
  { pos: "top-[16%] left-[46%]", bg: "#111", label: "𝕏" },
  { pos: "top-[30%] left-[8%]", bg: "#111", Icon: Music2 },
];

function Glass({ className, children }) {
  return (
    <div className={`absolute rounded-2xl bg-white/95 dark:bg-slate-800/90 backdrop-blur border border-white/50 dark:border-white/10 shadow-xl ${className}`}>
      {children}
    </div>
  );
}

export default function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[560px]"
    >
      {/* glow */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-tr from-brand-500/20 via-cyan-400/10 to-transparent blur-2xl" />

      {/* portrait */}
      <img
        src={heroWoman}
        alt="Customer receiving an SMS verification code on SocialPulse Global"
        loading="eager"
        className="w-full aspect-[3/2] object-cover rounded-[28px] shadow-2xl ring-1 ring-white/10"
      />

      {/* floating app icons over the empty navy space */}
      {APP_ICONS.map((o, i) => (
        <div key={i} className={`absolute ${o.pos} grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white shadow-lg ring-1 ring-white/20`} style={{ background: o.bg }}>
          {o.Icon ? <o.Icon size={17} /> : <span className="font-bold">{o.label}</span>}
        </div>
      ))}

      {/* SMS OTP card (top-left) */}
      <Glass className="top-[8%] left-[3%] w-[47%] max-w-[210px] p-3">
        <div className="flex items-center gap-1.5">
          <span className="grid place-items-center w-5 h-5 rounded-md bg-brand-600 text-white"><MessageCircle size={12} /></span>
          <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">SMS Verification</span>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">Your OTP code</p>
        <p className="text-xl font-extrabold text-brand-600 dark:text-brand-400 tracking-wider leading-none">482931</p>
        <p className="mt-1 inline-flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 size={10} /> Valid for 10 minutes
        </p>
      </Glass>

      {/* Virtual Numbers card (mid-left, floats off the edge) */}
      <Glass className="top-[45%] -left-[2%] w-[46%] max-w-[205px] p-3 hidden sm:block">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-indigo-500 text-white shrink-0"><Phone size={15} /></span>
          <p className="text-xs font-bold text-slate-900 dark:text-white">Virtual Numbers</p>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
          Receive SMS from <span className="font-bold text-slate-800 dark:text-slate-100">1000+</span> services worldwide.
        </p>
      </Glass>

      {/* VPN & Proxies card (bottom-left) */}
      <Glass className="bottom-[6%] left-[3%] w-[46%] max-w-[205px] p-3">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-emerald-500 text-white shrink-0"><ShieldCheck size={16} /></span>
          <p className="text-xs font-bold text-slate-900 dark:text-white">VPN &amp; Proxies</p>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 leading-snug">Secure. Private. Access anywhere in the world.</p>
      </Glass>

      {/* Incoming Call (top-right, off edge) */}
      <Glass className="top-[6%] -right-[3%] w-[44%] max-w-[195px] p-3 hidden md:block">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-emerald-500 text-white shrink-0 animate-pulse"><PhoneCall size={15} /></span>
          <div className="leading-tight min-w-0">
            <p className="text-[9px] text-slate-500 dark:text-slate-400">Incoming call</p>
            <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">SocialPulse Global</p>
            <p className="text-[9px] text-slate-500 dark:text-slate-400">+1 415 123 4567</p>
          </div>
        </div>
      </Glass>

      {/* Pay Bills & Utilities (bottom-right, off edge) */}
      <Glass className="bottom-[8%] -right-[3%] w-[42%] max-w-[190px] p-3 hidden md:block">
        <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Pay Bills &amp; Utilities</p>
        <div className="mt-2 space-y-1.5">
          {[[Zap, "Electricity", "text-amber-500"], [Wifi, "Internet", "text-sky-500"], [Tv, "Cable TV", "text-violet-500"], [Droplets, "Water", "text-blue-500"]].map(([Ic, label, color], i) => (
            <div key={i} className="flex items-center gap-2">
              <Ic size={13} className={color} />
              <span className="text-[10px] text-slate-600 dark:text-slate-300">{label}</span>
            </div>
          ))}
        </div>
      </Glass>
    </motion.div>
  );
}