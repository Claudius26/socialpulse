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

  const backendBase =
    import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendBase}/api/user/dashboard/`, {
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
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-sm sm:text-base animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-sm sm:text-base">
          User not logged in
        </p>
      </div>
    );

  const totalBoostSpent = boosts.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalNumberSpent = numbers.reduce((sum, n) => sum + (n.price || 0), 0);
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

  const stats = [
    {
      title: "Wallet Balance",
      value: formatCurrency(wallet?.balance, wallet?.currency),
      icon: <Wallet size={28} className="text-white" />,
      bg: "from-blue-600 to-indigo-500 text-white",
    },
    {
      title: "Boosts in Progress",
      value: boosts.length,
      icon: <Rocket size={28} className="text-blue-600" />,
      bg: "from-white to-gray-50 border border-gray-100 text-gray-700",
    },
    {
      title: "Numbers Purchased",
      value: numbers.length,
      icon: <Smartphone size={28} className="text-green-600" />,
      bg: "from-white to-gray-50 border border-gray-100 text-gray-700",
    },
    {
      title: "Total Deposited",
      value: formatCurrency(totalDeposited, wallet?.currency),
      icon: <DollarSign size={28} className="text-purple-600" />,
      bg: "from-white to-gray-50 border border-gray-100 text-gray-700",
    },
    {
      title: "Total Boost Spent",
      value: formatCurrency(totalBoostSpent, wallet?.currency),
      icon: <TrendingUp size={28} className="text-blue-600" />,
      bg: "from-white to-gray-50 border border-gray-100 text-gray-700",
    },
    {
      title: "Overall Total Spent",
      value: formatCurrency(overallSpent, wallet?.currency),
      icon: <BarChart3 size={28} className="text-red-600" />,
      bg: "from-white to-gray-50 border border-gray-100 text-gray-700",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 px-3 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
          Welcome back, <span className="text-blue-700">{user.full_name}</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Here’s an overview of your account performance and activity
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-10">
        {stats.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl p-4 sm:p-5 shadow-sm bg-gradient-to-br ${card.bg} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-semibold">{card.title}</p>
              {card.icon}
            </div>
            <p className="text-lg sm:text-2xl font-bold mt-2">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-7 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base sm:text-lg text-gray-800">
            Performance Overview
          </h2>
          <BarChart3 className="text-blue-600" />
        </div>
        <div className="h-56 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
              <XAxis dataKey="day" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-7">
          <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Smartphone className="text-green-600" /> Your Virtual Numbers
          </h2>
          {numbers.length === 0 ? (
            <p className="text-gray-500 text-sm">No numbers purchased yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {numbers.map((num, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <p className="font-semibold text-gray-800">{num.number}</p>
                  <p className="text-sm text-gray-500">Country: {num.country}</p>
                  <p className="text-sm text-gray-500">Service: {num.service}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-7">
          <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Boost Activities
          </h2>
          {boosts.length === 0 ? (
            <p className="text-gray-500 text-sm">
              You have not boosted any platform yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boosts.map((b, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <p className="font-semibold text-gray-800">{b.platform}</p>
                  <p className="text-sm text-gray-500">Type: {b.type}</p>
                  <p className="text-sm text-gray-500">Status: {b.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-7 overflow-x-auto">
        <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <CreditCard className="text-purple-600" /> Recent Transactions
        </h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet.</p>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">Type</th>
                <th className="text-left py-2 px-3">Amount</th>
                <th className="text-left py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3 whitespace-nowrap text-gray-700">
                    {tx.date}
                  </td>
                  <td className="py-2 px-3 text-gray-700">{tx.type}</td>
                  <td className="py-2 px-3 text-green-600 font-medium">
                    {formatCurrency(tx.amount, wallet?.currency)}
                  </td>
                  <td className="py-2 px-3 text-gray-500">{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
