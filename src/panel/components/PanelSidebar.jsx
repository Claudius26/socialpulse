import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Users, Megaphone, LogOut, X, Radio, Activity } from "lucide-react";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../features/auth/adminAuth/adminAuthSlice";
import { clearAdminData } from "../../admin/adminDataSlice";

const ITEMS = [
  { to: "/panel/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/panel/users", label: "My Users", icon: Users },
  { to: "/panel/ads", label: "Post Ads", icon: Megaphone },
  { to: "/panel/api-health", label: "API Health", icon: Activity },
];

export default function PanelSidebar({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(adminLogout());
    dispatch(clearAdminData());
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
    }`;

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-[#0d1c17] border-r border-emerald-100 dark:border-emerald-900/40 min-h-full md:h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow">
            <Radio size={20} />
          </span>
          <div>
            <p className="font-bold text-slate-900 dark:text-white leading-tight">Admin Console</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Referral partner</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-slate-500" aria-label="Close">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="space-y-1.5 flex-1">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass} onClick={onClose}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
      >
        <LogOut size={18} /> Log out
      </button>
    </aside>
  );
}
