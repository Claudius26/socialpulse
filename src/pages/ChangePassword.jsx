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
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
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
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 flex justify-center items-center text-white">
      <div className="bg-blue-950/80 backdrop-blur-md w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-8 border border-blue-800">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent tracking-wide">
          Change Password
        </h1>

        <div className="space-y-6 relative">
          {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
            <div key={field} className="relative">
              <label className="block text-sm text-blue-200 mb-1 uppercase tracking-wide">
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
                className="w-full px-4 py-3 rounded-lg bg-blue-900/60 text-white border border-blue-700 focus:ring-4 focus:ring-blue-500/40 focus:outline-none transition-all duration-200"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
              >
                {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-200 hover:scale-105 ${
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
