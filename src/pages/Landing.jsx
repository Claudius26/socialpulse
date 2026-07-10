import { Link } from "react-router";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, CheckCircle2, Phone, TrendingUp, Gift, Smartphone,
  Wifi, Zap, Tv, Bitcoin, Server, ShieldCheck, Wallet, Star, UserPlus,
  MousePointerClick, Rocket, Headphones, Trophy, Plus, Minus, Clock, Globe,
} from "lucide-react";
import Logo from "../components/Logo";
import HeroVisual from "../components/HeroVisual";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const ROTATING = [
  "Virtual Numbers", "Airtime & Data", "Gift Cards",
  "Electricity Bills", "Social Boosts", "Crypto & more",
];

function Landing() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(logout()); }, [dispatch]);

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
    { icon: TrendingUp, title: "Social Media Boost", desc: "Real followers, likes, views & comments on every major platform.", tint: "from-violet-500 to-fuchsia-500", to: "/register" },
    { icon: Smartphone, title: "Airtime & Data", desc: "Top up MTN, Glo, Airtel & 9mobile at the best rates, instantly.", tint: "from-emerald-500 to-teal-500", to: "/register" },
    { icon: Zap, title: "Electricity Bills", desc: "Pay any DISCO and get your token in seconds — prepaid or postpaid.", tint: "from-amber-500 to-orange-500", to: "/register" },
    { icon: Tv, title: "Cable TV", desc: "Renew DStv, GOtv & Startimes subscriptions without the queue.", tint: "from-rose-500 to-red-500", to: "/register" },
    { icon: Gift, title: "Gift Cards", desc: "Buy & sell top gift cards at great rates with instant delivery.", tint: "from-pink-500 to-rose-500", to: "/register" },
    { icon: Trophy, title: "Betting Top-up", desc: "Fund Bet9ja, 1xBet, SportyBet and more in one tap.", tint: "from-green-500 to-emerald-600", to: "/register" },
    { icon: Bitcoin, title: "Crypto Wallet Funding", desc: "Fund your wallet with USDT, BTC & more — credited automatically.", tint: "from-yellow-500 to-amber-500", to: "/register" },
    { icon: Server, title: "Proxies & VPN", desc: "Fast residential & datacenter proxies for privacy and scale.", tint: "from-cyan-500 to-blue-500", to: "/register" },
  ];

  const stats = [
    { label: "Processed", value: "₦63M+", icon: Wallet },
    { label: "Happy users", value: "17,000+", icon: UserPlus },
    { label: "Countries", value: "100+", icon: Globe },
    { label: "Avg. delivery", value: "<2 min", icon: Clock },
    { label: "Uptime", value: "99.9%", icon: ShieldCheck },
  ];

  const steps = [
    { icon: UserPlus, title: "Create an account", desc: "Sign up with your email in under a minute." },
    { icon: Wallet, title: "Fund your wallet", desc: "Top up with card, bank transfer or crypto." },
    { icon: MousePointerClick, title: "Pick a service", desc: "Numbers, bills, airtime, boosts, gift cards & more." },
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
    { name: "Tunde O.", role: "Small business", quote: "I buy airtime, data and virtual numbers here daily. Never had one fail." },
    { name: "Maryam S.", role: "Reseller", quote: "Cleanest dashboard I've used. I pay bills and fund with crypto in seconds." },
  ];

  const faqs = [
    { q: "How fast are orders delivered?", a: "Most orders — airtime, data, bills, numbers and boosts — complete in under two minutes, automatically. You can track every order live from your dashboard." },
    { q: "What payment methods can I use?", a: "Fund your wallet with card, bank transfer, or crypto (USDT, BTC and more). Crypto deposits are credited automatically once confirmed." },
    { q: "Which services do you offer?", a: "Virtual numbers, social media boosts, gift cards, airtime & data, electricity, cable TV, betting top-ups, crypto funding and proxies — all from one wallet." },
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
              <Sparkles size={15} /> One wallet · every digital service
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] text-slate-900 dark:text-white">
              Buy{" "}
              <span className="heading-gradient inline-block min-w-[6ch]">{ROTATING[word]}</span>
              <br className="hidden sm:block" /> in seconds.
            </h1>

            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              SocialPulse is Africa's all-in-one marketplace — virtual numbers, airtime & data,
              bills, social boosts, gift cards, crypto and proxies. Fast, secure, from one dashboard.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/register" className="btn btn-lg btn-primary">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/#services" className="btn btn-lg btn-outline">
                Explore Services
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Instant delivery</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Secure payments</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Pay with crypto</span>
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
            <span className="inline-flex items-center gap-1"><Bitcoin size={16} /> USDT</span>
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
              Nine services, one wallet. Pay bills, buy numbers, grow your socials and more — all instantly.
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

      {/* ============================ HOW IT WORKS ============================ */}
      <section id="how-to-use" className="section bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
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
      <section id="about" className="section">
        <div className="container-app grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow">Why SocialPulse</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Built to be fast, safe & always on</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              We run multiple providers behind every service, so your airtime, numbers and bills go
              through even when one network is down. One wallet, best rates, zero drama.
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
      <section className="section bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
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
      <section className="section">
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
      <section id="contact" className="section bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
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
              Join 17,000+ users buying numbers, airtime, bills, boosts and more — the smart way.
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