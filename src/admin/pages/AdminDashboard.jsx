import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAdminOverview } from "../api/adminApi";
import {
  Users,
  Phone,
  MessageSquareText,
  XCircle,
  Wallet,
  TrendingUp,
  Smartphone,
} from "lucide-react";

function Stat({ icon: Icon, label, value, tint }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className={`grid place-items-center w-9 h-9 rounded-xl ${tint}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900 tabular-nums">{value}</span>
    </div>
  );
}

const fmt = (v) => `NGN ${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

function AdminDashboard() {
  const token = useSelector(selectAdminToken);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        setData(await getAdminOverview(token));
      } catch (e) {
        setError(e.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <p className="text-slate-600">Loading dashboard…</p>;
  if (error) return <p className="text-rose-600">{error}</p>;

  const n = data.numbers;
  const d = data.deposits;
  const b = data.boosts;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Overview</h1>
      <p className="text-slate-500 mb-8">Platform activity at a glance</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={Users} label="Users" value={data.users} tint="bg-brand-50 text-brand-600" />
        <Stat icon={Phone} label="Numbers sold" value={n.total} tint="bg-violet-50 text-violet-600" />
        <Stat icon={MessageSquareText} label="SMS received" value={n.sms_received} tint="bg-emerald-50 text-emerald-600" />
        <Stat icon={XCircle} label="Cancelled" value={n.cancelled} tint="bg-rose-50 text-rose-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Smartphone size={18} className="text-brand-500" /> Numbers
          </h2>
          <Row label="Via API" value={n.api} />
          <Row label="Via app (normal)" value={n.normal} />
          <Row label="Active" value={n.active} />
          <Row label="Pending" value={n.pending} />
          <Row label="Expired" value={n.expired} />
          <Row label="Revenue (charged)" value={fmt(n.revenue)} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Wallet size={18} className="text-brand-500" /> Deposits
          </h2>
          <Row label="Paid" value={d.paid} />
          <Row label="Pending" value={d.pending} />
          <Row label="Failed" value={d.failed} />
          <Row label="Total volume" value={fmt(d.volume)} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-500" /> Boosts
          </h2>
          <Row label="Total" value={b.total} />
          <Row label="Processing" value={b.processing} />
          <Row label="Failed" value={b.failed} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
