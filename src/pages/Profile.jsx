import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  updateUserProfile,
  selectAuthToken,
} from "../features/auth/authSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import countryList from "react-select-country-list";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);

  const [isEditing, setIsEditing] = useState(false);
  const [addingPhone, setAddingPhone] = useState(false);
  const [addingCountry, setAddingCountry] = useState(!user?.country);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });

  const countries = countryList().getData();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.full_name.trim() || !formData.email.trim()) {
      toast.error("Full name and email are required.");
      return;
    }
    if (addingCountry && !formData.country.trim()) {
      toast.error("Please select a country.");
      return;
    }

    setSaving(true);
    try {
      await dispatch(updateUserProfile({ token, userData: formData })).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setAddingPhone(false);
      setAddingCountry(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhone = async () => {
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    setSaving(true);
    try {
      await dispatch(updateUserProfile({ token, userData: { phone: formData.phone } })).unwrap();
      toast.success("Phone number added successfully!");
      setAddingPhone(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add phone number. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-8 px-3 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:grid md:grid-cols-3">
          <div className="p-6 md:col-span-1 bg-gradient-to-b from-blue-600 to-indigo-600 text-white flex flex-col items-center gap-4 sm:gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-md">
              {(user?.full_name || "U").charAt(0)}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-center">
              {user?.full_name || "User"}
            </h3>
            <p className="text-xs sm:text-sm opacity-90 break-all text-center">
              {user?.email}
            </p>
            <div className="mt-4 w-full flex flex-col gap-2 sm:gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-white text-blue-700 px-4 py-2 rounded-full text-sm sm:text-base font-semibold hover:scale-[1.01] transition"
              >
                Edit Profile
              </button>
              <a
                href="/change-password"
                className="w-full text-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm sm:text-base text-white hover:bg-white/20 transition"
              >
                Change Password
              </a>
              <a
                href="/support"
                className="w-full text-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm sm:text-base text-white hover:bg-white/20 transition"
              >
                Contact Support
              </a>
            </div>
          </div>

          <div className="p-5 sm:p-6 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                My Profile
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs sm:text-sm bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    disabled={saving}
                    onClick={handleSave}
                    className="text-xs sm:text-sm bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs sm:text-sm bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage your personal details and account settings.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">
                  Full name
                </label>
                {isEditing ? (
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {formData.full_name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm break-all">
                    {formData.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">
                  Phone
                </label>
                {user?.phone ? (
                  isEditing ? (
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                      {formData.phone}
                    </div>
                  )
                ) : !addingPhone ? (
                  <button
                    onClick={() => setAddingPhone(true)}
                    className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:underline"
                  >
                    <span className="text-lg font-bold">+</span> Add Number
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      disabled={saving}
                      onClick={handleAddPhone}
                      className="text-xs sm:text-sm bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">
                  Country
                </label>
                {user?.country ? (
                  isEditing ? (
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {countries.map((c) => (
                        <option key={c.value} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                      {formData.country}
                    </div>
                  )
                ) : addingCountry ? (
                  <div className="flex gap-2 items-center">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select country</option>
                      {countries.map((c) => (
                        <option key={c.value} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <button
                      disabled={saving}
                      onClick={handleSave}
                      className="text-xs sm:text-sm bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingCountry(true)}
                    className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:underline"
                  >
                    <span className="text-lg font-bold">+</span> Add Country
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">
                  Member since
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
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
