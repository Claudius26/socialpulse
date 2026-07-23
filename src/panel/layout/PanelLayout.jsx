import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import PanelSidebar from "../components/PanelSidebar";
import AdminThemeToggle from "../../admin/components/AdminThemeToggle";
import ApiHealthBanner from "../../admin/components/ApiHealthBanner";
import { ToastContainer, Slide } from "react-toastify";

/**
 * Shell for the REFERRAL-ADMIN panel. Deliberately a different visual identity
 * from the super-admin dashboard: an emerald "operator console" on a deep slate
 * frame, so the two areas are never mistaken for each other. Unlike the admin
 * area, this shell mounts its own ToastContainer so panel actions can toast.
 */
function PanelLayout({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0a1512] md:flex">
      <div className="hidden md:block sticky top-0 h-screen self-start shrink-0 overflow-y-auto">
        <PanelSidebar />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[82%] shadow-xl overflow-y-auto overscroll-contain">
            <PanelSidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-8 h-16 bg-white dark:bg-[#0d1c17] border-b border-emerald-100 dark:border-emerald-900/40">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="md:hidden font-bold text-emerald-700 dark:text-emerald-400">Admin Console</span>
          <div className="flex-1" />
          <AdminThemeToggle />
        </header>

        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <ApiHealthBanner />
            {children}
          </div>
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} transition={Slide} theme="dark" />
    </div>
  );
}

export default PanelLayout;
