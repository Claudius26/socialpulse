import { useEffect } from "react";
import { Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthToken, logout } from "../features/auth/authSlice";

// True if the JWT is missing/malformed or its `exp` is in the past.
function tokenInvalid(token) {
  if (!token) return true;
  try {
    const part = token.split(".")[1];
    const claims = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
    if (!claims.exp) return false;           // no expiry claim → treat as valid
    return claims.exp * 1000 <= Date.now();  // expired
  } catch {
    return true;                             // can't parse → treat as invalid
  }
}

/**
 * Gate for authenticated pages. If the user has no token or the token has
 * expired (e.g. the browser was left open for a while), we clear the stale
 * session and send them to the login screen instead of a page that can't load.
 */
export default function ProtectedRoute({ children }) {
  const token = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const invalid = tokenInvalid(token);

  useEffect(() => {
    if (token && invalid) dispatch(logout()); // scrub the expired session
  }, [token, invalid, dispatch]);

  if (invalid) return <Navigate to="/login" replace />;
  return children;
}