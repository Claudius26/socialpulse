import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;
const URL = `${BACKEND_BASE}/api/account/deletion-request/`;

/**
 * NDPA right to erasure: the user REQUESTS deletion; the super admin reviews and
 * closes the account. Users cannot delete themselves instantly.
 */
export default function DeleteAccountRequest({ token }) {
  const [current, setCurrent] = useState(null);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  useEffect(() => {
    let alive = true;
    fetch(URL, { headers, credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && d && setCurrent(d.request))
      .catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const pending = current?.status === "pending";

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(URL, {
        method: "POST", headers, credentials: "include",
        body: JSON.stringify({ password, reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
      setCurrent(data.request);
      setOpen(false);
      setPassword("");
      setReason("");
      toast.success("Deletion request sent. We'll process it within 30 days.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    setBusy(true);
    try {
      const res = await fetch(URL, { method: "DELETE", headers, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not cancel the request.");
      setCurrent(data.request);
      toast.success("Deletion request cancelled.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-rose-200 dark:border-rose-900/60 p-4 max-w-md">
      <h3 className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
        <Trash2 size={16} /> Delete account
      </h3>

      {pending ? (
        <>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            You asked us to delete your account on{" "}
            {new Date(current.created_at).toLocaleDateString()}. We will process it within 30 days.
            Changed your mind?
          </p>
          <button type="button" onClick={cancel} disabled={busy}
            className="btn btn-sm mt-3 w-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
            {busy ? "Working…" : "Cancel deletion request"}
          </button>
        </>
      ) : (
        <>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Ask us to close your account and erase your personal data. If you still have a wallet
            balance, contact support about it before requesting deletion. Some records are kept
            for as long as the law requires (see our{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>).
          </p>
          <button type="button" onClick={() => setOpen(true)}
            className="btn btn-sm mt-3 w-full bg-rose-600 text-white hover:bg-rose-700">
            Delete my account
          </button>
        </>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => !busy && setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-5"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete your account?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              We'll review your request, settle any open orders, and close your account within
              30 days. Once your account is closed you won't be able to sign in.
            </p>

            <label className="block mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
              Reason (optional)
            </label>
            <textarea rows={3} maxLength={1000} value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input mt-1 w-full resize-none" placeholder="Tell us why you're leaving" />

            <label className="block mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
              Confirm your password
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="input mt-1 w-full" placeholder="Leave blank if you only sign in with Google" />

            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

            <div className="mt-5 flex gap-3 justify-end">
              <button type="button" onClick={() => setOpen(false)} disabled={busy} className="btn btn-md btn-ghost">
                Cancel
              </button>
              <button type="button" onClick={submit} disabled={busy}
                className="btn btn-md text-white bg-rose-600 hover:bg-rose-700">
                {busy ? "Sending…" : "Request deletion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
