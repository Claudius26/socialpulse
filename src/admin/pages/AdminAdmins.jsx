import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserPlus, Ban, CircleCheck, KeyRound, Trash2, Users, ChevronDown, ChevronRight } from "lucide-react";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import {
  getAdmins, createAdmin, suspendAdmin, unsuspendAdmin, changeAdminCredentials, deleteAdmin,
} from "../api/adminApi";

const ngn = (v) => `₦${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const input = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100";

const NEW = { full_name: "", username: "", email: "", password: "" };

export default function AdminAdmins() {
  const token = useSelector(selectAdminToken);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(NEW);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState({});     // admin id -> expanded (credentials editor)
  const [creds, setCreds] = useState({});   // admin id -> { username, password }

  const load = async () => {
    setLoading(true);
    try {
      setAdmins(await getAdmins(token));
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { if (token) load(); /* eslint-disable-next-line */ }, [token]);

  const flash = (msg) => { setNotice(msg); setError(""); setTimeout(() => setNotice(""), 4000); };

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createAdmin(token, form);
      flash(`Admin "${form.username}" created. Give them the username and password to log in.`);
      setForm(NEW);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const act = async (fn, id, okMsg) => {
    try { await fn(token, id); flash(okMsg); load(); }
    catch (e) { setError(e.message); }
  };

  const saveCreds = async (id) => {
    const body = creds[id] || {};
    if (!body.username && !body.password) return setError("Enter a new username or password.");
    try {
      await changeAdminCredentials(token, id, {
        username: body.username || undefined,
        password: body.password || undefined,
      });
      flash("Credentials updated.");
      setCreds((c) => ({ ...c, [id]: {} }));
      setOpen((o) => ({ ...o, [id]: false }));
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users /> Admins
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Employ referral admins, track their sales, and manage their access. Each admin sees only
          their own referred users.
        </p>
      </div>

      {notice && <p className="mb-4 text-sm text-emerald-600">{notice}</p>}
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      {/* Create admin */}
      <form onSubmit={create} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 mb-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><UserPlus size={18} /> Employ a new admin</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input className={input} placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <input className={input} placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className={input} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={input} placeholder="Temp password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button disabled={creating} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
          <UserPlus size={16} /> {creating ? "Creating…" : "Create admin"}
        </button>
        <p className="text-xs text-slate-400 mt-2">
          You set the username and password. Admins cannot change either themselves — only you can, below.
        </p>
      </form>

      {/* Admin list */}
      {loading ? (
        <p className="text-slate-500 dark:text-slate-300">Loading admins…</p>
      ) : admins.length === 0 ? (
        <p className="text-slate-400 text-sm">No admins yet. Create one above.</p>
      ) : (
        <div className="space-y-3">
          {admins.map((a) => {
            const s = a.sales || {};
            const expanded = !!open[a.id];
            return (
              <div key={a.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="p-4 flex flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{a.full_name || a.username}</p>
                      {a.suspended && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">SUSPENDED</span>}
                    </div>
                    <p className="text-xs text-slate-400">@{a.username} · {a.email} · code {a.referral_code}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center"><p className="font-bold text-slate-900 dark:text-white tabular-nums">{s.referred_users ?? 0}</p><p className="text-[11px] text-slate-400">users</p></div>
                    <div className="text-center"><p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{ngn(s.deposited)}</p><p className="text-[11px] text-slate-400">deposited</p></div>
                    <div className="text-center"><p className="font-bold text-slate-900 dark:text-white tabular-nums">{ngn(s.total_spent)}</p><p className="text-[11px] text-slate-400">spent</p></div>
                  </div>
                </div>
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  {a.suspended ? (
                    <button onClick={() => act(unsuspendAdmin, a.id, "Admin unsuspended.")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                      <CircleCheck size={14} /> Unsuspend
                    </button>
                  ) : (
                    <button onClick={() => act(suspendAdmin, a.id, "Admin suspended.")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950">
                      <Ban size={14} /> Suspend
                    </button>
                  )}
                  <button onClick={() => setOpen((o) => ({ ...o, [a.id]: !o[a.id] }))} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <KeyRound size={14} /> Credentials {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <button onClick={() => window.confirm(`Delete admin ${a.username}? Their referred users are kept.`) && act(deleteAdmin, a.id, "Admin deleted.")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
                {expanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Set a new username and/or password for this admin.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input className={input} placeholder="New username" value={creds[a.id]?.username || ""} onChange={(e) => setCreds((c) => ({ ...c, [a.id]: { ...c[a.id], username: e.target.value } }))} />
                      <input className={input} placeholder="New password" value={creds[a.id]?.password || ""} onChange={(e) => setCreds((c) => ({ ...c, [a.id]: { ...c[a.id], password: e.target.value } }))} />
                      <button onClick={() => saveCreds(a.id)} className="rounded-xl bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 text-sm font-semibold shrink-0">Save</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
