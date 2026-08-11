import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { selectCurrentUser, selectAuthToken } from "../features/auth/authSlice";
import StarRating from "./StarRating";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";
const STORAGE_KEY = "sp_review_prompt";
const DISMISS_DAYS = 14;
const SHOW_DELAY_MS = 6000;

// Routes where the prompt must never appear. (These live outside <Layout/> so
// the component isn't even mounted there, but we guard anyway to be safe.)
const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/verify-email"];

function readState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

/**
 * OPTIONAL website-review nudge. Mounted ONCE in Layout. It is strictly
 * fire-and-forget: every network call is wrapped so a failure only closes the
 * card and warns to the console — it can never block navigation or the app.
 */
export default function ReviewPrompt() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  const onAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    // Reset any pending timer whenever the gating inputs change.
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }

    if (!user || onAuthRoute) return;

    const st = readState();
    if (st?.done) return;
    if (st?.dismissedAt && Date.now() - st.dismissedAt < DISMISS_DAYS * 864e5) return;

    let cancelled = false;
    // Never on the very first paint — wait a few seconds after landing.
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/reviews/me/`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return; // silent: a failed /me/ changes nothing
        const data = await res.json().catch(() => null);
        if (!cancelled && data && data.review == null) setOpen(true);
      } catch (err) {
        console.warn("ReviewPrompt: /me/ check failed", err);
      }
    }, SHOW_DELAY_MS);

    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
  }, [user, token, onAuthRoute, pathname]);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now() }));
    } catch { /* ignore */ }
  };

  const submit = async () => {
    if (!rating) return; // rating is required to submit; cancelling writes nothing
    setSubmitting(true);
    try {
      await fetch(`${BACKEND_BASE}/api/reviews/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
      });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ done: true })); } catch { /* ignore */ }
    } catch (err) {
      console.warn("ReviewPrompt: submit failed", err);
    } finally {
      setSubmitting(false);
      setOpen(false);
    }
  };

  // Esc closes (counts as dismiss).
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6"
            initial={{ scale: 0.95, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Your opinion</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enjoying SocialPulse?</h3>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tap a star to rate us — it only takes a second.
            </p>

            <div className="mt-4 flex justify-center">
              <StarRating value={rating} onChange={setRating} size={36} />
            </div>

            {rating > 0 && (
              <div className="mt-4">
                <label className="label">Anything you'd like to add? (optional)</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you think…"
                  className="input resize-none"
                />
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button type="button" onClick={dismiss} className="btn btn-md btn-ghost">
                Maybe later
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!rating || submitting}
                className="btn btn-md btn-primary"
              >
                {submitting ? "Sending…" : "Submit"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
