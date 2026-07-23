import { Link, useNavigate } from "react-router";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, CheckCircle2, Phone, TrendingUp,
  Wifi, Zap, Tv, Server, ShieldCheck, Wallet, Star, UserPlus,
  MousePointerClick, Rocket, Headphones, Trophy, Plus, Minus, Clock, Globe,
  RefreshCw, QrCode,
} from "lucide-react";
import Logo from "../components/Logo";
import HeroVisual from "../components/HeroVisual";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const ROTATING = [
  "Virtual Numbers", "eSIM Data Plans", "Rental Numbers",
  "Social Boosts", "Bills & more",
];

// Flags shown on the eSIM card mockup — purely decorative.
const ESIM_FLAGS = ["🇺🇸", "🇬🇧", "🇳🇬", "🇦🇪", "🇨🇦", "🇿🇦", "🇮🇳", "🇫🇷"];

function Landing() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  // Returning users with a live session skip the marketing page and land
  // straight in the app — the route guard silently refreshes the token from the
  // HttpOnly cookie.
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState("");
  const [word, setWord] = useState(0);
  const [faqOpen, setFaqOpen] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWord((w) => (w + 1) % ROTATING.length), 2200);
    return () => clearInterval(t);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus("Sending...");
    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
      setContactStatus("Please fill out all fields before sending.");
      return;
    }
    try {
      const response = await fetch(`${backendBase}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setContactStatus("Message sent successfully!");
      setContactData({ name: "", email: "", message: "" });
    } catch {
      setContactStatus("Failed to send message. Please try again.");
    }
  };

  const services = [
    { icon: Phone, title: "Virtual Numbers", desc: "Instant OTP numbers from the USA & 100+ countries for any verification.", tint: "from-sky-500 to-indigo-500", to: "/register" },
    { icon: Wifi, title: "eSIM Data Plans", desc: "Stay connected in 190+ countries — buy an eSIM, scan the QR, you're online. No physical SIM.", tint: "from-teal-500 to-emerald-500", to: "/register" },
    { icon: RefreshCw, title: "Rental Numbers", desc: "Keep a number for days or weeks and receive SMS from many apps — renew any time.", tint: "from-indigo-500 to-blue-500", to: "/register" },
    { icon: TrendingUp, title: "Social Media Boost", desc: "Real followers, likes, views & comments on every major platform.", tint: "from-violet-500 to-fuchsia-500", to: "/register" },
    { icon: Zap, title: "Electricity Bills", desc: "Pay any DISCO and get your token in seconds — prepaid or postpaid.", tint: "from-amber-500 to-orange-500", to: "/register" },
    { icon: Tv, title: "Cable TV", desc: "Renew DStv, GOtv & Startimes subscriptions without the queue.", tint: "from-rose-500 to-red-500", to: "/register" },
    { icon: Trophy, title: "Betting Top-up", desc: "Fund Bet9ja, 1xBet, SportyBet and more in one tap.", tint: "from-green-500 to-emerald-600", to: "/register" },
    { icon: Server, title: "Proxies & VPN", desc: "Fast residential & datacenter proxies for privacy and scale.", tint: "from-cyan-500 to-blue-500", to: "/register" },
  ];

  const stats = [
    { label: "Processed", value: "₦63M+", icon: Wallet },
    { label: "Happy users", value: "17,000+", icon: UserPlus },
    { label: "Countries", value: "190+", icon: Globe },
    { label: "Avg. delivery", value: "<2 min", icon: Clock },
    { label: "Uptime", value: "99.9%", icon: ShieldCheck },
  ];

  const steps = [
    { icon: UserPlus, title: "Create an account", desc: "Sign up with your email in under a minute." },
    { icon: Wallet, title: "Fund your wallet", desc: "Top up with card or bank transfer — credited instantly." },
    { icon: MousePointerClick, title: "Pick a service", desc: "Numbers, eSIMs, bills, boosts & more." },
    { icon: Rocket, title: "Get it instantly", desc: "Delivered in seconds and tracked live in your dashboard." },
  ];

  const reasons = [
    { icon: Zap, title: "Instant delivery", desc: "Most orders complete in under two minutes, 24/7." },
    { icon: ShieldCheck, title: "Bank-grade security", desc: "Encrypted payments; we never ask for social passwords." },
    { icon: Server, title: "Always available", desc: "Multiple providers per service, so it never goes down." },
    { icon: Headphones, title: "Real human support", desc: "A team that actually replies, whenever you need it." },
  ];

  const testimonials = [
    { name: "Ada N.", role: "Content creator", quote: "My engagement doubled in a week. Delivery is fast and support actually replies." },
    { name: "Tunde O.", role: "Frequent traveller", quote: "I grab a SocialPulse eSIM before every trip — online the second I land. Never had one fail." },
    { name: "Maryam S.", role: "Reseller", quote: "Cleanest dashboard I've used. I buy virtual numbers and pay bills in seconds." },
  ];

  const faqs = [
    { q: "How fast are orders delivered?", a: "Most orders — numbers, eSIMs, bills and boosts — complete in under two minutes, automatically. You can track every order live from your dashboard." },
    { q: "What payment methods can I use?", a: "Fund your wallet with card or bank transfer. Your balance is credited automatically, and every purchase draws from that one wallet." },
    { q: "How does the eSIM work?", a: "Pick a country and data plan, pay, and you instantly get a QR code (and manual details). Scan it once in your phone's settings and you're connected — no physical SIM, no roaming charges. Most modern phones support eSIM." },
    { q: "What's the difference between a virtual number and a rental number?", a: "A virtual number is for a single one-time SMS/OTP. A rental number is yours for days or weeks — it keeps receiving SMS from many apps, and you can renew it before it expires." },
    { q: "Which services do you offer?", a: "Virtual numbers, eSIM data plans, rental numbers, social media boosts, electricity, cable TV, betting top-ups and proxies — all from one wallet." },
    { q: "Is it safe?", a: "Yes. Payments are encrypted, and for social boosts we never ask for your account password. Your wallet balance and holds are always reconciled." },
    { q: "Do you have an API for developers?", a: "Yes — resellers and developers can automate purchases with our API and a separate credit pool. See the Developer section after you sign up." },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      {/* ============================ HERO ============================ */}
      <section id="home" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />
          <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-violet-400/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        </div>

        <div className="container-app grid lg:grid-cols-2 items-center gap-12 py-14 md:py-20">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-950 px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300">
              <Sparkles size={15} /> Numbers · eSIM · every digital service
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] text-slate-900 dark:text-white">
              Buy{" "}
              <span className="heading-gradient inline-block min-w-[6ch]">{ROTATING[word]}</span>
              <br className="hidden sm:block" /> in seconds.
            </h1>

            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              SocialPulse is Africa's all-in-one marketplace — virtual numbers, eSIM data plans,
              rental numbers, social boosts, bills and proxies. Fast, secure, from one dashboard.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/register" className="btn btn-lg btn-primary">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-lg btn-outline">
                Sign in
              </Link>
              <Link to="/#services" className="btn btn-lg btn-ghost">
                Explore Services
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Instant delivery</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Secure payments</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> 190+ countries</span>
            </div>
          </motion.div>

          {/* Native product-style hero visual */}
          <HeroVisual />
        </div>

        {/* Trust bar */}
        <div className="container-app pb-12">
          <p className="text-center text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
            Trusted payments · secured end-to-end
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-400 dark:text-slate-500 font-semibold tracking-tight">
            <span>Paystack</span><span>Visa</span><span>Mastercard</span>
            <span>Bank Transfer</span>
          </div>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section id="stats" className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container-app py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center">
                  <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 mb-3">
                    <Icon size={22} />
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ SERVICES ============================ */}
      <section id="services" className="section">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Our services</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Everything digital, in one place</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Every service, one wallet. Buy numbers, get an eSIM, grow your socials and pay bills — all instantly.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{ delay: (i % 3) * 0.05 }}
                >
                  <Link to={s.to} className="card card-hover p-6 block h-full group">
                    <span className={`grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br ${s.tint} text-white shadow-lg`}>
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold flex items-center gap-1.5">
                      {s.title}
                      <ArrowRight size={15} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition text-brand-500" />
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ eSIM SPOTLIGHT ============================ */}
      <section id="esim" className="section bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container-app grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow inline-flex items-center gap-1.5"><Sparkles size={14} /> New · eSIM</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Land in a new country already online</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Choose a destination and a data plan, pay from your wallet, and get a QR code in
              seconds. Scan it once — no physical SIM, no swapping, no roaming bills. Your eSIM is
              ready before you even board.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {[
                { icon: QrCode, t: "Instant QR delivery" },
                { icon: Globe, t: "190+ destinations" },
                { icon: RefreshCw, t: "Top up any time" },
                { icon: ShieldCheck, t: "Keep your main number" },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 shrink-0">
                      <Icon size={16} />
                    </span>
                    {f.t}
                  </li>
                );
              })}
            </ul>
            <Link to="/register" className="btn btn-md btn-primary mt-8">
              Get an eSIM <ArrowRight size={18} />
            </Link>
          </div>

          {/* Faux eSIM card mockup */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 bg-gradient-to-br from-teal-400/20 to-emerald-300/10 blur-3xl rounded-full" />
            <div className="relative mx-auto w-full max-w-sm aspect-[1.62] rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl text-white overflow-hidden ring-1 ring-white/10">
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-teal-400/20 blur-2xl" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/50">SocialPulse eSIM</p>
                  <p className="mt-2 text-3xl font-extrabold">5&nbsp;GB</p>
                  <p className="text-sm text-white/70">30 days · 190+ countries</p>
                </div>
                {/* SIM chip */}
                <div className="w-14 h-11 rounded-lg bg-gradient-to-br from-amber-200 to-yellow-500 relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px p-1 opacity-60">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="bg-yellow-700/40 rounded-[1px]" />
                    ))}
                  </div>
                  <div className="absolute inset-x-2 top-1/2 h-px bg-yellow-800/50" />
                  <div className="absolute inset-y-2 left-1/2 w-px bg-yellow-800/50" />
                </div>
              </div>

              <div className="mt-7 flex items-center gap-1.5 text-lg">
                {ESIM_FLAGS.map((f, i) => (
                  <span key={i} className="leading-none">{f}</span>
                ))}
                <span className="text-xs text-white/50 ml-1">+180</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="font-mono text-[11px] tracking-[0.25em] text-white/50">SCAN · ACTIVATE · ONLINE</p>
                <span className="grid place-items-center w-9 h-9 rounded-lg bg-white/10 text-white/80">
                  <QrCode size={18} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section id="how-to-use" className="section">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Start in four simple steps</h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative card p-6 text-center">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 grid place-items-center w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold shadow">{i + 1}</span>
                  <span className="mt-3 inline-grid place-items-center w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ WHY US ============================ */}
      <section id="about" className="section bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container-app grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow">Why SocialPulse</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Built to be fast, safe & always on</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              We run multiple providers behind every service, so your numbers, eSIMs and bills go
              through even when one provider is down. One wallet, best rates, zero drama.
            </p>
            <Link to="/register" className="btn btn-md btn-primary mt-7">
              Create your free account <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="card p-5">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-semibold">{r.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="section">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Loved by thousands</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Don't just take our word for it</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="mt-4 text-slate-700 dark:text-slate-300">“{t.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-white font-bold">{t.name.charAt(0)}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section className="section bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container-app max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Questions, answered</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => {
              const open = faqOpen === i;
              return (
                <div key={i} className="card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{f.q}</span>
                    <span className="shrink-0 grid place-items-center w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                      {open ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  {open && <p className="px-5 pb-5 -mt-1 text-sm text-slate-600 dark:text-slate-400">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ CONTACT ============================ */}
      <section id="contact" className="section">
        <div className="container-app max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">Get in touch</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Contact us</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Have a question or need support? Send us a message — we'll respond promptly.
            </p>
          </div>
          <form onSubmit={handleContactSubmit} className="mt-10 card p-6 sm:p-8 grid gap-4" aria-live="polite">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Your name</label>
                <input type="text" placeholder="Jane Doe" value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })} required className="input" />
              </div>
              <div>
                <label className="label">Your email</label>
                <input type="email" placeholder="you@email.com" value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })} required className="input" />
              </div>
            </div>
            <div>
              <label className="label">Message</label>
              <textarea rows={5} placeholder="How can we help?" value={contactData.message}
                onChange={(e) => setContactData({ ...contactData, message: e.target.value })} required className="input resize-none" />
            </div>
            <button type="submit" className="btn btn-lg btn-primary w-full sm:w-auto justify-self-start">
              Send message <ArrowRight size={18} />
            </button>
            {contactStatus && <p className="text-sm text-slate-600 dark:text-slate-400">{contactStatus}</p>}
          </form>
        </div>
      </section>

      {/* ============================ CTA BANNER ============================ */}
      <section className="pb-20 pt-16">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-violet-600 px-6 py-14 sm:px-12 text-center shadow-xl">
            <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_60%)]" />
            <h2 className="relative text-3xl md:text-4xl font-extrabold text-white">Your all-in-one wallet is waiting</h2>
            <p className="relative mt-3 text-white/85 max-w-xl mx-auto">
              Join 17,000+ users buying numbers, eSIMs, bills, boosts and more — the smart way.
            </p>
            <div className="relative mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="btn btn-lg bg-white text-brand-700 hover:bg-slate-100 shadow-lg">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-lg border border-white/40 text-white hover:bg-white/10">
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
