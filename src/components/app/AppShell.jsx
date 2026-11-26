import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { Menu, Moon, Sun } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { TABS, titleFor } from "./appNav";
import Logo from "../Logo";
import { applyTheme, getInitialTheme } from "../../utils/theme";

/** Light = switched ON (knob right). Dark = OFF (knob left). */
function ThemeSwitch({ theme, onChange }) {
  const light = theme !== "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={light ? "Light mode on. Switch to dark mode" : "Dark mode on. Switch to light mode"}
      onClick={() => onChange(light ? "dark" : "light")}
      className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    >
      <span className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${light ? "bg-amber-400" : "bg-slate-700"}`}>
        <span className={`absolute left-0.5 grid place-items-center h-6 w-6 rounded-full bg-white shadow transition-transform duration-300 ${light ? "translate-x-5" : "translate-x-0"}`}>
          {light ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-slate-700" />}
        </span>
      </span>
      <span className="w-9 text-left">{light ? "Light" : "Dark"}</span>
    </button>
  );
}

function BottomTabs({ onMore, moreOpen }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16">
        {TABS.map(({ to, label, icon, center }) => {
          const Icon = icon;
          return center ? (
            <NavLink key={to} to={to} className="flex flex-col items-center justify-center">
              {({ isActive }) => (
                <>
                  <span className={`-mt-6 grid place-items-center w-12 h-12 rounded-2xl text-white shadow-lg bg-gradient-to-br from-brand-600 to-violet-600 ring-4 ring-white dark:ring-slate-900 ${isActive ? "scale-105" : ""} transition`}>
                    <Icon size={22} />
                  </span>
                  <span className={`mt-0.5 text-[11px] font-medium ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-500 dark:text-slate-400"}`}>{label}</span>
                </>
              )}
            </NavLink>
          ) : (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                  isActive && !moreOpen ? "text-brand-600 dark:text-brand-400" : "text-slate-500 dark:text-slate-400"
                }`
              }>
              <Icon size={21} />
              {label}
            </NavLink>
          );
        })}
        <button type="button" onClick={onMore}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${moreOpen ? "text-brand-600 dark:text-brand-400" : "text-slate-500 dark:text-slate-400"}`}>
          <Menu size={21} />
          More
        </button>
      </div>
    </nav>
  );
}

/** Logged-in app frame: sidebar (desktop) / tabs + drawer (mobile), top bar, no footer. */
export default function AppShell() {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => { applyTheme(theme); }, [theme]);

  // Close the drawer whenever the route changes.
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <AppSidebar drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-14 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="h-full px-4 md:px-6 flex items-center gap-3">
          <Link to="/dashboard" className="lg:hidden flex items-center min-w-0">
            <Logo size={28} withText={false} className="sm:hidden" />
            <Logo size={28} className="hidden sm:inline-flex" />
          </Link>
          <h1 className="hidden lg:block text-base font-semibold text-slate-900 dark:text-white truncate">
            {titleFor(pathname)}
          </h1>
          <div className="ml-auto shrink-0">
            <ThemeSwitch theme={theme} onChange={setTheme} />
          </div>
        </div>
      </header>

      <main className="lg:pl-64 pt-14 pb-24 lg:pb-8 overflow-x-hidden">
        <Outlet />
      </main>

      <BottomTabs onMore={() => setDrawerOpen((v) => !v)} moreOpen={drawerOpen} />
    </div>
  );
}
