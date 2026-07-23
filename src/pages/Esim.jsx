import { useEffect, useState, useCallback } from "react";
import { getUserAccess } from "../features/auth/token";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Wifi, Globe, Clock, Loader2, QrCode, Copy, X, Inbox, ShieldCheck, CheckCircle2, Plus,
} from "lucide-react";
import { fetchUserProfile } from "../features/auth/authSlice";

const BASE = import.meta.env.VITE_BACKEND_BASE;
const SYMBOLS = { NGN: "₦", GHS: "₵", KES: "KSh", ZAR: "R", XOF: "CFA", XAF: "FCFA", UGX: "USh", USD: "$" };

const COUNTRIES = [
  ["US", "United States"], ["GB", "United Kingdom"], ["CA", "Canada"],
  ["NG", "Nigeria"], ["GH", "Ghana"], ["ZA", "South Africa"], ["KE", "Kenya"],
  ["AE", "United Arab Emirates"], ["SA", "Saudi Arabia"], ["TR", "Türkiye"],
  ["EG", "Egypt"], ["IN", "India"], ["CN", "China"], ["JP", "Japan"],
  ["TH", "Thailand"], ["SG", "Singapore"], ["MY", "Malaysia"], ["ID", "Indonesia"],
  ["AU", "Australia"], ["FR", "France"], ["DE", "Germany"], ["ES", "Spain"],
  ["IT", "Italy"], ["NL", "Netherlands"], ["PT", "Portugal"], ["GR", "Greece"],
  ["BR", "Brazil"], ["MX", "Mexico"],
];

const flag = (iso) =>
  iso ? iso.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0))) : "🌍";

const dataLabel = (mb) => {
  if (!mb || mb <= 0) return "Unlimited";
  return mb >= 1024 ? `${(mb / 1024).toFixed(mb % 1024 ? 1 : 0)} GB` : `${mb} MB`;
};

