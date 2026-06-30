import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminThemeToggle from "../components/AdminThemeToggle";

function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 md:flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[82%] shadow-xl">
            <AdminSidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-8 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
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
