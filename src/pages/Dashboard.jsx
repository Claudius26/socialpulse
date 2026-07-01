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

  // Only show the spinner on a true cold start (no data at all). If we already
  // have user + summary (just logged in, or still in memory), render the
  // dashboard instantly — no "Loading…" flash — and refresh silently below.
  const [loading, setLoading] = useState(() => !(user && summary));

  // Only animate the stat cards on desktop. On mobile the slide-in reads like
  // the cards are "moving"/re-rendering, so we keep them static there.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      navigate("/login");
      return;
    }

    // If we already have the data — from login, or persisted in localStorage and
    // kept current by the cancel/SMS handlers — just show it. We deliberately do
    // NOT refetch /api/me on every mount, because that second response re-rendered
    // the cards right after login/refresh (the "renders twice" you saw).
    if (user && summary) {
      setLoading(false);
      return;
    }

    // Cold start with no data: fetch it once.
    dispatch(fetchUserProfile(token))
      .unwrap()
      .catch(() => {
        dispatch(logout());
        navigate("/login");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );

  if (!user || !summary)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
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
      icon: <Wallet size={22} className="text-white" />,
      featured: true,
      iconWrap: "bg-white/20",
    },
    {
      title: "Boost Requests",
      value: boostRequests,
      icon: <Rocket size={22} className="text-brand-600 dark:text-brand-400" />,
      iconWrap: "bg-brand-50 dark:bg-brand-950",
    },
    {
      title: "Numbers Purchased",
      value: numbersPurchased,
      icon: <Smartphone size={22} className="text-emerald-600 dark:text-emerald-400" />,
      iconWrap: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Total Deposited",
      value: formatCurrency(totalDeposited, wallet?.currency),
      icon: <DollarSign size={22} className="text-violet-600 dark:text-violet-400" />,
      iconWrap: "bg-violet-50 dark:bg-violet-950",
    },
    {
      title: "Total Spent on Boost",
      value: formatCurrency(totalBoostSpent, wallet?.currency),
      icon: <TrendingUp size={22} className="text-cyan-600 dark:text-cyan-400" />,
      iconWrap: "bg-cyan-50 dark:bg-cyan-950",
    },
    {
      title: "Overall Total Spending",
      value: formatCurrency(overallSpent, wallet?.currency),
      icon: <BarChart3 size={22} className="text-rose-600 dark:text-rose-400" />,
      iconWrap: "bg-rose-50 dark:bg-rose-950",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12">
        {/* Sticky welcome header — stays under the navbar while the stat cards
            scroll underneath. Solid background hides content passing behind it;
            -mx/px cancels container-app padding so it spans edge-to-edge. */}
        <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 mb-8 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <p className="eyebrow">Dashboard</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Welcome back,{" "}
            <span className="heading-gradient">{user.full_name}</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
            Here’s an overview of your account performance and activity
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {stats.map((card, i) => (
            <motion.div
              key={i}
              initial={isDesktop ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={isDesktop ? { delay: i * 0.05 } : { duration: 0 }}
              className={`card card-hover p-5 flex flex-col justify-between min-w-0 ${
                card.featured
                  ? "bg-gradient-to-br from-brand-600 to-violet-600 border-transparent text-white"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className={`text-sm font-medium truncate ${
                    card.featured
                      ? "text-white/80"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {card.title}
                </p>
                <span
                  className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.iconWrap}`}
                >
                  {card.icon}
                </span>
              </div>
              <p
                className={`text-2xl font-bold mt-3 break-words tabular-nums ${
                  card.featured ? "text-white" : "text-slate-900 dark:text-white"
                }`}
              >
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="card p-5 sm:p-7 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="eyebrow">Analytics</p>
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-1">
                Performance Overview
              </h2>
            </div>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950">
              <BarChart3 className="text-brand-600 dark:text-brand-400" size={20} />
            </span>
          </div>
          <div className="h-56 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} />
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
                <XAxis dataKey="day" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
