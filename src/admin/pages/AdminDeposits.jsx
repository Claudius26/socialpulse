import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import {
  confirmManualDeposit,
  getAdminDeposits,
  rejectManualDeposit,
} from "../../admin/api/adminApi";

function AdminDeposits() {
  const token = useSelector(selectAdminToken);

  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  async function fetchDeposits() {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminDeposits(token);
      setDeposits(data);
    } catch (error) {
      setError(error.message || "Failed to load deposits");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchDeposits();
    }
  }, [token]);

  const handleConfirm = async (depositId) => {
    try {
      setActionLoadingId(depositId);
      await confirmManualDeposit(token, depositId);
      await fetchDeposits();
    } catch (error) {
      alert(error.message || "Failed to confirm deposit");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (depositId) => {
    const reason = prompt("Enter rejection reason") || "Rejected by admin";

    try {
      setActionLoadingId(depositId);
      await rejectManualDeposit(token, depositId, reason);
      await fetchDeposits();
    } catch (error) {
      alert(error.message || "Failed to reject deposit");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading deposits...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Deposits</h1>

      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-slate-100">
            <tr className="text-left">
              <th className="p-4">Deposit ID</th>
              <th className="p-4">User Email</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Currency</th>
              <th className="p-4">Method</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Confirmed</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit.id} className="border-t">
                <td className="p-4">{deposit.id}</td>
                <td className="p-4">{deposit.user_email}</td>
                <td className="p-4">{deposit.amount}</td>
                <td className="p-4">{deposit.currency}</td>
                <td className="p-4">{deposit.method}</td>
                <td className="p-4 capitalize">{deposit.status}</td>
                <td className="p-4">
                  {deposit.created_at
                    ? new Date(deposit.created_at).toLocaleString()
                    : "-"}
                </td>
                <td className="p-4">
                  {deposit.confirmed_at
                    ? new Date(deposit.confirmed_at).toLocaleString()
                    : "-"}
                </td>
                <td className="p-4">
                  {deposit.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirm(deposit.id)}
                        disabled={actionLoadingId === deposit.id}
                        className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoadingId === deposit.id ? "Please wait..." : "Confirm"}
                      </button>

                      <button
                        onClick={() => handleReject(deposit.id)}
                        disabled={actionLoadingId === deposit.id}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoadingId === deposit.id ? "Please wait..." : "Reject"}
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500">No action</span>
                  )}
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