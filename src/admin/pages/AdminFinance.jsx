import { useNavigate } from "react-router";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import useAdminData from "../useAdminData";

const ngn = (v) =>
  `₦${Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Stat({ label, value, tint, sub }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 tabular-nums ${tint || "text-slate-900 dark:text-white"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminFinance() {
  const navigate = useNavigate();
  const { data, loading, error } = useAdminData("finance", { pollMs: 30000 });

  if (loading) return <p className="text-slate-600 dark:text-slate-300">Loading finance…</p>;
  if (!data) return error ? <p className="text-rose-600">{error}</p> : null;

  const { wallet_liability, reserved_total, deposited_total, revenue, profit_ngn, funds_integrity } = data;

  return (
    <div>
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Finance & Reconciliation
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Profit, liability, and fund-integrity checks · refreshes every 30s. Profit shown in NGN.
        </p>
      </div>

      {/* Money position */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Stat label="Wallet liability" value={ngn(wallet_liability)} sub="What you owe users" />
        <Stat label="Reserved (held)" value={ngn(reserved_total)} sub="Active holds across users" />
        <Stat label="Deposited (all-time)" value={ngn(deposited_total)} tint="text-sky-600 dark:text-sky-400" />
        <Stat
          label="Total profit"
          value={ngn(profit_ngn.total)}
          tint="text-brand-600 dark:text-brand-400"
          sub="Numbers + boost + eSIM + rentals"
        />
      </div>

      {/* Revenue vs profit breakdown. eSIM and rentals were previously missing
          from these figures entirely — every eSIM and rental sale was invisible
          to revenue and profit. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Stat label="Numbers revenue" value={ngn(revenue.numbers)} />
        <Stat label="Numbers profit" value={ngn(profit_ngn.numbers)} tint="text-emerald-600 dark:text-emerald-400" />
        <Stat label="Boost revenue" value={ngn(revenue.boost)} />
        <Stat label="Boost profit" value={ngn(profit_ngn.boost)} tint="text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="eSIM revenue" value={ngn(revenue.esim)} sub="Incl. reloads" />
        <Stat label="eSIM profit" value={ngn(profit_ngn.esim)} tint="text-emerald-600 dark:text-emerald-400" />
        <Stat label="Rentals revenue" value={ngn(revenue.rentals)} sub="Incl. reactivations" />
        <Stat label="Rentals profit" value={ngn(profit_ngn.rentals)} tint="text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Funds integrity */}
      {funds_integrity.ok ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 p-4">
          <ShieldCheck size={22} />
          <p className="text-sm font-medium">
            All accounts reconcile — every wallet's reserved balance matches its held numbers. No missing funds.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-rose-300 dark:border-rose-900 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 p-4">
            <ShieldAlert size={22} />
            <p className="text-sm font-semibold">
              {funds_integrity.discrepancy_count} account
              {funds_integrity.discrepancy_count === 1 ? "" : "s"} with fund discrepancies — investigate now.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
                <tr className="text-left">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium text-right">Reserved Δ</th>
                  <th className="p-4 font-medium text-right">API reserved Δ</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {funds_integrity.accounts.map((a) => (
                  <tr
                    key={a.user_id}
                    className="border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                    onClick={() => navigate(`/admin/users/${a.user_id}`)}
                  >
                    <td className="p-4">{a.email}</td>
                    <td className="p-4 text-right tabular-nums text-rose-600 dark:text-rose-400">
                      {ngn(a.reserved_delta)}
                    </td>
                    <td className="p-4 text-right tabular-nums text-rose-600 dark:text-rose-400">
                      {ngn(a.api_reserved_delta)}
                    </td>
                    <td className="p-4 text-right text-brand-600 dark:text-brand-400 text-xs">View →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
