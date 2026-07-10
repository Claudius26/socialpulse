/**
 * SocialPulse Global brand mark — the gradient "S" (globe + chat bubble) icon
 * paired with the "SocialPulse Global" wordmark ("Pulse" in the brand cyan).
 * The icon is a transparent PNG so it sits cleanly on light or dark surfaces.
 */
import logoMark from "../images/logo-mark.png";

export default function Logo({ size = 38, withText = true, className = "", light = false }) {
  const solid = light ? "text-white" : "text-slate-900 dark:text-white";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={logoMark}
        alt="SocialPulse Global"
        style={{ height: size, width: "auto" }}
        className="shrink-0 object-contain select-none"
        draggable="false"
      />
      {withText && (
        <span className="font-extrabold text-lg tracking-tight leading-none whitespace-nowrap">
          <span className={solid}>Social</span>
          <span className="bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Pulse</span>
          <span className={solid}> Global</span>
        </span>
      )}
    </span>
  );
}