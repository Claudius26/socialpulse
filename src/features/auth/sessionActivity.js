// Session idle tracking for the customer website.
//
// The backend ends a customer's web session after WEB_SESSION_IDLE_MINUTES
// (default 30) without a token refresh. This module makes the site behave to
// match:
//   • real user activity (click, key, scroll, touch) is recorded, and the
//     session is refreshed at most every REFRESH_EVERY_MS while active, so an
//     active user is never logged out;
//   • a page that is merely OPEN (no interaction) does not extend the session —
//     the 2-minute online heartbeat doesn't count as activity;
//   • on a new visit (or returning to a tab) after the idle window, the user is
//     signed out straight away instead of the site briefly checking the cookie
//     and logging them back in.
//
// Timestamps live in localStorage so every open tab shares one notion of
// "last active" and one refresh schedule.

const IDLE_MINUTES = Number(import.meta.env.VITE_SESSION_IDLE_MINUTES) || 30;
export const IDLE_MS = IDLE_MINUTES * 60 * 1000;
const REFRESH_EVERY_MS = 5 * 60 * 1000;   // well inside the idle window
const WRITE_THROTTLE_MS = 15 * 1000;

const LAST_ACTIVE_KEY = "sp_last_active";
const LAST_REFRESH_KEY = "sp_last_refresh";

const read = (key) => {
  try { return Number(localStorage.getItem(key)) || 0; } catch { return 0; }
};
const write = (key, value) => {
  try { localStorage.setItem(key, String(value)); } catch { /* storage blocked */ }
};

export const markActive = () => write(LAST_ACTIVE_KEY, Date.now());
export const markRefreshed = () => write(LAST_REFRESH_KEY, Date.now());

export const clearSessionActivity = () => {
  try {
    localStorage.removeItem(LAST_ACTIVE_KEY);
    localStorage.removeItem(LAST_REFRESH_KEY);
  } catch { /* storage blocked */ }
};

// True when the last recorded activity is older than the idle window. A missing
// timestamp (older build, cleared storage) counts as idle, so a stale session
// is never revived silently.
export const isIdleExpired = () => {
  const last = read(LAST_ACTIVE_KEY);
  return !last || Date.now() - last > IDLE_MS;
};

export const refreshDue = () => Date.now() - read(LAST_REFRESH_KEY) > REFRESH_EVERY_MS;

/**
 * Watch for user activity. Calls `onActive()` (throttled) while the user is
 * interacting, and `onIdleReturn()` when they come back (interaction or tab
 * focus) after the idle window has passed. Returns a cleanup function.
 */
export function watchActivity({ onActive, onIdleReturn }) {
  let lastWrite = 0;

  const handle = () => {
    if (isIdleExpired()) {
      onIdleReturn();
      return;
    }
    const now = Date.now();
    if (now - lastWrite < WRITE_THROTTLE_MS) return;
    lastWrite = now;
    markActive();
    onActive();
  };

  const onVisible = () => {
    if (document.visibilityState === "visible") handle();
  };

  const events = ["pointerdown", "keydown", "scroll", "touchstart", "wheel"];
  events.forEach((e) => window.addEventListener(e, handle, { passive: true }));
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("focus", onVisible);

  return () => {
    events.forEach((e) => window.removeEventListener(e, handle));
    document.removeEventListener("visibilitychange", onVisible);
    window.removeEventListener("focus", onVisible);
  };
}
