import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminThemeToggle from "../components/AdminThemeToggle";
import Logo from "../../components/Logo";

function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  // While the mobile drawer is open, freeze the page behind it so scrolling the
  // sidebar never scrolls the content underneath.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 md:flex">
      {/* Desktop sidebar — pinned to the viewport; only the main content scrolls */}
      <div className="hidden md:block sticky top-0 h-screen self-start shrink-0 overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[82%] shadow-xl overflow-y-auto overscroll-contain">
            <AdminSidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-8 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* On mobile the sidebar is hidden, so the header carries the brand. */}
          <Logo size={30} className="md:hidden" />

          <div className="flex-1" />
          <AdminThemeToggle />
        </header>

        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
