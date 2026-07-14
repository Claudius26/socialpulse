import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import {
  adminLogin,
  clearAdminError,
  selectAdminAuth,
  selectAdminError,
  selectAdminLoading,
} from "../../features/auth/adminAuth/adminAuthSlice";
import Logo from "../../components/Logo";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const admin = useSelector(selectAdminAuth);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (admin?.access) navigate("/admin/dashboard");
  }, [admin, navigate]);

  useEffect(() => () => dispatch(clearAdminError()), [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="mb-6">
          <Logo size={40} className="mb-4" />
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-600 dark:text-brand-400 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">Admin Login</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">SocialPulse &amp; CardPulse control</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-slate-600 dark:text-slate-300">Username or email</label>
            <input
              type="text"
              name="username"
              autoCapitalize="none"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username or email"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-600 dark:text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-brand-500/40"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-violet-600 text-white rounded-xl py-3 font-semibold hover:opacity-95 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
