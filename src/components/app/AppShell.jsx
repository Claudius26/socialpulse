import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Moon, Sun, Plus, LogOut, UserCircle, KeyRound, Headphones } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { TABS, titleFor } from "./appNav";
import Logo from "../Logo";
import { logoutUser, selectCurrentUser } from "../../features/auth/authSlice";
import { availableBalance } from "../../utils/wallet";
import { applyTheme, getInitialTheme } from "../../utils/theme";

function AccountMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (path) => { setOpen(false); navigate(path); };
  const initial = (user?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Account menu"
        className="grid place-items-center w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-sm font-bold hover:ring-2 hover:ring-brand-500/30 transition">
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          {[
            ["/profile", "Profile", UserCircle],
            ["/change-password", "Change Password", KeyRound],
            ["/support", "Support Chat", Headphones],
          ].map(([to, label, icon]) => {
            const Icon = icon;
            return (
            <button key={to} type="button" onClick={() => go(to)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Icon size={16} /> {label}
            </button>
            );
          })}
          <button type="button"
            onClick={() => { setOpen(false); dispatch(logoutUser()); navigate("/login"); }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40">
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </div>
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
                    <Plus size={22} />
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
  const user = useSelector(selectCurrentUser);
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

  const wallet = user?.wallet;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <AppSidebar drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-14 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="h-full px-4 md:px-6 flex items-center gap-3">
          <Link to="/dashboard" className="lg:hidden flex items-center">
            <Logo size={28} />
          </Link>
          <h1 className="hidden lg:block text-base font-semibold text-slate-900 dark:text-white truncate">
            {titleFor(pathname)}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            {wallet && (
              <Link to="/deposits"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-3 pr-1 py-1 hover:border-brand-400 transition">
                <span className="text-xs font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                  {wallet.currency} {availableBalance(wallet).toFixed(2)}
                </span>
                <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-600 text-white">
                  <Plus size={14} />
                </span>
              </Link>
            )}
            <button type="button" aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="grid place-items-center w-9 h-9 rounded-xl text-slate-600 dark:text-yellow-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <AccountMenu user={user} />
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