const money = (amount, cur) => `${SYMBOLS[cur] || `${cur} `}${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function Esim() {
  const dispatch = useDispatch();
  const token = getUserAccess();
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [country, setCountry] = useState("US");
  const [plans, setPlans] = useState([]);
  const [currency, setCurrency] = useState("NGN");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState("");
  const [mine, setMine] = useState([]);
  const [qr, setQr] = useState(null); // eSIM order object being shown

  // Top-up ("reload"): more data onto an eSIM the user already owns. Same ICCID,
  // separate charge — nothing new to install.
  const [topup, setTopup] = useState(null); // { esim, packages }
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupBuying, setTopupBuying] = useState("");
  const [topupError, setTopupError] = useState("");

  const loadMine = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/esim/mine/`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) setMine(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openTopup = async (esim) => {
    setTopup({ esim, packages: [] });
    setTopupError("");
    setTopupLoading(true);
    try {
      const res = await fetch(`${BASE}/api/esim/${esim.id}/topup-packages/`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't load reload plans.");
      setTopup({ esim, packages: data.packages || [] });
    } catch (e) {
      setTopupError(e.message);
    } finally {
      setTopupLoading(false);
    }
  };

  const doTopup = async (packageCode) => {
    setTopupBuying(packageCode);
    setTopupError("");
    try {
      const res = await fetch(`${BASE}/api/esim/${topup.esim.id}/topup/`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ package_code: packageCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Reload failed.");
      toast.success("Data added to your eSIM.");
      setTopup(null);
      await loadMine();
      dispatch(fetchUserProfile(token)); // the reload debited the wallet
    } catch (e) {
      setTopupError(e.message);
    } finally {
      setTopupBuying("");
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE}/api/esim/catalogue/?country=${country}`, { headers: authHeaders });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) { setError(data?.error || "Couldn't load eSIM plans."); setPlans([]); }
        else { setPlans(data.plans || []); setCurrency(data.currency || "NGN"); }
      } catch {
        if (!cancelled) setError("Couldn't load eSIM plans. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, token]);

  useEffect(() => { loadMine(); }, [loadMine]);

  const buy = async (p) => {
    if (!window.confirm(`Buy ${p.name} for ${money(p.price, currency)}? eSIMs are a final purchase.`)) return;
    setBuying(p.package_code);
    try {
      const res = await fetch(`${BASE}/api/esim/buy/`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ package_code: p.package_code, country }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Purchase failed");
      toast.success("eSIM purchased — scan the QR to install.");
      dispatch(fetchUserProfile(token)); // refresh wallet balance
      await loadMine();
      if (data.qr_url) setQr(data); // show the QR straight away
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBuying("");
    }
  };

  const copy = (t) => { navigator.clipboard?.writeText(t); toast.info("Copied"); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg">
            <Wifi size={22} />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Buy eSIM</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Data plans for 100+ countries. Buy, scan the QR, get online — no physical SIM.
            </p>
          </div>
        </div>

        {/* Country picker */}
        <div className="mt-6 max-w-sm">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <Globe size={14} /> Destination
          </label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100">
            {COUNTRIES.map(([iso, name]) => (
              <option key={iso} value={iso}>{flag(iso)}  {name}</option>
            ))}
          </select>
        </div>

        {/* Plans */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="animate-spin mr-2" size={20} /> Loading plans…
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm">{error}</div>
          ) : plans.length === 0 ? (
            <p className="text-slate-400 text-sm py-10 text-center">No plans available for this destination yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.map((p) => (
                <div key={p.package_code} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl leading-none">{flag(country)}</span>
                    <span className="text-[11px] text-slate-400">{(p.location || "").split(",").slice(0, 3).join(" · ")}</span>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Wifi size={18} className="text-teal-500" /> {dataLabel(p.data_mb)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={14} /> {p.duration_days} {p.duration_unit || "day"}{p.duration_days === 1 ? "" : "s"}
                  </p>
                  <div className="mt-auto pt-4">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{money(p.price, currency)}</p>
                    <button onClick={() => buy(p)} disabled={!!buying}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 text-sm disabled:opacity-50">
                      {buying === p.package_code ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                      {buying === p.package_code ? "Purchasing…" : "Buy eSIM"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My eSIMs */}
        <h2 className="mt-10 mb-3 text-lg font-bold text-slate-900 dark:text-white">My eSIMs</h2>
        {mine.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            <Inbox size={26} className="mx-auto mb-2 opacity-60" /> No eSIMs yet.
          </div>
        ) : (
          // On phones the card stacks: Install and Add data share a full-width row
          // under the plan name instead of being squeezed beside it, which was
          // clipping "Add data" to "Add da". whitespace-nowrap stops either label
          // from breaking mid-word.
          <div className="grid sm:grid-cols-2 gap-3">
            {mine.map((e) => (
              <div key={e.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">{e.bundle_name || dataLabel(e.data_amount_mb)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {dataLabel(e.data_amount_mb)} · {e.duration_days}d
                    {e.expired_time ? ` · expires ${new Date(e.expired_time).toLocaleDateString()}` : ""}
                  </p>
                </div>
                {e.qr_url ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0">
                    <button
                      onClick={() => setQr(e)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-teal-600 hover:bg-teal-500 text-white px-2.5 py-1.5 text-xs font-semibold"
                    >
                      <QrCode size={13} className="shrink-0" /> Install
                    </button>
                    <button
                      onClick={() => openTopup(e)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold"
                    >
                      <Plus size={13} className="shrink-0" /> Add data
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-500 sm:shrink-0">
                    <Loader2 size={12} className="animate-spin" /> preparing
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top-up ("reload") — buy more data onto an eSIM the user already has. */}
      {topup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !topupBuying && setTopup(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white">Add data</h3>
              <button onClick={() => !topupBuying && setTopup(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Reload <span className="font-medium">{topup.esim.bundle_name}</span> — the data is added to the
              same eSIM, so there's nothing new to install.
            </p>

            {topupError && <p className="mb-3 text-sm text-rose-600">{topupError}</p>}

            {topupLoading ? (
              <p className="py-6 text-center text-sm text-slate-400">
                <Loader2 size={16} className="inline animate-spin mr-1" /> Loading plans…
              </p>
            ) : topup.packages.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                No reload plans available for this eSIM.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {topup.packages.map((p) => (
                  <div key={p.package_code} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {dataLabel(p.data_mb)} · {p.duration_days}d
                      </p>
                    </div>
                    <button
                      disabled={!!topupBuying}
                      onClick={() => doTopup(p.package_code)}
                      className="shrink-0 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white px-3 py-1.5 text-sm font-semibold"
                    >
                      {topupBuying === p.package_code
                        ? "Buying…"
                        : `${Number(p.price).toLocaleString()} ${p.currency}`}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR / install modal */}
      {qr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setQr(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white">Install your eSIM</h3>
              <button onClick={() => setQr(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{qr.bundle_name}</p>

            {qr.qr_url && (
              <img src={qr.qr_url} alt="eSIM QR code" className="w-48 h-48 mx-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-2" />
            )}

            <ol className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex gap-1.5"><CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" /> Phone Settings → Cellular / Mobile Data → Add eSIM.</li>
              <li className="flex gap-1.5"><CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" /> Choose "Scan QR code" and scan the code above.</li>
              <li className="flex gap-1.5"><CheckCircle2 size={14} className="text-teal-500 shrink-0 mt-0.5" /> Or install manually with the activation code below.</li>
            </ol>

            {qr.activation_code && (
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-slate-500">Activation code (manual install)</p>
                <div className="mt-1 flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
                  <code className="text-[11px] break-all text-slate-700 dark:text-slate-200 flex-1">{qr.activation_code}</code>
                  <button onClick={() => copy(qr.activation_code)} className="text-slate-400 hover:text-slate-600 shrink-0"><Copy size={14} /></button>
                </div>
              </div>
            )}

            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck size={13} /> Keep your main SIM — the eSIM is data-only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
