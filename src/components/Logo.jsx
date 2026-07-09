/**
 * SocialPulse brand mark — a "pulse" waveform inside a gradient rounded square.
 * Scales cleanly (SVG) for the navbar, hero, and favicon. Pure inline SVG, so
 * there's no external asset to fail to load.
 */
export default function Logo({ size = 38, withText = true, className = "", light = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sp-logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f46e5" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="13" fill="url(#sp-logo-grad)" />
        <path
          d="M8 24 H15 L18.5 14 L24 34 L28 20.5 L31 27 H40"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span className={`font-extrabold text-lg tracking-tight ${light ? "text-white" : "text-slate-900 dark:text-white"}`}>
          Social<span className="heading-gradient">Pulse</span>
        </span>
      )}
    </span>
  );
}