import { useState } from "react";
import { Star } from "lucide-react";

/**
 * Controlled 1–5 star rating.
 *  - Hover previews the fill; tap/enter/space sets the value.
 *  - Keyboard accessible (each star is a focusable button; arrow-free, tap-based).
 *  - `readOnly` renders static filled stars with no interaction.
 *
 * Props: value (0–5), onChange(n), size (px), readOnly (bool).
 */
export default function StarRating({ value = 0, onChange, size = 28, readOnly = false }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="inline-flex items-center gap-1" role={readOnly ? "img" : "radiogroup"} aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        if (readOnly) {
          return (
            <Star
              key={n}
              size={size}
              className={filled ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}
            />
          );
        }
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onChange?.(n)}
            className="rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          >
            <Star
              size={size}
              className={`transition-colors ${filled ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
