import { Link } from "react-router";
import { Instagram, Youtube, Facebook, Twitter, Mail } from "lucide-react";
import Logo from "./Logo";

function Footer() {
  const year = new Date().getFullYear();

  const productLinks = [
    { label: "Boost Social Media", to: "/boost" },
    { label: "USA Numbers", to: "/usa_numbers" },
    { label: "All Countries Numbers", to: "/virtual_numbers" },
    { label: "Explore Boosts", to: "/explore_boost" },
  ];
  const companyLinks = [
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
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Logo size={34} />
            </Link>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Grow your social media and get instant virtual numbers — fast, secure and simple.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social link"
                  className="grid place-items-center w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-600 hover:text-white transition"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
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
                  <Link to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Get in touch</h4>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Questions? We're here to help.</p>
            <a
              href="mailto:support@socialpulse.app"
              className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            >
              <Mail size={16} /> support@socialpulse.app
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
          <p>© {year} SocialPulse Global. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className={linkClass}>Privacy Policy</a>
            <a href="/terms" className={linkClass}>Terms</a>
            <Link to="/support" className={linkClass}>Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
