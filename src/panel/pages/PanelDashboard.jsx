import { Copy, Users, Wallet, TrendingUp, Link2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import useAdminData from "../../admin/useAdminData";

const ngn = (v) => `₦${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

function Tile({ icon: Icon, label, value, from, to }) {
  return (
    <div className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br ${from} ${to}`}>
      <div className="flex items-center gap-2 opacity-90">
        <Icon size={18} />
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold mt-2 tabular-nums">{value}</p>
    </div>
  );
}

export default function PanelDashboard() {
  const { data: me, loading, error } = useAdminData("panelMe");

  if (loading) return <p className="text-slate-500 dark:text-slate-300">Loading…</p>;
  if (!me) return error ? <p className="text-rose-600">{error}</p> : null;

  const s = me.sales;
  const copyLink = () => {
    navigator.clipboard?.writeText(me.referral_link || "");
    toast.success("Referral link copied");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Welcome, {me.full_name || me.username}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Share your link, bring in users, and track your sales here.
        </p>
      </div>

      {/* Referral link — the admin's whole job starts here */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-5 mb-6">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-2">
          <Link2 size={18} /> <span className="font-semibold">Your referral link</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-[#0d1c17] px-4 py-2.5 font-mono text-sm text-slate-800 dark:text-slate-200 break-all">
            {me.referral_link}
          </div>
          <button
            onClick={copyLink}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-sm font-semibold shrink-0"
          >
            <Copy size={16} /> Copy link
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Every user who signs up through this link is yours — you'll see them under My Users.
        </p>
      </div>

      {/* Sales at a glance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Tile icon={Users} label="Referred users" value={s.referred_users} from="from-emerald-500" to="to-teal-600" />
        <Tile icon={CheckCircle2} label="Funded users" value={s.active_users} from="from-sky-500" to="to-indigo-600" />
        <Tile icon={Wallet} label="They deposited" value={ngn(s.deposited)} from="from-violet-500" to="to-purple-600" />
        <Tile icon={TrendingUp} label="They spent" value={ngn(s.total_spent)} from="from-amber-500" to="to-orange-600" />
      </div>

      {/* Spend breakdown */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1c17] p-5">
        <h2 className="font-bold text-slate-900 dark:text-white mb-3">What your users spent on</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            ["Numbers", s.spent_on_numbers],
            ["Boost", s.spent_on_boost],
            ["eSIM", s.spent_on_esim],
            ["Rentals", s.spent_on_rentals],
          ].map(([label, v]) => (
            <div key={label}>
              <p className="text-slate-500 dark:text-slate-400">{label}</p>
              <p className="font-bold text-slate-900 dark:text-white tabular-nums">{ngn(v)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
