import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { COMPANY, LEGAL_EFFECTIVE } from "../legal/company";

/**
 * Shared layout for Terms / Privacy / Refund pages.
 * sections: [{ h, body?: string[], list?: string[], after?: string[], warn?: bool }]
 */
export default function LegalPage({ title, icon, intro, sections, footer }) {
  const Icon = icon;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:underline mb-6">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <Icon size={22} />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Effective date: {LEGAL_EFFECTIVE}</p>
          </div>
        </div>

        {intro && (
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{intro}</p>
        )}

        <nav className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Contents</p>
          <ol className="mt-2 grid gap-1 sm:grid-cols-2 text-sm">
            {sections.map((s, i) => (
              <li key={s.h}>
                <a href={`#s${i}`} className="text-brand-600 dark:text-brand-400 hover:underline">{s.h}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <section key={s.h} id={`s${i}`} className="scroll-mt-24">
              <h2 className={`text-lg font-bold ${s.warn ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                {s.h}
              </h2>
              {s.body?.map((p, j) => (
                <p key={j} className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p}</p>
              ))}
              {s.list && (
                <ul className="mt-3 space-y-2">
                  {s.list.map((li, j) => (
                    <li key={j} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${s.warn ? "bg-rose-500" : "bg-brand-500"}`} />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.after?.map((p, j) => (
                <p key={j} className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          {footer}
          <p>
            {COMPANY.legalName} · CAC {COMPANY.registration} ·{" "}
            <a href={COMPANY.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">View certificate</a>
            {" · "}{COMPANY.address} ·{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-brand-600 dark:text-brand-400 hover:underline">{COMPANY.email}</a>
          </p>
          <p>
            <Link to="/terms" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</Link>
            {" · "}
            <Link to="/privacy" className="text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</Link>
            {" · "}
            <Link to="/refund-policy" className="text-brand-600 dark:text-brand-400 hover:underline">Refund Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
