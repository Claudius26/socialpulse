import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { setUser, setError, selectAuthError } from "../features/auth/authSlice";

import socialImage from "../images/socialImage.jpg";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector(selectAuthError);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  const validate = () => {
    if (!formData.email.trim()) return "Please enter your email.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) return "Please enter a valid email.";
    if (!formData.password) return "Please enter your password.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(null));
    setLocalError(null);
    const clientErr = validate();
    if (clientErr) {
      setLocalError(clientErr);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        dispatch(setError(data.error || "Login failed"));
        return;
      }
      dispatch(setUser({ user: data.user, token: data.token }));
      navigate("/dashboard");
    } catch {
      setLoading(false);
      dispatch(setError("Network error. Please try again."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-white/80 text-blue-600 px-3 py-2 rounded-lg shadow backdrop-blur-sm hover:scale-105 transform transition"
      >
        Home
      </button>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-blue-600 text-white gap-4">
          <img src={socialImage} alt="Social Pulse" className="w-3/4 rounded-xl shadow-lg" />
          <div className="text-center">
            <h3 className="text-2xl font-bold">Welcome back!</h3>
            <p className="mt-2 text-blue-100/90">Sign in to manage your boosts, wallet and virtual numbers.</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 text-center md:text-left">Sign in to SocialPulse</h2>
          <p className="text-sm text-gray-500 mb-6 text-center md:text-left">Fast, secure access to your account</p>

          {(authError || localError) && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {localError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <div className="mt-1 relative">
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-4 pr-3 border border-gray-200 rounded-xl h-12 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-4 pr-12 border border-gray-200 rounded-xl h-12 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link to="/support" className="text-blue-600 hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white h-12 rounded-xl font-semibold transition transform active:scale-95 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
