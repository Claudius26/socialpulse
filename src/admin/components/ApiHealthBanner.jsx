import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AlertTriangle } from "lucide-react";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getApiBalances } from "../api/adminApi";

const ngn = (v) => `₦${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

/**
 * Platform-wide low-balance warning. Shown in BOTH the super-admin and the
 * referral-admin shells: when any SMS provider drops below the threshold, every
 * admin sees this (and the backend also emails them). Polls every 2 minutes.
 */
export default function ApiHealthBanner() {
  const token = useSelector(selectAdminToken);
  const [low, setLow] = useState([]);
  const [threshold, setThreshold] = useState(20000);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    const check = () =>
      getApiBalances(token)
        .then((d) => {
          if (!alive) return;
          setThreshold(d.threshold_ngn || 20000);
          setLow((d.providers || []).filter((p) => p.low));
        })
        .catch(() => {});
    check();
    const id = setInterval(check, 120000);
    return () => { alive = false; clearInterval(id); };
  }, [token]);

  if (low.length === 0) return null;

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
