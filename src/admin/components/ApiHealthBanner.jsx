import { AlertTriangle } from "lucide-react";
import useAdminData from "../useAdminData";

const ngn = (v) => `₦${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

/**
 * Platform-wide low-balance warning, shown in BOTH admin shells. Reads from the
 * shared store (cached), so the slow live provider-balance call happens once and
 * is reused across every page — not re-fetched on each navigation.
 */
export default function ApiHealthBanner() {
  const { data } = useAdminData("apiBalances", { pollMs: 120000 });

  const low = (data?.providers || []).filter((p) => p.low);
  if (low.length === 0) return null;
  const threshold = data?.threshold_ngn || 20000;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 p-4 mb-6">
      <AlertTriangle size={20} className="shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-bold">
          {low.length === 1 ? "An API balance is low" : `${low.length} API balances are low`}
          {" "}(below {ngn(threshold)})
        </p>
        <p className="mt-0.5">
          {low.map((p) => `${p.name}: ${ngn(p.balance_ngn)}`).join(" · ")} — top up to avoid failed purchases.
        </p>
      </div>
    </div>
  );
}
