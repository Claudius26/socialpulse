import { useEffect } from "react";
import { useLocation } from "react-router";

// On navigation:
//  • if the URL has a hash (e.g. /#services) scroll to that section, else
//  • jump to the top of the new page.
// Without this, a client-rendered SPA keeps the previous scroll position, so
// navigating from a scrolled-down page (e.g. the dashboard) would open the next
// page already scrolled down.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(t);
    }
    // New page (no hash): start at the top.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}