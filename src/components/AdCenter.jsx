import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import {
  selectIsAuthenticated,
  selectAuthToken,
} from "../features/auth/authSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE;

// Pull the video id out of any common YouTube URL shape.
function youtubeId(url = "") {
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return "";
}

export default function AdCenter() {
  const isAuthed = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);
  const [ads, setAds] = useState([]);
  const [countdowns, setCountdowns] = useState({}); // { [adId]: secondsLeft }
  const fetchedRef = useRef(false);

  // Fetch the queue once per login session.
  useEffect(() => {
    if (!isAuthed || !token || fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/ads/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return;
        setAds(data);
        const cd = {};
        data.forEach((ad) => {
          if (ad.must_watch) cd[ad.id] = ad.countdown_seconds || 5;
        });
        setCountdowns(cd);
      } catch {
        /* silent — ads are non-critical */
      }
    })();
  }, [isAuthed, token]);

  // Reset the guard on logout so a fresh login re-fetches.
  useEffect(() => {
    if (!isAuthed) {
      fetchedRef.current = false;
      setAds([]);
      setCountdowns({});
    }
  }, [isAuthed]);

  // Tick every locked ad's countdown down to zero.
  useEffect(() => {
    const active = Object.values(countdowns).some((s) => s > 0);
    if (!active) return;
    const t = setInterval(() => {
      setCountdowns((prev) => {
        const next = {};
        let changed = false;
        for (const [id, secs] of Object.entries(prev)) {
          next[id] = secs > 0 ? secs - 1 : 0;
          if (secs > 0) changed = true;
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [countdowns]);

  const dismiss = (ad, action = "dismissed") => {
    // Fire-and-forget; the ad disappears immediately for the user.
    fetch(`${BASE_URL}/api/ads/${ad.id}/dismiss/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    }).catch(() => {});
    setAds((prev) => prev.filter((a) => a.id !== ad.id));
  };

  const clickCta = (ad) => {
    dismiss(ad, "clicked");
    if (!ad.cta_url) return;
    if (/^https?:\/\//i.test(ad.cta_url)) {
      window.open(ad.cta_url, "_blank", "noopener");
    } else {
      window.location.assign(ad.cta_url);
    }
  };

  if (ads.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="flex gap-4 overflow-x-auto max-w-full py-4 snap-x">
        {ads.map((ad) => {
          const locked = ad.must_watch && (countdowns[ad.id] ?? 0) > 0;
          const vid = ad.kind === "youtube" ? youtubeId(ad.youtube_url) : "";
          return (
            <div
              key={ad.id}
              className="relative shrink-0 w-[340px] max-w-[85vw] snap-center rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Close / countdown control */}
              {locked ? (
                <div
                  className="absolute top-2 right-2 z-10 grid place-items-center w-8 h-8 rounded-full bg-black/60 text-white text-xs font-bold"
                  title="You can close this shortly"
                >
                  {countdowns[ad.id]}
                </div>
              ) : (
                <button
                  onClick={() => dismiss(ad, "dismissed")}
                  className="absolute top-2 right-2 z-10 grid place-items-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white"
                  aria-label="Close ad"
                >
                  <X size={16} />
                </button>
              )}

              {/* Media */}
              {ad.kind === "youtube" && vid && (
                <div className="aspect-video bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${vid}?rel=0`}
                    title={ad.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {ad.kind === "image" && ad.image_url && (
                <button
                  onClick={() => (ad.cta_url ? clickCta(ad) : dismiss(ad, "clicked"))}
                  className="block w-full"
                >
                  <img src={ad.image_url} alt={ad.title} className="w-full object-cover max-h-72" />
                </button>
              )}
              {ad.kind === "promo" && ad.image_url && (
                <img src={ad.image_url} alt={ad.title} className="w-full object-cover max-h-44" />
              )}

              {/* Body */}
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white leading-snug">{ad.title}</h3>
                {ad.caption && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line">
                    {ad.caption}
                  </p>
                )}
                {ad.cta_label && ad.cta_url && ad.kind !== "image" && (
                  <button
                    onClick={() => clickCta(ad)}
                    className="mt-3 w-full rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 text-sm"
                  >
                    {ad.cta_label}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
