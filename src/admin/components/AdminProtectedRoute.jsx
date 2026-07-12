import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router";
import {
  selectAdminToken,
  selectAdminRefresh,
  refreshAdminToken,
  adminLogout,
} from "../../features/auth/adminAuth/adminAuthSlice";

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
 * Gate for the admin panel.
 *  • Valid access token → render.
 *  • Access expired but refresh still valid → silently mint a new access token
 *    then render (so an admin mid-session isn't kicked over a short-lived token).
 *  • No/invalid session → scrub it and send them to the admin login. An expired
 *    token can no longer reach any admin page — not just fail its data fetches.
 */
function AdminProtectedRoute({ children }) {
  const token = useSelector(selectAdminToken);
  const refresh = useSelector(selectAdminRefresh);
  const dispatch = useDispatch();

  const accessOk = !tokenInvalid(token);
  const canRefresh = !accessOk && !tokenInvalid(refresh);
  const [state, setState] = useState(accessOk ? "ok" : canRefresh ? "refreshing" : "denied");

  useEffect(() => {
    if (accessOk) return;
    if (canRefresh) {
      dispatch(refreshAdminToken())
        .unwrap()
        .then(() => setState("ok"))
        .catch(() => setState("denied"));
    } else {
      if (token) dispatch(adminLogout());
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
  if (state === "denied") return <Navigate to="/admin/login" replace />;
  return children;
}

export default AdminProtectedRoute;
