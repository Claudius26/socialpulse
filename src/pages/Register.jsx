import { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import {
  setUser,
  setError as setAuthError,
  selectAuthError,
} from "../features/auth/authSlice";

import socialImage from "../images/socialImage.jpg";

const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

function Register() {
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const clearMessages = () => {
    dispatch(setAuthError(null));
    setSuccessMessage("");
    setLocalError(null);
  };

  const validate = () => {
    if (!formData.full_name.trim()) return "Please enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      return "Please enter a valid email.";
    if (!formData.phone.trim()) return "Please enter your phone number.";
    if (!formData.country) return "Please enter your date of birth.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (formData.password !== formData.password2)
      return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const clientErr = validate();
    if (clientErr) {
      setLocalError(clientErr);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${backendBase}/api/register/manual/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          country: formData.country,
          password: formData.password,
          password2: formData.password2,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        const firstError =
          data?.password?.[0] ||
          data?.email?.[0] ||
          data?.phone?.[0] ||
          data?.error ||
          "Registration failed. Please check your input.";
        dispatch(setAuthError(firstError));
        return;
      }
      dispatch(setUser({ user: data.user, token: data.token }));
      localStorage.setItem("access_token", data.token);
      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      setLoading(false);
      dispatch(setAuthError("Network error. Please try again later."));
    }
  };

 const handleGoogleSuccess = async (credentialResponse) => {
  clearMessages();
  setLoading(true);
  try {
    const decoded = jwt_decode(credentialResponse.credential);

    const response = await fetch(`${backendBase}/api/register/google/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: decoded.name,
        email: decoded.email,
        google_id: decoded.sub,
      }),
    });

    const data = await response.json();
    setLoading(false);
    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (
      data?.error?.toLowerCase().includes("already exists") ||
      response.status === 400
    ) {
      dispatch(
        setAuthError(
          "User with this email already exists. Please login to continue."
        )
      );
      return;
    }

    if (data?.require_phone) {
      dispatch(setAuthError("Phone number required to complete registration."));
      return;
    }

    if (response.ok && data?.token && data?.user) {
      dispatch(setUser({ user: data.user, token: data.token }));
      localStorage.setItem("access_token", data.token);
      setSuccessMessage("Google registration successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
      return;
    }

    dispatch(
      setAuthError(
        data?.error || "Google registration failed. Please try again."
      )
    );
  } catch (err) {
    setLoading(false);
    console.error(err);
    dispatch(setAuthError("Google sign-in failed. Try again."));
  }
};


  const handleGoogleError = () => {
    dispatch(setAuthError("Google sign-in was cancelled or failed."));
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 py-10">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center p-8 bg-blue-600 text-white gap-4">
            <img
              src={socialImage}
              alt="Join SocialPulse"
              className="w-2/3 md:w-3/4 rounded-lg shadow-md"
            />
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold">Create an account</h3>
              <p className="mt-2 text-blue-100/90 text-sm md:text-base">
                Join SocialPulse to manage boosts, wallet and virtual numbers.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transform transition text-sm md:text-base"
            >
              Visit Landing
            </button>
          </div>

          <div className="p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1 text-center md:text-left">
              Create your SocialPulse account
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
              Fast, secure sign up — or continue with Google
            </p>

            {(authError || successMessage || localError) && (
              <div
                role="alert"
                className={`mb-4 p-3 rounded-lg text-sm ${
                  authError
                    ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-green-50 border border-green-200 text-green-700"
                }`}
              >
                {localError || authError || successMessage}
              </div>
            )}

            <div className="flex justify-center mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or register manually
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={(e) =>
                    setFormData({ ...formData, password2: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white h-12 rounded-xl font-semibold transition transform active:scale-95 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Registering..." : "Create account"}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/")}
                className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:shadow-md transition"
              >
                Back to Landing
              </button>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Register;
