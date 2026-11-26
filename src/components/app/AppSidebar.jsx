import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, LogOut, X } from "lucide-react";
import Logo from "../Logo";
import { logoutUser, selectCurrentUser } from "../../features/auth/authSlice";
import { COMPANY } from "../../legal/company";
import { PRIMARY, GROUPS } from "./appNav";

const isIn = (pathname, to) => pathname === to || pathname.startsWith(to + "/");

function Item({ to, label, icon, highlight, onNavigate, nested }) {
  const Icon = icon;
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-xl transition",
          nested ? "px-3 py-2 text-[13px]" : "px-3 py-2.5 text-sm font-medium",
          isActive
            ? "bg-brand-600 text-white shadow-sm"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={nested ? 16 : 18} className="shrink-0" />
          <span className="truncate flex-1">{label}</span>
          {highlight && !isActive && (
            <span className="rounded-full bg-gradient-to-r from-brand-600 to-violet-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              Hot
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function Group({ group, pathname, onNavigate }) {
  const containsActive = group.items.some((i) => isIn(pathname, i.to));
  const [open, setOpen] = useState(containsActive);

  // Opening a page inside the group (e.g. from a tab) expands it.
  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

  const Icon = group.icon;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
          containsActive ? "text-brand-700 dark:text-brand-300" : "text-slate-600 dark:text-slate-300"
        }`}
      >
        <Icon size={18} className="shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-200 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="ml-5 mt-1 mb-1 space-y-0.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            {group.items.map((i) => (
              <Item key={i.to} {...i} nested onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The logged-in app's navigation. `drawer` = mobile slide-over (with backdrop);
 * otherwise it's the fixed desktop sidebar.
 */
export default function AppSidebar({ drawer = false, open = false, onClose }) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onNavigate = drawer ? onClose : undefined;

  const logout = () => {
    dispatch(logoutUser());
    navigate("/login");
    onClose?.();
  };


  const body = (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center">
          <Logo size={30} />
        </Link>
        {drawer && (
          <button type="button" onClick={onClose} aria-label="Close menu"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-3 py-4">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Main</p>
        <nav className="space-y-0.5">
          {PRIMARY.map((i) => (
            <Item key={i.to} {...i} onNavigate={onNavigate} />
          ))}
        </nav>

        <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

        <nav className="space-y-0.5">
          {GROUPS.map((g) => (
            <Group key={g.id} group={g} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>

      <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 p-3">
        <div className="flex items-center gap-3 px-2 pb-3">
          <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-sm font-bold">
            {(user?.full_name || user?.email || "?").trim().charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.full_name || user?.username}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <button type="button" onClick={logout} title="Log out" aria-label="Log out"
            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40">
            <LogOut size={18} />
          </button>
        </div>
        <p className="px-2 text-[10px] leading-relaxed text-slate-400">
          <Link to="/terms" onClick={onNavigate} className="hover:underline">Terms</Link>{" · "}
          <Link to="/privacy" onClick={onNavigate} className="hover:underline">Privacy</Link>{" · "}
          <Link to="/refund-policy" onClick={onNavigate} className="hover:underline">Refunds</Link>{" · "}
          <a href={COMPANY.certificateUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">CAC {COMPANY.registration}</a>
        </p>
      </div>
    </div>
  );

  if (!drawer) {
    return <aside className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64">{body}</aside>;
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!open}
      >
        {body}
      </aside>
    </>
  );
}
