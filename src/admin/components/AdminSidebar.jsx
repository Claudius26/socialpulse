import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Users, Wallet, LogOut } from "lucide-react";
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
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <aside className="w-full md:w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Admin Panel</h2>

      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} />
          Users
        </NavLink>

        <NavLink to="/admin/deposits" className={linkClass}>
          <Wallet size={18} />
          Deposits
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default AdminSidebar;