import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, LogIn } from "lucide-react";
import Logo from "../../components/Logo";
import { verifyAdminEmail } from "../api/adminApi";

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
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Email confirmed</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Your admin account is ready{info?.full_name ? `, ${info.full_name}` : ""}.
            </p>
            <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-left text-sm">
              <p className="text-slate-500 dark:text-slate-400">Your admin username</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white">{info?.username}</p>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs">
                Use the password your administrator gave you. Only they can change your username or password.
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
