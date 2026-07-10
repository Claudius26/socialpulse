import { motion } from "framer-motion";
import {
  MessageCircle, Instagram, Send, Facebook, Youtube, Music2,
  ShieldCheck, Phone, Wallet, CheckCircle2, Globe, PhoneCall,
} from "lucide-react";

/**
 * Native product-style hero — a central verification "phone", a dashed orbit of
 * app icons, and a couple of glass feature cards. Built entirely from live DOM
 * so it matches the site (theme-aware, crisp, responsive) instead of a flat image.
 */

// App icons placed around the orbit. `pos` is a percentage position in the box.
const ORBIT = [
  { pos: "top-[2%] left-[46%]", bg: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", Icon: Instagram },
  { pos: "top-[16%] right-[6%]", bg: "#1877F2", Icon: Facebook },
  { pos: "top-[44%] right-[0%]", bg: "#229ED9", Icon: Send },
  { pos: "bottom-[16%] right-[7%]", bg: "#111", Icon: null, label: "𝕏" },
  { pos: "bottom-[1%] left-[48%]", bg: "#FF0000", Icon: Youtube },
  { pos: "bottom-[16%] left-[7%]", bg: "#111", Icon: Music2 },
  { pos: "top-[44%] left-[0%]", bg: "#25D366", Icon: MessageCircle },
];

function IconTile({ pos, bg, Icon, label }) {
  return (
    <div className={`absolute ${pos} grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl text-white shadow-xl ring-1 ring-white/20`} style={{ background: bg }}>
      {Icon ? <Icon size={20} /> : <span className="font-bold text-lg">{label}</span>}
    </div>
  );
}

export default function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[440px] lg:max-w-[520px] aspect-square"
    >
      {/* soft glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3/4 w-3/4 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute right-6 bottom-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      {/* dashed orbit rings */}
      <div className="absolute inset-[6%] rounded-full border border-dashed border-slate-300/60 dark:border-white/10" />
      <div className="absolute inset-[20%] rounded-full border border-dashed border-slate-300/50 dark:border-white/10" />

      {/* central device */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[44%] max-w-[210px]">
        <div className="rounded-[26px] bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl p-3">
          <div className="mx-auto mb-3 mt-0.5 h-1.5 w-10 rounded-full bg-white/20" />
          <div className="rounded-2xl bg-white p-3">
            <div className="flex items-center gap-1.5">
              <span className="grid place-items-center w-5 h-5 rounded-md bg-brand-600 text-white"><MessageCircle size={12} /></span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">SMS Verification</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Your OTP code</p>
            <p className="text-2xl font-extrabold text-brand-600 tracking-wider leading-tight">482931</p>
            <p className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <CheckCircle2 size={11} /> Valid for 10 minutes
            </p>
          </div>
          <div className="mt-2.5 grid grid-cols-4 gap-1.5">
            {[Phone, Globe, ShieldCheck, Wallet].map((Ic, i) => (
              <span key={i} className="grid place-items-center h-8 rounded-lg bg-white/10 text-white/80"><Ic size={14} /></span>
            ))}
          </div>
        </div>
      </div>

      {/* orbit app icons */}
      {ORBIT.map((o, i) => <IconTile key={i} {...o} />)}

      {/* floating glass cards */}
      <div className="absolute -left-2 top-[12%] hidden sm:block w-40 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-white/40 dark:border-white/10 shadow-xl p-3">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400"><Phone size={16} /></span>
          <p className="text-xs font-semibold text-slate-900 dark:text-white">Virtual Numbers</p>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Receive SMS from <span className="font-semibold text-slate-700 dark:text-slate-200">1000+</span> services worldwide.</p>
      </div>

      <div className="absolute -right-2 bottom-[10%] hidden sm:block w-44 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-white/40 dark:border-white/10 shadow-xl p-3">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-emerald-500 text-white"><PhoneCall size={15} /></span>
          <div className="leading-tight">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Incoming call</p>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">+1 415 123 4567</p>
          </div>
        </div>
      </div>

      {/* small accent badge */}
      <div className="absolute right-[16%] top-[2%] hidden md:flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-white/40 dark:border-white/10 shadow-lg px-2.5 py-1">
        <ShieldCheck size={13} className="text-emerald-500" />
        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">Secure</span>
      </div>
    </motion.div>
  );
}