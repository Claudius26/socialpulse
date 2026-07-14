import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  updateUserProfile,
  selectAuthToken,
} from "../features/auth/authSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import countryList from "react-select-country-list";
import { useNavigate } from "react-router";
import { Plus, KeyRound, LifeBuoy, Pencil, Gift, Copy, Ban, AlertTriangle, UserX, CircleCheck } from "lucide-react";
import { fetchUserProfile } from "../features/auth/authSlice";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);

  const [isEditing, setIsEditing] = useState(false);
  const [addingPhone, setAddingPhone] = useState(false);
  const [addingCountry, setAddingCountry] = useState(!user?.country);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });

  // Deactivate / reactivate. Both are password-confirmed server-side, so the
  // modal collects the password rather than just asking "are you sure?".
  // There is no self-delete — only an admin can delete an account.
  const [danger, setDanger] = useState(null); // "deactivate" | "reactivate" | null
  const [dangerPassword, setDangerPassword] = useState("");
  const [dangerBusy, setDangerBusy] = useState(false);
  const [dangerError, setDangerError] = useState("");

  const isDeactivated = !!user?.is_self_deactivated;

  const countries = countryList().getData();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeDanger = () => {
    if (dangerBusy) return;
    setDanger(null);
    setDangerPassword("");
    setDangerError("");
  };

  const submitDanger = async () => {
    if (!dangerPassword) {
      setDangerError("Please enter your password to confirm.");
      return;
    }
    setDangerBusy(true);
    setDangerError("");
    try {
      const path =
        danger === "reactivate" ? "/api/account/reactivate/" : "/api/account/deactivate/";
      const res = await fetch(`${BACKEND_BASE}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: dangerPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");

      toast.success(
        danger === "reactivate"
          ? "Your account has been reactivated."
          : "Your account has been deactivated. You can reactivate it any time."
      );
      // Stay signed in: deactivation doesn't lock you out, it only stops
      // purchases. Refresh the profile so the banner and buttons flip over.
      await dispatch(fetchUserProfile(token));
      closeDanger();
    } catch (err) {
      setDangerError(err.message);
    } finally {
      setDangerBusy(false);
    }
  };

  const copy = (text, label) => {
    navigator.clipboard?.writeText(text).then(
      () => toast.success(`${label} copied!`),
      () => toast.error("Couldn't copy — please copy manually."),
    );
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
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.message || "Failed to update profile. Please try again.");
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12">
        <div className="mb-6">
          <p className="eyebrow">Account</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal details and account settings.
          </p>
        </div>

        {user?.is_blocked && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 text-amber-800 dark:text-amber-300">
            <Ban size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Your account is blocked</p>
              <p className="text-sm mt-0.5">
                You can still log in and fund your wallet, but purchases are disabled.
                Only an administrator can lift this — please{" "}
                <a href="/support" className="underline font-medium">contact support</a>.
              </p>
            </div>
          </div>
        )}

        {isDeactivated && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 p-4 text-slate-800 dark:text-slate-200">
            <UserX size={20} className="shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Your account is deactivated</p>
              <p className="text-sm mt-0.5">
                You can still sign in and fund your wallet, but you can't purchase anything
                until you reactivate.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDanger("reactivate")}
              className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700 shrink-0"
            >
              <CircleCheck size={16} /> Reactivate
            </button>
          </div>
        )}

        <div className="card overflow-hidden flex flex-col md:grid md:grid-cols-3">
          {/* Brand sidebar */}
          <div className="relative p-6 md:col-span-1 bg-gradient-to-b from-brand-600 to-violet-600 text-white flex flex-col items-center gap-4 sm:gap-6 overflow-hidden">
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/15 ring-2 ring-white/20 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-md">
              {(user?.full_name || "U").charAt(0)}
            </div>
            <h3 className="relative text-base sm:text-lg font-semibold text-center">
              {user?.full_name || "User"}
            </h3>
            <p className="relative text-xs sm:text-sm text-brand-100/90 break-all text-center">
              {user?.email}
            </p>
            <div className="relative mt-2 w-full flex flex-col gap-2 sm:gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-md w-full bg-white text-brand-700 hover:bg-brand-50"
              >
                <Pencil size={16} /> Edit Profile
              </button>
              <a
                href="/change-password"
                className="btn btn-md w-full bg-white/15 text-white hover:bg-white/25 border border-white/20"
              >
                <KeyRound size={16} /> Change Password
              </a>
              <a
                href="/support"
                className="btn btn-md w-full bg-white/15 text-white hover:bg-white/25 border border-white/20"
              >
                <LifeBuoy size={16} /> Contact Support
              </a>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 sm:p-8 md:col-span-2 bg-white dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Personal details
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm btn-primary"
                >
                  <Pencil size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    disabled={saving}
                    onClick={handleSave}
                    className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-sm btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Keep your information up to date for a smoother experience.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full name</label>
                {isEditing ? (
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100">
                    {formData.full_name}
                  </div>
                )}
              </div>

              <div>
                <label className="label">Username</label>
                {isEditing ? (
                  <>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      autoCapitalize="none"
                      placeholder="Choose a username"
                      className="input"
                    />
                    <p className="mt-1 text-xs text-slate-400">Used to log in. Letters, numbers, and . _ - only.</p>
                  </>
                ) : (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 break-all">
                    {formData.username || <span className="text-slate-400">Not set</span>}
                  </div>
                )}
              </div>

              <div>
                <label className="label">Email</label>
                {isEditing ? (
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 break-all">
                    {formData.email}
                  </div>
                )}
              </div>

              <div>
                <label className="label">Phone</label>
                {user?.phone ? (
                  isEditing ? (
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  ) : (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100">
                      {formData.phone}
                    </div>
                  )
                ) : !addingPhone ? (
                  <button
                    onClick={() => setAddingPhone(true)}
                    className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-medium text-sm hover:underline"
                  >
                    <Plus size={16} /> Add Number
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="input"
                    />
                    <button
                      disabled={saving}
                      onClick={handleAddPhone}
                      className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-500 shrink-0"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Country</label>
                {user?.country ? (
                  isEditing ? (
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="input"
                    >
                      {countries.map((c) => (
                        <option key={c.value} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100">
                      {formData.country}
                    </div>
                  )
                ) : addingCountry ? (
                  <div className="flex gap-2 items-center">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="input"
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
                      className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-500 shrink-0"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingCountry(true)}
                    className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-medium text-sm hover:underline"
                  >
                    <Plus size={16} /> Add Country
                  </button>
                )}
              </div>

              <div>
                <label className="label">Member since</label>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100">
                  {new Date(user?.date_joined || Date.now()).toLocaleDateString()}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Refer & Earn */}
        <div className="card mt-6 p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Gift size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Refer &amp; Earn</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Share your code. When a friend signs up with it and verifies their email, you get a{" "}
                <strong>one-time ₦500</strong> bonus (in your wallet currency).
                {user?.referral_bonus_claimed && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium"> — bonus already claimed ✅</span>
                )}
              </p>

              {user?.referral_code ? (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5">
                    <span className="font-mono font-bold tracking-wider text-slate-900 dark:text-white break-all">{user.referral_code}</span>
                    <button type="button" onClick={() => copy(user.referral_code, "Code")} className="ml-3 text-brand-600 dark:text-brand-400 hover:opacity-80 shrink-0" title="Copy code">
                      <Copy size={18} />
                    </button>
                  </div>
                  <button type="button" onClick={() => copy(`${window.location.origin}/register?ref=${user.referral_code}`, "Invite link")} className="btn btn-md btn-primary shrink-0">
                    <Copy size={16} /> Copy invite link
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">Your referral code will appear here shortly.</p>
              )}
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card mt-6 p-5 sm:p-7 border-rose-200 dark:border-rose-900/60">
          <div className="flex items-start gap-3">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account status</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {isDeactivated
                  ? "Your account is deactivated. Reactivate it to start buying again — you'll be asked for your password."
                  : "Deactivating pauses your account: you can still sign in and add funds, but you can't buy anything until you reactivate. You'll be asked for your password."}
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 p-4 max-w-md">
                {isDeactivated ? (
                  <>
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <CircleCheck size={16} /> Reactivate account
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Restores full access. Your balance and history are untouched.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDanger("reactivate")}
                      className="btn btn-sm mt-3 w-full bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Reactivate my account
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <UserX size={16} /> Deactivate account
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Pauses purchases. You keep your balance and history, stay signed in, and can
                      reactivate yourself at any time.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDanger("deactivate")}
                      className="btn btn-sm mt-3 w-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Deactivate my account
                    </button>
                  </>
                )}
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Need your account permanently removed?{" "}
                <a href="/support" className="underline">Contact support</a> — only an
                administrator can delete an account.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password-confirm modal for the danger-zone actions */}
      {danger && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeDanger}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {danger === "reactivate" ? "Reactivate your account?" : "Deactivate your account?"}
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {danger === "reactivate" ? (
                <>You'll be able to buy services again straight away.</>
              ) : (
                <>
                  You'll stay signed in and can still add funds, but you{" "}
                  <strong>won't be able to buy anything</strong> until you reactivate.
                  Nothing is deleted — your balance and history are kept, and you can
                  reactivate yourself at any time.
                </>
              )}
            </p>

            <label className="block mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
              Confirm your password
            </label>
            <input
              type="password"
              autoFocus
              value={dangerPassword}
              onChange={(e) => setDangerPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitDanger()}
              className="input mt-1 w-full"
              placeholder="Your password"
            />

            {dangerError && <p className="mt-2 text-sm text-rose-600">{dangerError}</p>}

            <div className="mt-5 flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeDanger}
                disabled={dangerBusy}
                className="btn btn-md btn-ghost"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitDanger}
                disabled={dangerBusy}
                className={`btn btn-md text-white ${
                  danger === "reactivate"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-slate-700 hover:bg-slate-800"
                }`}
              >
                {dangerBusy ? "Working…" : danger === "reactivate" ? "Reactivate" : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
