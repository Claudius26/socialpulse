import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Wifi, Globe, Clock, Loader2, Infinity as InfinityIcon, QrCode } from "lucide-react";

const BASE = import.meta.env.VITE_BACKEND_BASE;

const SYMBOLS = { NGN: "₦", GHS: "₵", KES: "KSh", ZAR: "R", XOF: "CFA", XAF: "FCFA", UGX: "USh", USD: "$" };

// Popular destinations (ISO code → eSIM Go filters by this).
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

// ISO country code → flag emoji.
const flag = (iso) =>
  iso ? iso.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0))) : "🌍";

const dataLabel = (p) => {
  if (p.unlimited || p.data_amount_mb <= 0) return "Unlimited";
  const mb = p.data_amount_mb;
  return mb >= 1000 ? `${(mb / 1000).toFixed(mb % 1000 ? 1 : 0)} GB` : `${mb} MB`;
};

const money = (amount, cur) => {
  const sym = SYMBOLS[cur] || `${cur} `;
  return `${sym}${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

export default function Esim() {
  const [country, setCountry] = useState("US");
  const [plans, setPlans] = useState([]);
  const [currency, setCurrency] = useState("NGN");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE}/api/esim/catalogue/?country=${country}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data?.error || "Couldn't load eSIM plans.");
          setPlans([]);
        } else {
          setPlans(data.plans || []);
          setCurrency(data.currency || "NGN");
        }
      } catch {
        if (!cancelled) setError("Couldn't load eSIM plans. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [country, token]);

  const buy = () => {
    toast.info("eSIM checkout is launching shortly — your plan and price are locked in. You'll be able to buy right here in-app very soon.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg">
            <Wifi size={22} />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Buy eSIM</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Data plans for 190+ countries. Scan the QR, get online — no physical SIM.
            </p>
          </div>
        </div>

        {/* Country picker */}
        <div className="mt-6 max-w-sm">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
            <Globe size={14} /> Destination
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
          >
            {COUNTRIES.map(([iso, name]) => (
              <option key={iso} value={iso}>{flag(iso)}  {name}</option>
            ))}
          </select>
        </div>

        {/* Plans */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              <Loader2 className="animate-spin mr-2" size={20} /> Loading plans…
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm">{error}</div>
          ) : plans.length === 0 ? (
            <p className="text-slate-400 text-sm py-10 text-center">No plans available for this destination yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.map((p) => (
                <div key={p.name} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl leading-none">{flag(p.country_iso)}</span>
                    {p.unlimited && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-full">
                        <InfinityIcon size={12} /> Unlimited
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{p.country_name || "Global"}</p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Wifi size={18} className="text-teal-500" /> {dataLabel(p)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={14} /> {p.duration_days} day{p.duration_days === 1 ? "" : "s"}
                  </p>

                  <div className="mt-auto pt-4">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{money(p.price, currency)}</p>
                    <button
                      onClick={buy}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 text-sm"
                    >
                      <QrCode size={16} /> Buy eSIM
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
