import useAdminData from "../useAdminData";

// Deposits are gateway-only now (Flutterwave / crypto), credited automatically
// by signed webhooks — so this is a read-only record. No manual confirm/reject.
function AdminDeposits() {
  const { data, loading, error } = useAdminData("deposits");
  const deposits = data || [];

  const statusTint = (s) =>
    s === "paid" ? "text-emerald-600 dark:text-emerald-400"
    : s === "failed" ? "text-rose-600 dark:text-rose-400"
    : "text-amber-600 dark:text-amber-400";

  if (loading) {
    return <p className="text-slate-600 dark:text-slate-300">Loading deposits...</p>;
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">Deposits</h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
        Credited automatically by Flutterwave / crypto webhooks — read-only record.
      </p>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="p-4">Deposit ID</th>
              <th className="p-4">User Email</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Currency</th>
              <th className="p-4">Method</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Confirmed</th>
            </tr>
          </thead>

          <tbody>
            {deposits.length === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-slate-400">No deposits yet.</td></tr>
            )}
            {deposits.map((deposit) => (
              <tr key={deposit.id} className="border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200">
                <td className="p-4 text-xs">{deposit.id}</td>
                <td className="p-4">{deposit.user_email}</td>
                <td className="p-4 tabular-nums">{deposit.amount}</td>
                <td className="p-4">{deposit.currency}</td>
                <td className="p-4 capitalize">{deposit.method}</td>
                <td className={`p-4 capitalize font-medium ${statusTint(deposit.status)}`}>{deposit.status}</td>
                <td className="p-4 text-xs whitespace-nowrap">
                  {deposit.created_at ? new Date(deposit.created_at).toLocaleString() : "-"}
                </td>
                <td className="p-4 text-xs whitespace-nowrap">
                  {deposit.confirmed_at ? new Date(deposit.confirmed_at).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDeposits;