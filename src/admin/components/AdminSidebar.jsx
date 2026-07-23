import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, Users, Wallet, Phone, LogOut, CreditCard,
  UserCircle, X, Flame, Banknote, BadgeDollarSign, Megaphone, Wifi, Timer, UserCog, Activity,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../features/auth/adminAuth/adminAuthSlice";
import { clearAdminDashboard } from "../adminDashboardSlice";
import { clearAdminData } from "../adminDataSlice";
import Logo from "../../components/Logo";

const SECTIONS = [
  {
    title: null,
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/trends", label: "Trends", icon: Flame },
      { to: "/admin/finance", label: "Finance", icon: Banknote },
      { to: "/admin/revenue", label: "Revenue", icon: BadgeDollarSign },
      { to: "/admin/admins", label: "Admins", icon: UserCog },
      { to: "/admin/api-health", label: "API Health", icon: Activity },
      { to: "/admin/users", label: "All Users", icon: Users, end: true },
    ],
  },
  {
    title: "SocialPulse",
    items: [
      { to: "/admin/users/socialpulse", label: "Users", icon: Users },
      { to: "/admin/numbers", label: "Numbers", icon: Phone },
      { to: "/admin/esims", label: "eSIMs", icon: Wifi },
      { to: "/admin/rentals", label: "Rentals", icon: Timer },
      { to: "/admin/deposits", label: "Deposits", icon: Wallet },
      { to: "/admin/ads", label: "Ads", icon: Megaphone },
    ],
  },
  {
    title: "CardPulse",
    items: [
      { to: "/admin/users/cardpulse", label: "Users", icon: Users },
      { to: "/admin/cardpulse", label: "Giftcards & Payouts", icon: CreditCard },
    ],
  },
  {
    title: "Account",
    items: [{ to: "/admin/profile", label: "Profile", icon: UserCircle }],
  },
];

function AdminSidebar({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(adminLogout());
    dispatch(clearAdminDashboard());
    // Don't leave one admin's cached data in the store for the next login.
    dispatch(clearAdminData());
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-full md:h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <Logo size={36} withText={false} />
          <div>
            <p className="font-bold text-slate-900 dark:text-white leading-tight">Admin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">SocialPulse · CardPulse</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-slate-500" aria-label="Close">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="space-y-4 flex-1">
        {SECTIONS.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={onClose}>
                  <item.icon size={18} /> {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;
