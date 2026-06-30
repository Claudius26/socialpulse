import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { selectAdminDashboard, setAdminDashboard } from "../adminDashboardSlice";
import { getAdminOverview, getCardpulseOverview } from "../api/adminApi";
import {
  Users, Phone, Wallet, TrendingUp, Smartphone, CreditCard,
  ArrowDownToLine, Banknote, BadgeDollarSign,
} from "lucide-react";

const fmt = (v) => `₦${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Hero({ icon: Icon, label, value, gradient, sub }) {
  return (
    <div className={`rounded-2xl p-5 text-white shadow-lg ${gradient}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm/relaxed text-white/80">{label}</p>
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/20">
          <Icon size={20} />
        </span>
      </div>
      <p className="text-2xl md:text-3xl font-extrabold mt-3 tabular-nums break-words">{value}</p>
      {sub ? (
        <p className="text-xs mt-1 inline-flex items-center gap-1.5 text-white/90">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> {sub}
        </p>
      ) : null}
    </div>
  );
}

function Panel({ icon: Icon, title, accent, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
      <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Icon size={18} className={accent} /> {title}
      </h2>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`tabular-nums ${strong ? "font-bold text-brand-600 dark:text-brand-400" : "font-semibold text-slate-900 dark:text-white"}`}>
        {value}
      </span>
    </div>
  );
}

function AdminDashboard() {
  const token = useSelector(selectAdminToken);
  const cached = useSelector(selectAdminDashboard);
  const dispatch = useDispatch();
  const [sp, setSp] = useState(cached.sp);
  const [cp, setCp] = useState(cached.cp);
  // Only show the spinner on a true cold load; revisits render cached data at once.
  const [loading, setLoading] = useState(!cached.sp && !cached.cp);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const [spData, cpData] = await Promise.all([
          getAdminOverview(token).catch(() => null),
          getCardpulseOverview(token).catch(() => null),
        ]);
        if (!active) return;
        if (spData) setSp(spData);
        if (cpData) setCp(cpData);
        dispatch(setAdminDashboard({ sp: spData, cp: cpData }));
      } catch (e) {
        if (active) setError(e.message || "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [token, dispatch]);

  if (loading) return <p className="text-slate-600 dark:text-slate-300">Loading dashboard…</p>;
  if (error && !sp && !cp) return <p className="text-rose-600">{error}</p>;

  const n = sp?.numbers || {};
  const d = sp?.deposits || {};
  const b = sp?.boosts || {};
  const g = cp?.giftcards || {};
  const tr = cp?.trades || {};
  const wd = cp?.withdrawals || {};

  // sp.users already counts every non-admin user across both products (one User
  // table), so it IS the total — don't add cp.users or CardPulse users would be
  // double-counted.
  const totalUsers = sp?.users ?? 0;

  return (
    <div>
      {/* Sticky page header — stays put under the topbar while the cards below
          it scroll underneath. -mx/px cancels the page padding so the background
          spans edge-to-edge and hides content scrolling behind it. */}
      <div className="sticky top-16 z-20 -mx-4 md:-mx-8 px-4 md:px-8 pt-2 pb-4 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200/70 dark:border-slate-800/70">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">SocialPulse &amp; CardPulse activity at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-6">
        <Hero icon={Users} label="Total users" value={totalUsers}
              sub={`${sp?.users_online ?? 0} online now`}
              gradient="bg-gradient-to-br from-brand-600 to-violet-600" />
        <Hero icon={Phone} label="Numbers sold" value={n.sold ?? 0}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <Hero icon={Wallet} label="Deposit volume" value={fmt(d.volume)}
              gradient="bg-gradient-to-br from-sky-500 to-indigo-600" />
        <Hero icon={BadgeDollarSign} label="CardPulse profit" value={fmt(cp?.total_profit)}
              gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
      </div>

      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">SocialPulse</h3>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Panel icon={Smartphone} title="Virtual numbers" accent="text-brand-500">
          <Row label="Sold (excl. cancelled)" value={n.sold ?? 0} strong />
          <Row label="Via API" value={n.api ?? 0} />
          <Row label="Via app" value={n.normal ?? 0} />
          <Row label="SMS received" value={n.sms_received ?? 0} />
          <Row label="Cancelled" value={n.cancelled ?? 0} />
          <Row label="Revenue" value={fmt(n.revenue)} />
        </Panel>
        <Panel icon={Wallet} title="Deposits" accent="text-sky-500">
          <Row label="Paid" value={d.paid ?? 0} />
          <Row label="Pending" value={d.pending ?? 0} />
          <Row label="Failed" value={d.failed ?? 0} />
          <Row label="Volume" value={fmt(d.volume)} strong />
        </Panel>
        <Panel icon={TrendingUp} title="Boosts" accent="text-violet-500">
          <Row label="Total" value={b.total ?? 0} />
          <Row label="Processing" value={b.processing ?? 0} />
          <Row label="Failed" value={b.failed ?? 0} />
        </Panel>
      </div>

      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">CardPulse</h3>
      <div className="grid lg:grid-cols-3 gap-6">
        <Panel icon={CreditCard} title="Giftcards" accent="text-emerald-500">
          <Row label="Orders" value={g.orders ?? 0} />
          <Row label="Completed" value={g.orders_completed ?? 0} />
          <Row label="Active cards" value={g.minted_active ?? 0} />
          <Row label="Inventory" value={`${g.inventory_count ?? 0} (${fmt(g.inventory_value_ngn)})`} />
        </Panel>
        <Panel icon={Banknote} title="Trades" accent="text-amber-500">
          <Row label="Total" value={tr.total ?? 0} />
          <Row label="Completed" value={tr.completed ?? 0} />
          <Row label="Pending review" value={tr.pending_review ?? 0} strong />
          <Row label="Paid out" value={fmt(tr.payout_volume)} />
        </Panel>
        <Panel icon={ArrowDownToLine} title="Withdrawals" accent="text-rose-500">
          <Row label="Total" value={wd.total ?? 0} />
          <Row label="Success" value={wd.success ?? 0} />
          <Row label="Processing" value={wd.processing ?? 0} />
          <Row label="Pending review" value={wd.pending_review ?? 0} strong />
          <Row label="Paid out" value={fmt(wd.paid_out)} />
        </Panel>
      </div>
    </div>
  );
}

export default AdminDashboard;
