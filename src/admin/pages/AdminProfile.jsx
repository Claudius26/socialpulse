import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import {
  getAdminProfile, updateAdminProfile, changeAdminPassword,
} from "../api/adminApi";

function PasswordInput({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block mb-1 text-sm text-slate-600 dark:text-slate-300">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 pr-11 outline-none focus:ring-2 focus:ring-brand-500/40"
        />
        <button type="button" onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 text-sm text-slate-600 dark:text-slate-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        autoCapitalize="none"
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40"
      />
    </div>
  );
}

function Note({ msg }) {
  if (!msg?.text) return null;
  const tone = msg.ok
    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300"
    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300";
  return <div className={`mb-4 border rounded-lg p-3 text-sm ${tone}`}>{msg.text}</div>;
}

const Card = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
    <h2 className="font-semibold text-slate-900 dark:text-white mb-4">{title}</h2>
    {children}
  </div>
);

const Button = ({ children, onClick, busy }) => (
  <button onClick={onClick} disabled={busy}
    className="mt-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 transition disabled:opacity-50">
    {busy ? "Saving…" : children}
  </button>
);

export default function AdminProfile() {
  const token = useSelector(selectAdminToken);
  const [profile, setProfile] = useState({ username: "", email: "", full_name: "" });
  const [pw, setPw] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [pMsg, setPMsg] = useState({});
  const [pwMsg, setPwMsg] = useState({});
  const [busy, setBusy] = useState("");

  useEffect(() => {
    if (!token) return;
    getAdminProfile(token)
      .then((d) => setProfile({ username: d.username || "", email: d.email || "", full_name: d.full_name || "" }))
      .catch((e) => setPMsg({ text: e.message }));
  }, [token]);

  const saveProfile = async () => {
    setBusy("profile"); setPMsg({});
    try {
      await updateAdminProfile(token, profile);
      setPMsg({ ok: true, text: "Profile updated." });
    } catch (e) { setPMsg({ text: e.message }); } finally { setBusy(""); }
  };

  const savePassword = async () => {
    setBusy("pw"); setPwMsg({});
    if (pw.new_password !== pw.confirm_password) { setBusy(""); return setPwMsg({ text: "New passwords do not match." }); }
    try {
      await changeAdminPassword(token, pw);
      setPwMsg({ ok: true, text: "Password changed." });
      setPw({ current_password: "", new_password: "", confirm_password: "" });
    } catch (e) { setPwMsg({ text: e.message }); } finally { setBusy(""); }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">Profile</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your admin account</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Account details">
          <Note msg={pMsg} />
          <div className="space-y-4">
            <Field label="Full name" value={profile.full_name}
                   onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
            <Field label="Username" value={profile.username}
                   onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
            <Field label="Email" type="email" value={profile.email}
                   onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            <Button onClick={saveProfile} busy={busy === "profile"}>Save changes</Button>
          </div>
        </Card>

        <Card title="Change password">
          <Note msg={pwMsg} />
          <div className="space-y-4">
            <PasswordInput label="Current password" value={pw.current_password}
              onChange={(e) => setPw({ ...pw, current_password: e.target.value })} />
            <PasswordInput label="New password" value={pw.new_password}
              onChange={(e) => setPw({ ...pw, new_password: e.target.value })} />
            <PasswordInput label="Confirm new password" value={pw.confirm_password}
              onChange={(e) => setPw({ ...pw, confirm_password: e.target.value })} />
            <Button onClick={savePassword} busy={busy === "pw"}>Update password</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
