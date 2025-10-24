import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  setUser,
  logout,
  selectCurrentUser,
  selectAuthToken,
} from "../features/auth/authSlice";
import { motion } from "framer-motion";
import {
  Wallet,
  Smartphone,
  BarChart3,
  Rocket,
  TrendingUp,
  CreditCard,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boosts, setBoosts] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          dispatch(logout());
          navigate("/login");
          return;
        }
        const data = await res.json();
        if (res.ok) {
          dispatch(setUser({ user: data.user, token }));
          setWallet(data.user.wallet);
          setBoosts(data.user.boosts || []);
          setNumbers(data.user.numbers || []);
          setTransactions(data.user.transactions || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, dispatch, navigate]);

  const formatCurrency = (amount, currency) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency || "NGN",
      }).format(amount || 0);
    } catch {
      return `${currency || "₦"}${(amount || 0).toFixed(2)}`;
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Loading dashboard...</p>
    );
  if (!user)
    return <p className="text-center mt-10 text-gray-600">User not logged in</p>;

  const totalBoostSpent = boosts.reduce(
    (sum, b) => sum + (b.amount || 0),
    0
  );
  const totalNumberSpent = numbers.reduce(
    (sum, n) => sum + (n.price || 0),
    0
  );
  const totalDeposited = transactions
    .filter((tx) => tx.type === "deposit")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const overallSpent = totalBoostSpent + totalNumberSpent;

  const chartData = [
    { day: "Mon", revenue: 400 },
    { day: "Tue", revenue: 200 },
    { day: "Wed", revenue: 800 },
    { day: "Thu", revenue: 300 },
    { day: "Fri", revenue: 700 },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-10 md:px-8 lg:px-10 w-full">
     
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 drop-shadow-sm">
          Welcome, {user.full_name}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <motion.div
          className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-2xl shadow-lg p-6 flex justify-between items-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="text-sm opacity-90">Wallet Balance</p>
            <p className="text-3xl font-extrabold mt-1 break-words">
              {formatCurrency(wallet?.balance, wallet?.currency)}
            </p>
          </div>
          <Wallet size={40} className="opacity-90" />
        </motion.div>

        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex justify-between items-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <p className="text-sm text-gray-500">Boosts in Progress</p>
            <p className="text-2xl font-bold text-gray-800">{boosts.length}</p>
          </div>
          <Rocket className="text-blue-600" size={32} />
        </motion.div>

        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex justify-between items-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <p className="text-sm text-gray-500">Numbers Purchased</p>
            <p className="text-2xl font-bold text-gray-800">
              {numbers.length}
            </p>
          </div>
          <Smartphone className="text-green-600" size={32} />
        </motion.div>

      
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex justify-between items-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-sm text-gray-500">Total Deposited</p>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(totalDeposited, wallet?.currency)}
            </p>
          </div>
          <DollarSign className="text-purple-600" size={32} />
        </motion.div>

        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex justify-between items-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <p className="text-sm text-gray-500">Total Boost Spent</p>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(totalBoostSpent, wallet?.currency)}
            </p>
          </div>
          <TrendingUp className="text-blue-600" size={32} />
        </motion.div>

        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex justify-between items-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <p className="text-sm text-gray-500">Overall Total Spent</p>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(overallSpent, wallet?.currency)}
            </p>
          </div>
          <BarChart3 className="text-red-600" size={32} />
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-12">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            Performance Overview
          </h2>
          <BarChart3 className="text-blue-600" size={22} />
        </div>
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-12">
        <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Smartphone className="text-green-600" size={22} /> Your Virtual
          Numbers
        </h2>
        {numbers.length === 0 ? (
          <p className="text-gray-500 text-sm">No numbers purchased yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {numbers.map((num, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-800 break-words">
                  {num.number}
                </p>
                <p className="text-sm text-gray-500">Country: {num.country}</p>
                <p className="text-sm text-gray-500">Service: {num.service}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Boost Activities */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-12">
        <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={22} /> Boost Activities
        </h2>
        {boosts.length === 0 ? (
          <p className="text-gray-500 text-sm">
            You have not boosted any platform yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {boosts.map((b, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-800">{b.platform}</p>
                <p className="text-sm text-gray-500">Type: {b.type}</p>
                <p className="text-sm text-gray-500">Status: {b.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto w-full">
        <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <CreditCard className="text-purple-600" size={22} /> Recent
          Transactions
        </h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">Type</th>
                <th className="text-left py-2 px-4">Amount</th>
                <th className="text-left py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4 whitespace-nowrap">{tx.date}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{tx.type}</td>
                  <td className="py-2 px-4 text-green-600 font-medium whitespace-nowrap">
                    {formatCurrency(tx.amount, wallet?.currency)}
                  </td>
                  <td className="py-2 px-4 text-gray-500 whitespace-nowrap">
                    {tx.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
