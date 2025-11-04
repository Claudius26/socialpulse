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
      <p className="text-center mt-10 text-gray-600 text-sm sm:text-base">
        Loading dashboard...
      </p>
    );

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-600 text-sm sm:text-base">
        User not logged in
      </p>
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

  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-5 py-6 md:px-8 lg:px-10 w-full">
    
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10">
        <h1 className="text-xl mobile-h1 sm:text-3xl font-extrabold text-blue-900 drop-shadow-sm leading-tight">
          Welcome, {user.full_name}
        </h1>
      </div>

    
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 grid-tight sm:gap-6 mb-8 sm:mb-12">
        {[
          {
            title: "Wallet Balance",
            value: formatCurrency(wallet?.balance, wallet?.currency),
            icon: <Wallet size={26} className="icon-mobile opacity-90" />,
            bg: "bg-gradient-to-r from-blue-700 to-blue-500 text-white",
          },
          {
            title: "Boosts in Progress",
            value: boosts.length,
            icon: <Rocket className="text-blue-600 icon-mobile" />,
            bg: "bg-white border border-gray-200",
          },
          {
            title: "Numbers Purchased",
            value: numbers.length,
            icon: <Smartphone className="text-green-600 icon-mobile" />,
            bg: "bg-white border border-gray-200",
          },
          {
            title: "Total Deposited",
            value: formatCurrency(totalDeposited, wallet?.currency),
            icon: <DollarSign className="text-purple-600 icon-mobile" />,
            bg: "bg-white border border-gray-200",
          },
          {
            title: "Total Boost Spent",
            value: formatCurrency(totalBoostSpent, wallet?.currency),
            icon: <TrendingUp className="text-blue-600 icon-mobile" />,
            bg: "bg-white border border-gray-200",
          },
          {
            title: "Overall Total Spent",
            value: formatCurrency(overallSpent, wallet?.currency),
            icon: <BarChart3 className="text-red-600 icon-mobile" />,
            bg: "bg-white border border-gray-200",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className={`${card.bg} card-resp shadow-md flex justify-between items-center w-full`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div>
              <p className="text-mobile-xs sm:text-sm text-gray-600 font-medium">
                {card.title}
              </p>
              <p className="summary-value text-base sm:text-2xl font-bold mt-1 break-words text-gray-800">
                {card.value}
              </p>
            </div>
            {card.icon}
          </motion.div>
        ))}
      </div>

    
      <div className="bg-white card-resp shadow-md mb-8 sm:mb-12">
        <div className="flex justify-between items-center mb-3 sm:mb-5">
          <h2 className="font-bold text-mobile-sm sm:text-lg text-gray-800 flex items-center gap-2">
            Performance Overview
          </h2>
          <BarChart3 className="text-blue-600 icon-mobile" />
        </div>
        <div className="w-full chart-mobile">
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

    
      <div className="bg-white card-resp shadow-md mb-8 sm:mb-12">
        <h2 className="text-mobile-sm sm:text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Smartphone className="text-green-600 icon-mobile" /> Your Virtual Numbers
        </h2>
        {numbers.length === 0 ? (
          <p className="text-gray-500 text-mobile-xs sm:text-sm">
            No numbers purchased yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 grid-tight sm:gap-5 w-full">
            {numbers.map((num, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg sm:rounded-xl shadow-sm card-resp border border-gray-100 hover:shadow-md transition"
              >
                <p className="font-semibold text-mobile-sm sm:text-base text-gray-800 break-words">
                  {num.number}
                </p>
                <p className="text-mobile-xs sm:text-sm text-gray-500">
                  Country: {num.country}
                </p>
                <p className="text-mobile-xs sm:text-sm text-gray-500">
                  Service: {num.service}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

     
      <div className="bg-white card-resp shadow-md mb-8 sm:mb-12">
        <h2 className="text-mobile-sm sm:text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-blue-600 icon-mobile" /> Boost Activities
        </h2>
        {boosts.length === 0 ? (
          <p className="text-gray-500 text-mobile-xs sm:text-sm">
            You have not boosted any platform yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 grid-tight sm:gap-5 w-full">
            {boosts.map((b, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg sm:rounded-xl shadow-sm card-resp border border-gray-100 hover:shadow-md transition"
              >
                <p className="font-semibold text-mobile-sm sm:text-base text-gray-800">
                  {b.platform}
                </p>
                <p className="text-mobile-xs sm:text-sm text-gray-500">
                  Type: {b.type}
                </p>
                <p className="text-mobile-xs sm:text-sm text-gray-500">
                  Status: {b.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="bg-white card-resp shadow-md overflow-x-auto w-full">
        <h2 className="text-mobile-sm sm:text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <CreditCard className="text-purple-600 icon-mobile" /> Recent Transactions
        </h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-mobile-xs sm:text-sm">
            No transactions yet.
          </p>
        ) : (
          <table className="min-w-full table-compact text-mobile-xs sm:text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left py-2 px-2 sm:px-4">Date</th>
                <th className="text-left py-2 px-2 sm:px-4">Type</th>
                <th className="text-left py-2 px-2 sm:px-4">Amount</th>
                <th className="text-left py-2 px-2 sm:px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{tx.date}</td>
                  <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{tx.type}</td>
                  <td className="py-2 px-2 sm:px-4 text-green-600 font-medium whitespace-nowrap">
                    {formatCurrency(tx.amount, wallet?.currency)}
                  </td>
                  <td className="py-2 px-2 sm:px-4 text-gray-500 whitespace-nowrap">
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
