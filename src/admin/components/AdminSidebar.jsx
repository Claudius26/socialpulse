import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Users, Wallet, Phone, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../features/auth/adminAuth/adminAuthSlice";

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-2">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white font-bold">
          SP
        </span>
        <div>
          <p className="font-bold text-slate-900 leading-tight">SocialPulse</p>
          <p className="text-xs text-slate-500">Admin panel</p>
        </div>
      </div>

      <nav className="space-y-1.5">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} /> Users
        </NavLink>
        <NavLink to="/admin/numbers" className={linkClass}>
          <Phone size={18} /> Numbers
        </NavLink>
        <NavLink to="/admin/deposits" className={linkClass}>
          <Wallet size={18} /> Deposits
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;
