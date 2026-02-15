import { X, ChevronDown, ChevronUp, LayoutDashboard, Wallet, Phone, Globe, TrendingUp, History, HelpCircle, LogOut, UserCircle, KeyRound, Headphones } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentUser } from "../features/auth/authSlice";
import { useEffect, useMemo, useState } from "react";
import accountIcon from "../images/account.svg";

function Sidebar({ isOpen = true, toggleSidebar }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isFixedSidebar = !toggleSidebar;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    if (toggleSidebar) toggleSidebar();
  };

  const toggleAccountMenu = () => setAccountMenuOpen((v) => !v);

  const handleNavClick = (path) => {
    navigate(path);
    if (toggleSidebar) toggleSidebar();
  };

  // Close account menu when sidebar closes (mobile UX)
  useEffect(() => {
    if (!isOpen) setAccountMenuOpen(false);
  }, [isOpen]);

  const menu = useMemo(() => {
    if (!user) {
      return [
        { label: "Home", onClick: () => handleNavClick("/") },
        { label: "Login", onClick: () => handleNavClick("/login") },
        { label: "Register", onClick: () => handleNavClick("/register") },
      ];
    }

    return [
      { section: "Main" },
      { label: "Dashboard", icon: LayoutDashboard, onClick: () => handleNavClick("/dashboard") },
      { label: "Fund Wallet", icon: Wallet, onClick: () => handleNavClick("/deposits") },
      { label: "Get USA Numbers", icon: Phone, onClick: () => handleNavClick("/usa_numbers") },
      { label: "Get All Countries Numbers", icon: Globe, onClick: () => handleNavClick("/virtual_numbers") },
      { label: "Boost Social Media", icon: TrendingUp, onClick: () => handleNavClick("/boost") },

      { section: "History" },
      { label: "Numbers Purchased", icon: History, onClick: () => handleNavClick("/number_history") },
      { label: "Transactions", icon: History, onClick: () => handleNavClick("/transactions") },
      { label: "Boost History", icon: History, onClick: () => handleNavClick("/boost_history") },

      { section: "Help" },
      { label: "FAQs", icon: HelpCircle, onClick: () => handleNavClick("/faq") },
    ];
  }, [user]);

  const MenuItem = ({ label, icon: Icon, onClick }) => (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200
                 hover:bg-white/10 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white/20"
    >
      {Icon ? (
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/15 transition">
          <Icon size={18} className="text-white/90" />
        </span>
      ) : null}

      <div className="flex-1 min-w-0">
        <p className="text-[15px] sm:text-base font-semibold text-white leading-tight truncate">
          {label}
        </p>
      </div>
    </button>
  );

  return (
    <>
      {/* Backdrop (mobile) */}
      {!isFixedSidebar && (
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={toggleSidebar}
        />
      )}

      
      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full",
          "text-white",
          "transition-transform duration-300 ease-out",
          isFixedSidebar
            ? "w-72 md:w-72 lg:w-80 translate-x-0"
            : `w-[82%] sm:w-[60%] md:w-[44%] ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
        ].join(" ")}
      >
        
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-900 to-[#071a3a]" />
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="relative h-full flex flex-col">
          
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 grid place-items-center shadow-sm">
                <span className="font-black tracking-wide text-yellow-300">SP</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-wide leading-tight">
                  SocialPulse
                </h2>
                <p className="text-[11px] text-white/70 -mt-0.5">
                  Secure • Fast • Reliable
                </p>
              </div>
            </div>

            {!isFixedSidebar && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-white/10 transition active:scale-95"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            )}
          </div>

         
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
            
            {user && (
              <div className="mb-5 rounded-2xl bg-white/10 border border-white/10 p-4 shadow-sm">
                <p className="text-xs text-white/70">Wallet</p>
                <p className="text-base font-semibold mt-1">Fund your account</p>
                <button
                  onClick={() => handleNavClick("/deposits")}
                  className="mt-3 w-full rounded-xl bg-yellow-400 text-blue-900 font-bold py-3 hover:bg-yellow-300 transition active:scale-[0.99]"
                >
                  Deposit Now
                </button>
              </div>
            )}

            <nav className="space-y-2">
              {menu.map((item, idx) => {
                if (item.section) {
                  return (
                    <div key={`${item.section}-${idx}`} className="pt-3">
                      <p className="px-2 text-[11px] uppercase tracking-wider text-white/60">
                        {item.section}
                      </p>
                    </div>
                  );
                }
                return (
                  <MenuItem
                    key={`${item.label}-${idx}`}
                    label={item.label}
                    icon={item.icon}
                    onClick={item.onClick}
                  />
                );
              })}
            </nav>

            {!user && (
              <div className="mt-6 rounded-2xl bg-white/10 border border-white/10 p-4">
                <p className="text-sm text-white/80">
                  Log in to purchase numbers, boost services, and manage your wallet.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleNavClick("/login")}
                    className="w-full rounded-xl bg-white text-blue-900 font-bold py-3 hover:bg-white/90 transition active:scale-[0.99]"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavClick("/register")}
                    className="w-full rounded-xl border border-white/40 py-3 font-bold hover:bg-white/10 transition active:scale-[0.99]"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}
          </div>

           {user && (
            <div className="border-t border-white/10 p-4">
              <button
                onClick={toggleAccountMenu}
                className="w-full flex items-center justify-between rounded-2xl bg-white/10 hover:bg-white/12 border border-white/10 px-4 py-3 transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={accountIcon}
                    alt="Account"
                    className="w-10 h-10 rounded-2xl border border-white/20 object-cover"
                  />
                  <div className="text-left min-w-0">
                    <p className="font-semibold text-[13px] truncate">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-[11px] text-white/70 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {accountMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              
              <div
                className={`grid transition-all duration-300 ease-out ${
                  accountMenuOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"
                }`}
              >
                <div className="overflow-hidden rounded-2xl bg-white/10 border border-white/10">
                  <button
                    onClick={() => handleNavClick("/profile")}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-left"
                  >
                    <UserCircle size={16} className="text-white/90" />
                    <span className="text-[13px] font-semibold">Profile</span>
                  </button>
                  <button
                    onClick={() => handleNavClick("/change-password")}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-left"
                  >
                    <KeyRound size={16} className="text-white/90" />
                    <span className="text-[13px] font-semibold">Change Password</span>
                  </button>
                  <button
                    onClick={() => handleNavClick("/support")}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-left"
                  >
                    <Headphones size={16} className="text-white/90" />
                    <span className="text-[13px] font-semibold">Contact Support</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-3 w-full rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold py-3 transition active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
