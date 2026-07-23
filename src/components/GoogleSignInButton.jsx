import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUser, setError } from "../features/auth/authSlice";

// The Web OAuth Client ID from Google Cloud. Public (not a secret), but kept in
// an env var so it's easy to change per environment.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";
const SCRIPT_ID = "google-gsi-client";

export default function GoogleSignInButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const divRef = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID) return; // not configured yet — render nothing

    const handleCredential = async (response) => {
      try {
        const res = await fetch(`${backendBase}/api/auth/google/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",   // store the HttpOnly session cookies
          body: JSON.stringify({ id_token: response.credential }),
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(setError(data.error || "Google sign-in failed."));
          return;
        }
        dispatch(setUser({ user: data.user, summary: data.summary, token: data.token }));
        navigate("/dashboard");
      } catch {
        dispatch(setError("Network error during Google sign-in. Please try again."));
      }
    };

    const renderButton = () => {
      if (!window.google?.accounts?.id || !divRef.current) return;
      window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredential });
      divRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(divRef.current, {
        theme: "outline", size: "large", text: "continue_with", shape: "pill", width: 320,
      });
    };

    if (document.getElementById(SCRIPT_ID)) {
      renderButton();
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CLIENT_ID) return null;
  return <div ref={divRef} className="flex justify-center" />;
}
