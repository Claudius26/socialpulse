import { useEffect } from "react";
import { useLocation } from "react-router";

// Scrolls to the section matching the URL hash (e.g. /#services).
// Needed because this is a client-rendered app: the target section may
// not exist in the DOM until React finishes rendering the page.
export default function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => clearTimeout(t);
  }, [hash]);

  return null;
}
