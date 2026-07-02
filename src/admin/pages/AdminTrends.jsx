import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAdminTrends } from "../api/adminApi";
import { Flame, Phone, CreditCard } from "lucide-react";

const FLAG = (cc = "") => {
  const c = String(cc).trim().toUpperCase();
  if (c.length !== 2) return "🌐";
  return String.fromCodePoint(...[...c].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
};
const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

function RankList({ title, icon: Icon, rows, labelFn }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
      <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Icon size={18} className="text-brand-500" /> {title}
      </h2>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-400">No data yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-700 dark:text-slate-200 font-medium">{i + 1}. {labelFn(r)}</span>
                <span className="tabular-nums text-slate-500 dark:text-slate-400">{r.count}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: `${(r.count / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminTrends() {
  const token = useSelector(selectAdminToken);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try { setData(await getAdminTrends(token)); }
      catch (e) { setError(e.message || "Failed to load trends"); }
      finally { setLoading(false); }
    })();
  }, [token]);

  if (loading) return <p className="text-slate-600 dark:text-slate-300">Loading trends…</p>;
  if (error) return <p className="text-rose-600">{error}</p>;

  const d = data || {};
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Flame className="text-orange-500" /> Trends
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">What users buy the most — powers the app's "Recommended" lists</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Numbers sold</p>
          <p className="text-2xl font-bold mt-1 tabular-nums text-slate-900 dark:text-white">{d.numbers_sold ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Giftcards sold</p>
          <p className="text-2xl font-bold mt-1 tabular-nums text-slate-900 dark:text-white">{d.giftcards_sold ?? 0}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RankList title="Top services" icon={Phone} rows={d.top_services || []} labelFn={(r) => cap(r.service || "—")} />
        <RankList title="Top countries" icon={Phone} rows={d.top_countries || []} labelFn={(r) => `${FLAG(r.country)} ${r.country || "—"}`} />
        <RankList title="Top number combos" icon={Phone} rows={d.top_number_combos || []} labelFn={(r) => `${cap(r.service || "")} · ${FLAG(r.country)} ${r.country || ""}`} />
        <RankList title="Top giftcards" icon={CreditCard} rows={d.top_giftcards || []} labelFn={(r) => r.product_name || "—"} />
      </div>
    </div>
  );
}

export default AdminTrends;
