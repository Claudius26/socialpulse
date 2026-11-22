import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthToken, refreshAccessToken } from "../features/auth/authSlice";
import { PageSkeleton } from "./Skeleton";
import { isIdleExpired } from "../features/auth/sessionActivity";

// True if the JWT is missing/malformed or its `exp` is in the past.
function tokenInvalid(token) {
  if (!token) return true;
  try {
    const part = token.split(".")[1];
    const claims = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
    if (!claims.exp) return false;
    return claims.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

/**
 * Gate for authenticated pages.
 *  • Valid in-memory access token → render the page.
 *  • Otherwise → try a silent refresh using the HttpOnly refresh cookie (this
 *    also covers a fresh reload, when the in-memory token is empty but the
 *    signed-in user still has a valid cookie). Success → render; failure →
 *    /login.
 */
export default function ProtectedRoute({ children }) {
  const token = useSelector(selectAuthToken);
  const dispatch = useDispatch();

  const accessOk = !tokenInvalid(token);
  // Idle past the session window → this is a new visit: straight to /login, no
  // cookie refresh (the boot effect in App.jsx is already signing them out).
  const idle = !accessOk && isIdleExpired();
  const [state, setState] = useState(accessOk ? "ok" : idle ? "denied" : "refreshing");

  useEffect(() => {
    if (accessOk || idle) return;
    dispatch(refreshAccessToken())
      .unwrap()
      .then(() => setState("ok"))
      .catch(() => setState("denied"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "refreshing") {
    return <PageSkeleton />;
  }
  if (state === "denied") return <Navigate to="/login" replace />;
  return children;
}
