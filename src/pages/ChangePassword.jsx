import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectAuthToken,
  updateUserProfile,
} from "../features/auth/authSlice";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

function ChangePassword() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSave = async () => {
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("All password fields are required.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        updateUserProfile({
          token,
          userData: {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          },
        })
      ).unwrap();

      toast.success("Password updated successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-950 to-black flex justify-center items-center text-white px-4 sm:px-0">
      <div className="bg-gradient-to-b from-blue-950/90 to-blue-900/70 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-[0_0_30px_rgba(30,64,175,0.5)] border border-blue-800/50 p-6 sm:p-10 space-y-8 transition-all duration-300">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent tracking-wider drop-shadow-md">
          Change Password
        </h1>

        <div className="space-y-5 sm:space-y-6 relative">
          {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
            <div key={field} className="relative">
              <label className="block text-xs sm:text-sm text-blue-200 mb-2 uppercase tracking-wide">
                {field === "oldPassword"
                  ? "Old Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm Password"}
              </label>
              <input
                type={showPassword[field] ? "text" : "password"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-3 rounded-lg bg-blue-950/50 text-white border border-blue-700/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all duration-300 placeholder-blue-200/50 text-sm sm:text-base"
                placeholder={`Enter ${
                  field === "oldPassword"
                    ? "old"
                    : field === "newPassword"
                    ? "new"
                    : "confirm"
                } password`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition"
              >
                {showPassword[field] ? (
                  <EyeOff size={20} strokeWidth={1.5} />
                ) : (
                  <Eye size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 w-full sm:w-auto px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
