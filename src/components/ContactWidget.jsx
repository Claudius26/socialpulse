import { useState } from "react";
import { useSelector } from "react-redux";
import { MessageCircle, X, Send } from "lucide-react";
import { selectCurrentUser } from "../features/auth/authSlice";

const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";
// Admin WhatsApp in international format, digits only (no +, no spaces). Set VITE_SUPPORT_WHATSAPP.
const WHATSAPP = (import.meta.env.VITE_SUPPORT_WHATSAPP || "").replace(/\D/g, "");

/**
 * Floating "Contact" button (site-wide).
 *  • Logged-in users  → opens WhatsApp to chat with the admin.
 *  • Logged-out guests → opens a short form that emails support (/api/contact/).
 */
export default function ContactWidget() {
  const user = useSelector(selectCurrentUser);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "" | "sent" | error text

  const openWhatsApp = () => {
    const text = encodeURIComponent(`Hi SocialPulse, I'm ${user?.full_name || "a user"} and I need help with `);
    const url = WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noopener");
  };

  const toggle = () => (user ? openWhatsApp() : setOpen((o) => !o));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backendBase}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(data.error || "Could not send. Please try again.");
        return;
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!user && open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-600 to-violet-600 text-white">
            <p className="font-semibold text-sm">Contact us</p>
            <button onClick={() => setOpen(false)} aria-label="Close" type="button"><X size={18} /></button>
          </div>

          {status === "sent" ? (
            <div className="p-6 text-center">
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Message sent — we'll get back to you shortly. ✅
              </p>
              <button onClick={() => { setStatus(""); setOpen(false); }} className="btn btn-sm btn-outline mt-4" type="button">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="p-4 space-y-3">
              <input placeholder="Your name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              <input type="email" placeholder="Your email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
              <textarea rows={3} placeholder="How can we help?" value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" />
              {status && status !== "sent" && <p className="text-xs text-rose-600">{status}</p>}
              <button type="submit" disabled={loading} className="btn btn-md btn-primary w-full">
                {loading ? "Sending…" : (<>Send message <Send size={16} /></>)}
              </button>
            </form>
          )}
        </div>
      )}

      <button
        onClick={toggle}
        type="button"
        aria-label={user ? "Chat on WhatsApp" : "Contact us"}
        className={`fixed bottom-5 right-4 sm:right-6 z-50 inline-flex items-center gap-2 rounded-full text-white shadow-xl hover:shadow-2xl hover:opacity-95 transition px-4 py-3 ${
          user ? "bg-[#25D366]" : "bg-gradient-to-r from-brand-600 to-violet-600"
        }`}
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline text-sm font-semibold">
          {user ? "Chat on WhatsApp" : "Contact us"}
        </span>
      </button>
    </>
  );
}