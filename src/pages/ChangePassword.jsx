import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectAuthToken,
  updateUserProfile,
} from "../features/auth/authSlice";
import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex justify-center items-center px-4 py-12">
      <div className="container-app max-w-md">
        <div className="card p-6 sm:p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-600/20">
              <KeyRound size={26} />
            </div>
            <p className="eyebrow">Account security</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Change Password
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Keep your account safe with a strong, unique password.
            </p>
          </div>

          <div className="space-y-5">
            {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
              <div key={field}>
                <label className="label">
                  {field === "oldPassword"
                    ? "Old Password"
                    : field === "newPassword"
                    ? "New Password"
                    : "Confirm Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword[field] ? "text" : "password"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="input pr-12"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  >
                    {showPassword[field] ? (
                      <EyeOff size={20} strokeWidth={1.5} />
                    ) : (
                      <Eye size={20} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-lg btn-primary w-full"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
