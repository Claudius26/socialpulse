import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuthToken, selectRefreshToken, refreshAccessToken, logout,
} from "../features/auth/authSlice";

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
 *  • Valid access token → render the page.
 *  • Access expired but refresh still valid → silently get a new access token
 *    (so a user who left the browser open stays signed in) then render.
 *  • No/invalid session → scrub it and send them to /login.
 */
export default function ProtectedRoute({ children }) {
  const token = useSelector(selectAuthToken);
  const refresh = useSelector(selectRefreshToken);
  const dispatch = useDispatch();

  const accessOk = !tokenInvalid(token);
  const canRefresh = !accessOk && !tokenInvalid(refresh);
  const [state, setState] = useState(accessOk ? "ok" : canRefresh ? "refreshing" : "denied");

  useEffect(() => {
    if (accessOk) return;
    if (canRefresh) {
      dispatch(refreshAccessToken())
        .unwrap()
        .then(() => setState("ok"))
        .catch(() => setState("denied"));
    } else {
      if (token) dispatch(logout());
      setState("denied");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "refreshing") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">Loading…</p>
      </div>
    );
  }
  if (state === "denied") return <Navigate to="/login" replace />;
  return children;
}