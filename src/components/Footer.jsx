import { Link } from "react-router";
import { useSelector } from "react-redux";
import { Instagram, Facebook, Youtube, LifeBuoy } from "lucide-react";
import Logo from "./Logo";
import { TikTok, Snapchat } from "./BrandIcons";
import { useContact } from "./ContactProvider";
import { selectCurrentUser } from "../features/auth/authSlice";

// Ensure an external link always has a scheme — a schemeless value like
// "www.tiktok.com/@x" would otherwise be treated as an in-app (relative) route
// and 404 the SPA instead of opening the profile.
const externalUrl = (u) => {
  if (!u) return u;
  const t = String(u).trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t.replace(/^\/+/, "")}`;
};

// Social profiles come from env so you can add links after creating the accounts.
const SOCIALS = [
  { name: "Instagram", url: externalUrl(import.meta.env.VITE_SOCIAL_INSTAGRAM), Icon: Instagram, color: "#E1306C" },
  { name: "Facebook", url: externalUrl(import.meta.env.VITE_SOCIAL_FACEBOOK), Icon: Facebook, color: "#1877F2" },
  { name: "TikTok", url: externalUrl(import.meta.env.VITE_SOCIAL_TIKTOK), Icon: TikTok, color: "#111111" },
  { name: "Snapchat", url: externalUrl(import.meta.env.VITE_SOCIAL_SNAPCHAT), Icon: Snapchat, color: "#FFFC00" },
  { name: "YouTube", url: externalUrl(import.meta.env.VITE_SOCIAL_YOUTUBE), Icon: Youtube, color: "#FF0000" },
];

function Footer() {
  const user = useSelector(selectCurrentUser);
  const { openContact } = useContact();

  // Logged-in → real in-app pages. Logged-out → marketing / sign-up (never a
  // guarded page that would just bounce them to /login).
  const productLinks = user
    ? [
        { label: "Boost Social Media", to: "/boost" },
        { label: "USA Numbers", to: "/usa_numbers" },
        { label: "All Countries Numbers", to: "/virtual_numbers" },
        { label: "Explore Boosts", to: "/explore_boost" },
      ]
    : [
        { label: "Boost Social Media", to: "/#services" },
        { label: "USA Numbers", to: "/register" },
        { label: "All Countries Numbers", to: "/register" },
        { label: "Explore Boosts", to: "/#services" },
      ];

  const companyLinks = user
    ? [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Fund Wallet", to: "/deposits" },
        { label: "Transactions", to: "/transactions" },
        { label: "FAQ", to: "/faq" },
      ]
    : [
        { label: "About Us", to: "/#about" },
        { label: "How it works", to: "/#how-to-use" },
        { label: "FAQ", to: "/faq" },
        { label: "Contact", to: "/#contact" },
      ];

  const linkClass =
    "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition";

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800">
      <div className="container-app py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + socials */}
          <div className="lg:col-span-1">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
              <Logo size={34} />
            </Link>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Grow your social media and get instant virtual numbers — fast, secure and simple.
            </p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Follow us on the following platforms
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {SOCIALS.map((s) => {
                const Icon = s.Icon;
                return s.url ? (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={`Follow us on ${s.name}`}
                    className="grid place-items-center w-9 h-9 rounded-lg text-white shadow-sm hover:opacity-90 hover:-translate-y-0.5 transition"
                    style={{ background: s.color }}
                  >
                    <Icon size={18} />
                  </a>
                ) : (
                  <span
                    key={s.name}
                    aria-label={`${s.name} (link coming soon)`}
                    title={`${s.name} — link coming soon`}
                    className="grid place-items-center w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default"
                  >
                    <Icon size={18} />
                  </span>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Get in touch</h4>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Questions? We're here to help.</p>
            <button
              type="button"
              onClick={openContact}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
            >
              <LifeBuoy size={16} /> Contact support
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2020 SocialPulse Global. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className={linkClass}>Privacy Policy</Link>
            <Link to="/terms" className={linkClass}>Terms</Link>
            <button type="button" onClick={openContact} className={linkClass}>Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;