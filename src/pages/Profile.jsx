import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, updateUserProfile, selectAuthToken } from "../features/auth/authSlice";
import { useState } from "react";
import { toast } from "react-toastify";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.full_name.trim() || !formData.email.trim()) {
      toast.error("Full name and email are required.");
      return;
    }

    setSaving(true);
    try {
      await dispatch(updateUserProfile({ token, userData: formData })).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3">
          {/* Sidebar */}
          <div className="p-6 md:col-span-1 bg-gradient-to-b from-blue-600 to-indigo-600 text-white flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold shadow-md">
              {(user?.full_name || "U").charAt(0)}
            </div>
            <h3 className="text-lg font-semibold">{user?.full_name || "User"}</h3>
            <p className="text-sm opacity-90">{user?.email}</p>

            <div className="mt-4 w-full flex flex-col gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-white text-blue-700 px-4 py-2 rounded-full font-semibold hover:scale-[1.01] transition"
              >
                Edit Profile
              </button>
              <a
                href="/change-password"
                className="w-full text-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-white hover:bg-white/20 transition"
              >
                Change Password
              </a>
              <a
                href="/support"
                className="w-full text-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-white hover:bg-white/20 transition"
              >
                Contact Support
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    disabled={saving}
                    onClick={handleSave}
                    className="text-sm bg-green-600 text-white px-3 py-2 rounded-md"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-sm bg-gray-200 px-3 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Manage your personal details and account settings.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full name</label>
                {isEditing ? (
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-md">{formData.full_name}</div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                {isEditing ? (
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-md">{formData.email}</div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-md">{formData.phone || "Not provided"}</div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Member since</label>
                <div className="px-4 py-2 bg-gray-50 rounded-md">
                  {new Date(user?.date_joined || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
