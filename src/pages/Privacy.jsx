import { Link } from "react-router";
import { Lock, ArrowLeft } from "lucide-react";

const EFFECTIVE = "10 July 2026";

const SECTIONS = [
  {
    h: "1. Who we are",
    body: [
      "This Privacy Policy explains how SocialPulse Global (\"SocialPulse\", \"we\", \"us\") collects, uses, and protects your information when you use our website and services (the \"Services\").",
    ],
  },
  {
    h: "2. Information we collect",
    list: [
      "Account information — your name, username, email, phone number, and country when you register.",
      "Transaction information — wallet balance, deposits, purchases, and order history.",
      "Verification content — the SMS one-time codes and messages received on a virtual number you purchase, shown to you in your dashboard.",
      "Payment information — handled by our payment processors (e.g. Flutterwave). We do not store your full card details.",
      "Technical data — device, browser, IP address, and usage information used to keep the Services secure and working.",
    ],
  },
  {
    h: "3. How we use your information",
    list: [
      "To provide, operate, and improve the Services and process your orders.",
      "To keep your account and our platform secure and to prevent fraud and abuse.",
      "To communicate with you about your account, orders, and support requests.",
      "To meet legal, regulatory, tax, and anti-money-laundering obligations.",
    ],
  },
  {
    h: "4. How we share information",
    body: [
      "We do not sell your personal data. We share it only as needed to run the Services:",
    ],
    list: [
      "With service providers that deliver parts of the Services (payment processors, virtual-number and network providers, hosting).",
      "When required by law, court order, or a valid request from law enforcement or regulators.",
      "To investigate, prevent, or act against fraud, security issues, or violations of our Terms.",
    ],
  },
  {
    h: "5. Data retention",
    body: [
      "We keep your information for as long as your account is active and as needed to provide the Services, resolve disputes, and comply with our legal obligations. Verification codes are transient and are stored only as long as needed to show them to you.",
    ],
  },
  {
    h: "6. Security",
    body: [
      "We use encryption and access controls to protect your information. No system is perfectly secure, so we cannot guarantee absolute security, but we work hard to safeguard your data and reconcile wallet balances and holds.",
    ],
  },
  {
    h: "7. Your rights",
    body: [
      "You may access and update your account details from your profile, and you can request deletion of your account subject to any legal record-keeping we must maintain. Contact us using the website's Contact button for any privacy request.",
    ],
  },
  {
    h: "8. Cookies",
    body: [
      "We use essential cookies and similar technologies to keep you signed in, remember your preferences (such as light/dark theme), and keep the Services secure.",
    ],
  },
  {
    h: "9. Children",
    body: [
      "The Services are not intended for anyone under 18. We do not knowingly collect data from children.",
    ],
  },
  {
    h: "10. Changes & contact",
    body: [
      "We may update this Privacy Policy from time to time; the latest version will always be posted here. For any questions, use the Contact button on our website or reach our support team.",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12 max-w-3xl">
        <Link to="/register" className="inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:underline mb-6">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <Lock size={22} />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Effective date: {EFFECTIVE}</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Your privacy matters to us. This policy explains what we collect, why, and how we protect it.
        </p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{s.h}</h2>
              {s.body?.map((p, i) => (
                <p key={i} className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p}</p>
              ))}
              {s.list && (
                <ul className="mt-3 space-y-2">
                  {s.list.map((li, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-xs text-slate-500 dark:text-slate-400">
          See also our{" "}
          <Link to="/terms" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</Link>.
        </div>
      </div>
    </div>
  );
}