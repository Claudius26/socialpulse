import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  logout,
  selectCurrentUser,
  selectAuthToken,
  selectAuthSummary,
  fetchUserProfile,
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
  const summary = useSelector(selectAuthSummary);
  const token = useSelector(selectAuthToken);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      navigate("/login");
      return;
    }

    // If we already have user + summary in redux, no need to call backend.
    if (user && summary) {
      setLoading(false);
      return;
    }

    // Otherwise refresh state from /api/me
    dispatch(fetchUserProfile(token))
      .unwrap()
      .catch(() => {
        dispatch(logout());
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [token, user, summary, dispatch, navigate]);

  const wallet = user?.wallet;

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

  if (!user || !summary)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-sm sm:text-base">
          Dashboard data not available.
        </p>
      </div>
    );

  const totalDeposited = summary.totals?.deposited ?? 0;
  const totalNumberSpent = summary.totals?.spent_on_numbers ?? 0;
  const totalBoostSpent = summary.totals?.spent_on_boost ?? 0;
  const overallSpent = summary.totals?.overall_spending ?? 0;

  const numbersPurchased = summary.counts?.numbers_purchased ?? 0;

  const boostRequests = summary.counts?.boost_requests ?? 0;

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
      title: "Boost Requests",
      value: boostRequests,
      icon: <Rocket size={28} className="text-blue-600" />,
      bg: "from-white to-gray-50 border border-gray-100 text-gray-700",
    },
    {
      title: "Numbers Purchased",
      value: numbersPurchased,
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
      title: "Total Spent on Boost",
      value: formatCurrency(totalBoostSpent, wallet?.currency),
      icon: <TrendingUp size={28} className="text-blue-600" />,
      bg: "from-white to-gray-50 border border-gray-100 text-gray-700",
    },
    {
      title: "Overall Total Spending",
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
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
              <XAxis dataKey="day" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
