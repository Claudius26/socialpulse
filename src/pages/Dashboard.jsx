import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  logout,
  selectCurrentUser,
  selectAuthToken,
  selectAuthSummary,
  fetchUserProfile,
} from "../features/auth/authSlice";
import { motion } from "framer-motion";
import { availableBalance, heldBalance } from "../utils/wallet";
import {
  Wallet, Smartphone, BarChart3, Rocket, DollarSign, Plus,
  Phone, Globe, ShieldCheck, Receipt, ReceiptText, Gift, ArrowRight, Wifi, RefreshCw,
} from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const summary = useSelector(selectAuthSummary);
  const token = useSelector(selectAuthToken);

  const [loading, setLoading] = useState(() => !(user && summary));

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
    if (user && summary) {
      setLoading(false);
      return;
    }
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
  const overallSpent = summary.totals?.overall_spending ?? 0;
  const numbersPurchased = summary.counts?.numbers_purchased ?? 0;
  const boostRequests = summary.counts?.boost_requests ?? 0;

  const stats = [
    { title: "Numbers Purchased", value: numbersPurchased, icon: Smartphone, bg: "bg-emerald-50 dark:bg-emerald-950", fg: "text-emerald-600 dark:text-emerald-400" },
    { title: "Boost Requests", value: boostRequests, icon: Rocket, bg: "bg-brand-50 dark:bg-brand-950", fg: "text-brand-600 dark:text-brand-400" },
    { title: "Total Deposited", value: formatCurrency(totalDeposited, wallet?.currency), icon: DollarSign, bg: "bg-violet-50 dark:bg-violet-950", fg: "text-violet-600 dark:text-violet-400" },
    { title: "Total Spent", value: formatCurrency(overallSpent, wallet?.currency), icon: BarChart3, bg: "bg-rose-50 dark:bg-rose-950", fg: "text-rose-600 dark:text-rose-400" },
  ];

  // Quick actions. `to` = live route; `soon` = not yet integrated.
  const services = [
    { title: "USA Numbers", desc: "Instant OTP numbers", icon: Phone, bg: "bg-sky-50 dark:bg-sky-950", fg: "text-sky-600 dark:text-sky-400", to: "/usa_numbers" },
    { title: "All Countries", desc: "Numbers by country", icon: Globe, bg: "bg-indigo-50 dark:bg-indigo-950", fg: "text-indigo-600 dark:text-indigo-400", to: "/virtual_numbers" },
    { title: "Buy eSIM", desc: "Data for 190+ countries", icon: Wifi, bg: "bg-teal-50 dark:bg-teal-950", fg: "text-teal-600 dark:text-teal-400", to: "/esim" },
    { title: "Rent US Number", desc: "Hold a number for days", icon: RefreshCw, bg: "bg-indigo-50 dark:bg-indigo-950", fg: "text-indigo-600 dark:text-indigo-400", to: "/rent_number" },
    { title: "Fund Wallet", desc: "Add money instantly", icon: Wallet, bg: "bg-violet-50 dark:bg-violet-950", fg: "text-violet-600 dark:text-violet-400", to: "/deposits" },
    { title: "Boost Social", desc: "Grow your presence", icon: Rocket, bg: "bg-rose-50 dark:bg-rose-950", fg: "text-rose-600 dark:text-rose-400", to: "/boost" },
    { title: "Transactions", desc: "History & receipts", icon: ReceiptText, bg: "bg-emerald-50 dark:bg-emerald-950", fg: "text-emerald-600 dark:text-emerald-400", to: "/transactions" },
    { title: "VPN & Proxies", desc: "Fast, secure access", icon: ShieldCheck, bg: "bg-cyan-50 dark:bg-cyan-950", fg: "text-cyan-600 dark:text-cyan-400", soon: true },
    { title: "Pay Bills", desc: "Utilities & more", icon: Receipt, bg: "bg-amber-50 dark:bg-amber-950", fg: "text-amber-600 dark:text-amber-400", soon: true },
    { title: "Gift Cards", desc: "Buy & sell cards", icon: Gift, bg: "bg-pink-50 dark:bg-pink-950", fg: "text-pink-600 dark:text-pink-400", soon: true },
  ];

  const goSoon = (title) => toast.info(`${title} is coming soon.`);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-6 md:py-10">
        {/* ---- Welcome + Wallet (one card) ---- */}
        <div className="card overflow-hidden mb-6">
          <div className="grid md:grid-cols-2">
            <div className="p-5 sm:p-7">
              <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back,</p>
              <h1 className="text-2xl md:text-3xl font-bold heading-gradient mt-0.5 break-words">
                {user.full_name}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Here's an overview of your account and quick access to every service.
              </p>
              <button onClick={() => navigate("/transactions")} className="btn btn-sm btn-outline mt-4">
                <BarChart3 size={16} /> View Activity
              </button>
            </div>

            <div className="p-5 sm:p-7 bg-gradient-to-br from-brand-600 to-violet-600 text-white flex flex-col justify-center">
              <p className="text-sm text-white/80">Available Balance</p>
              <p className="text-3xl sm:text-4xl font-extrabold mt-1 tabular-nums break-words">
                {formatCurrency(availableBalance(wallet), wallet?.currency)}
              </p>
              {heldBalance(wallet) > 0 && (
                <p className="text-xs text-white/80 mt-1">
                  {formatCurrency(heldBalance(wallet), wallet?.currency)} held for pending orders
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => navigate("/deposits")} className="btn btn-md bg-white text-brand-700 hover:bg-brand-50 shadow-sm">
                  <Plus size={18} /> Add Funds
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Quick stats ---- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={isDesktop ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={isDesktop ? { delay: i * 0.05 } : { duration: 0 }}
                className="card p-4 flex items-center gap-3 min-w-0"
              >
                <span className={`shrink-0 grid place-items-center w-11 h-11 rounded-xl ${s.bg}`}>
                  <Icon size={20} className={s.fg} />
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">{s.value}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{s.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ---- Our Services (visible quick actions) ---- */}
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="eyebrow">Quick actions</p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">Our Services</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {services.map((s) => {
            const Icon = s.icon;
            const body = (
              <div className={`relative card card-hover h-full p-4 sm:p-5 text-left ${s.soon ? "opacity-95" : ""}`}>
                {s.soon && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wide bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 rounded-full px-2 py-0.5">
                    Soon
                  </span>
                )}
                <span className={`grid place-items-center w-11 h-11 rounded-xl ${s.bg}`}>
                  <Icon size={20} className={s.fg} />
                </span>
                <p className="mt-3 font-semibold text-sm text-slate-900 dark:text-white">{s.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{s.desc}</p>
                {!s.soon && (
                  <span className="mt-2 inline-flex text-brand-600 dark:text-brand-400">
                    <ArrowRight size={15} />
                  </span>
                )}
              </div>
            );
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => (s.soon ? goSoon(s.title) : navigate(s.to))}
                className={s.soon ? "cursor-default" : ""}
              >
                {body}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}