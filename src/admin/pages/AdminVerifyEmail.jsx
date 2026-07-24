import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, LogIn, Copy, Check, ShieldAlert } from "lucide-react";
import Logo from "../../components/Logo";
import { verifyAdminEmail } from "../api/adminApi";

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 mt-0.5">
        <span className="font-mono font-bold text-slate-900 dark:text-white break-all">{value}</span>
        <button onClick={copy} className="shrink-0 text-brand-600 dark:text-brand-400 hover:opacity-80" title={`Copy ${label.toLowerCase()}`}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

/**
 * Landing page for the admin email-confirmation link (/admin/verify?token=…).
 * Public: the signed token is the credential. On success it shows the admin
 * their username and a link to the admin login.
 */
export default function AdminVerifyEmail() {
  const [state, setState] = useState("verifying"); // verifying | ok | error
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setState("error");
      setError("This link is missing its confirmation token.");
      return;
    }
    verifyAdminEmail(token)
      .then((d) => { setInfo(d); setState("ok"); })
      .catch((e) => { setError(e.message); setState("error"); });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
        <div className="flex justify-center mb-5"><Logo size={40} /></div>

        {state === "verifying" && (
          <p className="text-slate-500 dark:text-slate-300 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} /> Confirming your email…
          </p>
        )}

        {state === "ok" && (
          <>
            <CheckCircle2 size={44} className="mx-auto text-emerald-500 mb-3" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Email verified</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Your admin account is ready{info?.full_name ? `, ${info.full_name}` : ""}. Here are your login details.
            </p>

            <div className="mt-5 space-y-3 text-left">
              <CopyRow label="Username" value={info?.username} />
              {info?.password && <CopyRow label="Password" value={info.password} />}
            </div>

            {/* Keep-it-safe warning */}
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-3 text-left">
              <ShieldAlert size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Keep these credentials safe and don't share them. Copy them now.
                Only the platform owner can change your username or password.
              </p>
            </div>

            <a
              href={info?.login_url || "/admin/login"}
              className="mt-5 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 text-white py-2.5 font-semibold"
            >
              <LogIn size={16} /> Go to admin login
            </a>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle size={44} className="mx-auto text-rose-500 mb-3" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Couldn't confirm</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{error}</p>
            <p className="text-xs text-slate-400 mt-3">
              Ask the administrator who added you to resend the confirmation link.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
