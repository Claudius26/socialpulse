import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getInitialTheme } from "../../utils/theme";

// Same UX as the CardPulse app toggle: the label shows the mode you'll switch
// TO, and the knob slides + recolors.
export default function AdminThemeToggle() {
  const [mode, setMode] = useState(getInitialTheme());

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    applyTheme(next);
    setMode(next);
  };

  const target = mode === "dark" ? "Light" : "Dark";

  return (
    <button
      onClick={toggle}
      className="relative w-[132px] h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      <span
        className={`block text-center leading-10 text-sm font-semibold text-slate-700 dark:text-slate-200 ${
          mode === "dark" ? "pr-8" : "pl-8"
        }`}
      >
        {target}
      </span>
      <span
        className={`absolute top-1 left-1 w-8 h-8 rounded-full grid place-items-center shadow transition-transform duration-200 ${
          mode === "dark" ? "translate-x-[92px] bg-slate-950" : "translate-x-0 bg-white"
        }`}
      >
        {mode === "dark" ? (
          <Moon size={16} className="text-amber-300" />
        ) : (
          <Sun size={16} className="text-amber-500" />
        )}
      </span>
    </button>
  );
}
