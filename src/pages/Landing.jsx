import { Link } from "react-router";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Users,
  Heart,
  MessageCircle,
  Phone,
  Rocket,
  ShieldCheck,
  Zap,
  Headphones,
  Globe,
  TrendingUp,
  DollarSign,
  UserPlus,
  Wallet,
  MousePointerClick,
  CheckCircle2,
  ArrowRight,
  Star,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
} from "lucide-react";
import socialImage from "../images/socialImage.jpg";

function Landing() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState("");
  const revealRefs = useRef([]);
  const heroImgRef = useRef(null);
  const [imgTransform, setImgTransform] = useState({ x: 0, y: 0 });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus("Sending...");
    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
      setContactStatus("Please fill out all fields before sending.");
      return;
    }
    try {
      const response = await fetch(`${backendBase}/api/contact`, {
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleHeroMove = (e) => {
    const el = heroImgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const py = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    setImgTransform({ x: px * 8, y: py * 8 });
  };
  const handleHeroLeave = () => setImgTransform({ x: 0, y: 0 });

  const [typedText, setTypedText] = useState("");
  const fullText = "SocialPulse";
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!deleting && index < fullText.length) {
        setTypedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      } else if (deleting && index > 0) {
        setTypedText((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      } else if (index === fullText.length && !deleting) {
        setTimeout(() => setDeleting(true), 1800);
      } else if (index === 0 && deleting) {
        setDeleting(false);
      }
    }, 140);
    return () => clearInterval(interval);
  }, [index, deleting]);

  const services = [
    { icon: Users, title: "Real Followers", desc: "Grow your audience across every major platform with high-quality followers." },
    { icon: Heart, title: "Likes & Engagement", desc: "Boost likes, views and reactions to make your content stand out instantly." },
    { icon: MessageCircle, title: "Comments", desc: "Spark conversation with authentic-looking comments that drive reach." },
    { icon: Phone, title: "Virtual Numbers", desc: "Instant OTP numbers from the USA and 100+ countries for verifications." },
  ];

  const stats = [
    { label: "Boosts Delivered", value: "20K+", icon: TrendingUp },
    { label: "Numbers Sold", value: "25K+", icon: Phone },
    { label: "Happy Customers", value: "12K+", icon: Users },
    { label: "Total Volume", value: "₦900K+", icon: DollarSign },
    { label: "Avg. Delivery", value: "<2 min", icon: Zap },
  ];

  const steps = [
    { icon: UserPlus, title: "Create an account", desc: "Sign up with your email in under a minute." },
    { icon: Wallet, title: "Fund your wallet", desc: "Top up securely with your preferred payment method." },
    { icon: MousePointerClick, title: "Choose a service", desc: "Pick boosts, virtual numbers, or social growth." },
    { icon: Rocket, title: "Get results", desc: "Sit back as your order is delivered and tracked live." },
  ];

  const reasons = [
    { icon: Zap, title: "Lightning fast", desc: "Most orders start delivering in under two minutes." },
    { icon: ShieldCheck, title: "Safe & secure", desc: "Encrypted payments and no account password ever required for boosts." },
    { icon: Headphones, title: "24/7 support", desc: "Real humans ready to help you whenever you need it." },
    { icon: Globe, title: "Global coverage", desc: "Numbers and services across 100+ countries." },
  ];

  const testimonials = [
    { name: "Ada N.", role: "Content creator", quote: "My engagement doubled in a week. Delivery is fast and support actually replies." },
    { name: "Tunde O.", role: "Small business", quote: "I use the virtual numbers for verifications daily. Never had one fail. Worth every naira." },
    { name: "Maryam S.", role: "Influencer", quote: "Cleanest dashboard I've used. Funding my wallet and ordering takes seconds." },
  ];

  const platforms = [Instagram, Youtube, Facebook, Twitter];

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); }
        .in-view { opacity: 1 !important; transform: translateY(0) !important; transition: opacity 700ms ease, transform 700ms ease; }
      `}</style>

      {/* ============================ HERO ============================ */}
      <section
        id="home"
        onMouseMove={handleHeroMove}
        onMouseLeave={handleHeroLeave}
        className="relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />
          <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>

        <div className="container-app grid lg:grid-cols-2 items-center gap-12 py-16 md:py-24">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-950 px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300">
              <Sparkles size={15} /> Grow faster with SocialPulse
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] text-slate-900 dark:text-white">
              Boost your social media &{" "}
              <span className="heading-gradient">{typedText || "SocialPulse"}</span>
              <span className="text-brand-500 animate-pulse">|</span>
            </h1>

            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              Followers, likes, comments and instant virtual numbers — delivered fast and securely,
              all from one beautifully simple dashboard.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/register" className="btn btn-lg btn-primary">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/explore_boost" className="btn btn-lg btn-outline">
                Explore Boosts
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> No password needed</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Secure payments</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Instant delivery</span>
            </div>
          </div>

          <div className="relative">
            <div
              ref={heroImgRef}
              style={{ transform: `translate3d(${imgTransform.x}px, ${imgTransform.y}px, 0)` }}
              className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 transition-transform duration-300"
            >
              <img src={socialImage} alt="Grow your social media with SocialPulse" className="w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 left-2 sm:left-6 card px-4 py-3 flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">+20,000</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">boosts delivered</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-app pb-12">
          <p className="text-center text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
            Works with all major platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 dark:text-slate-500">
            {platforms.map((Icon, i) => (
              <Icon key={i} size={30} className="hover:text-brand-500 transition" />
            ))}
            <span className="font-semibold tracking-tight">TikTok</span>
            <span className="font-semibold tracking-tight">Telegram</span>
          </div>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section id="stats" className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container-app py-14">
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
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Everything you need to grow</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              One platform for social growth and virtual numbers — safe, effective and effortless.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} ref={(el) => (revealRefs.current[i] = el)} className="reveal card card-hover p-6">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-lg shadow-brand-500/20">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ HOW TO USE ============================ */}
      <section id="how-to-use" className="section bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Get started in four simple steps</h2>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative card p-6 text-center">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 grid place-items-center w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold shadow">
                    {i + 1}
                  </span>
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
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Built for creators, brands & businesses</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              We help you grow your online presence efficiently and securely — with tools that just work
              and a team that genuinely cares.
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
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-slate-700 dark:text-slate-300">“{t.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-white font-bold">
                    {t.name.charAt(0)}
                  </span>
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
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="label">Your email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  required
                  className="input"
                />
              </div>
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                rows={5}
                placeholder="How can we help?"
                value={contactData.message}
                onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                required
                className="input resize-none"
              />
            </div>
            <button type="submit" className="btn btn-lg btn-primary w-full sm:w-auto justify-self-start">
              Send message <ArrowRight size={18} />
            </button>
            {contactStatus && <p className="text-sm text-slate-600 dark:text-slate-400">{contactStatus}</p>}
          </form>
        </div>
      </section>

      {/* ============================ CTA BANNER ============================ */}
      <section className="pb-20">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-violet-600 px-6 py-14 sm:px-12 text-center shadow-xl">
            <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_60%)]" />
            <h2 className="relative text-3xl md:text-4xl font-extrabold text-white">Ready to grow your audience?</h2>
            <p className="relative mt-3 text-white/85 max-w-xl mx-auto">
              Join thousands of creators and businesses growing smarter with SocialPulse.
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
