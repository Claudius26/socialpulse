import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAdminUsers, getAdminDeposits } from "../api/adminApi";
import StatCard from "../components/StatCard";

function AdminDashboard() {
  const token = useSelector(selectAdminToken);

  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [usersData, depositsData] = await Promise.all([
          getAdminUsers(token),
          getAdminDeposits(token),
        ]);

        setUsers(usersData);
        setDeposits(depositsData);
      } catch (error) {
        setError(error.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const pendingDeposits = deposits.filter((item) => item.status === "pending");
  const paidDeposits = deposits.filter((item) => item.status === "paid");
  const failedDeposits = deposits.filter((item) => item.status === "failed");

  if (loading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Users" value={users.length} />
        <StatCard title="Total Deposits" value={deposits.length} />
        <StatCard title="Pending Deposits" value={pendingDeposits.length} />
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Deposit Summary
        </h2>

        <div className="space-y-2 text-slate-700">
          <p>Paid Deposits: {paidDeposits.length}</p>
          <p>Pending Deposits: {pendingDeposits.length}</p>
          <p>Failed Deposits: {failedDeposits.length}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;