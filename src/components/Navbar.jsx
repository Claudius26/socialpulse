import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, selectCurrentUser } from "../features/auth/authSlice";
import accountIcon from "../images/account.svg";
import Logo from "./Logo";
import Sidebar from "./Sidebar";
import { Menu, X, ChevronDown, Moon, Sun } from "lucide-react";
import { applyTheme, getInitialTheme } from "../utils/theme";
import { availableBalance } from "../utils/wallet";

function Navbar({ isLanding = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const [accountOpen, setAccountOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleAccount = () => setAccountOpen((v) => !v);

  const toggleSidebar = () => {
    setSidebarOpen((v) => {
      const next = !v;
      if (next) {
        setAccountOpen(false);
        setHistoryOpen(false);
      }
      return next;
    });
  };

  const toggleHistory = () => setHistoryOpen((v) => !v);

  // Initialize directly from the saved preference so remounting the navbar
  // never transiently writes the wrong theme to localStorage.
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    setAccountOpen(false);
    setHistoryOpen(false);
    setSidebarOpen(false);
  };

  const closeAccountDropdown = () => setAccountOpen(false);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

  useEffect(() => {
    const onDown = () => {
      setAccountOpen(false);
      setHistoryOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClassName = useMemo(() => {
    const base =
      "fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-all duration-300";
    const size = scrolled ? "py-2" : "py-4";
    const shadow = scrolled
      ? "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)]"
      : "shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)]";
    return `${base} ${size} ${shadow}`;
  }, [scrolled]);

  const innerClassName = useMemo(() => {
    return `mx-auto w-full max-w-6xl px-4 md:px-6 flex items-center justify-between transition-all duration-300`;
  }, []);

  const logoBoxClassName = useMemo(() => {
    return `rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 ${
      scrolled ? "w-9 h-9" : "w-10 h-10"
    }`;
  }, [scrolled]);

  const brandTextClassName = useMemo(() => {
    return `font-bold text-slate-900 dark:text-white transition-all duration-300 ${
      scrolled ? "text-base" : "text-lg"
    }`;
  }, [scrolled]);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <nav className={navClassName}>
        <div className={innerClassName}>
          <div className="flex items-center gap-8">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center">
              <Logo size={scrolled ? 34 : 38} />
            </Link>

            <div className="hidden md:flex items-center gap-3 lg:gap-4 ml-2">
              {user && (
                <>
                  <Link to="/dashboard" className="hover:text-brand-600 transition text-sm lg:text-[13px]">
                    Dashboard
                  </Link>

                  <Link to="/deposits" className="hover:text-brand-600 transition text-sm lg:text-[13px]">
                    Fund Wallet
                  </Link>

                  <Link
                    to="/usa_numbers"
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-md hover:opacity-95 transition text-sm lg:text-[13px]"
                  >
                    USA Numbers
                  </Link>

                  <Link to="/virtual_numbers" className="hover:text-brand-600 transition text-sm lg:text-[13px]">
                    GET All Countries Numbers
                  </Link>

                  <Link to="/boost" className="hover:text-brand-600 transition text-sm lg:text-[13px]">
                    Boost Social Media
                  </Link>

                  <div className="relative" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                    <button
                      onClick={toggleHistory}
                      className="flex items-center hover:text-brand-600 transition text-sm lg:text-[13px]"
                    >
                      History{" "}
                      <ChevronDown size={16} className={`ml-1 transition ${historyOpen ? "rotate-180" : ""}`} />
                    </button>

                    {historyOpen && (
                      <div className="absolute top-full mt-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-xl py-2 w-52 border border-gray-100 dark:border-gray-700">
                        <Link
                          to="/transactions"
                          className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700"
                          onClick={() => setHistoryOpen(false)}
                        >
                          Transaction History
                        </Link>
                        <Link
                          to="/boost_history"
                          className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700"
                          onClick={() => setHistoryOpen(false)}
                        >
                          Boost History
                        </Link>
                        <Link
                          to="/number_history"
                          className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700"
                          onClick={() => setHistoryOpen(false)}
                        >
                          Number History
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link to="/faq" className="hover:text-blue-400 transition text-sm lg:text-[12px]">
                    FAQs
                  </Link>
                </>
              )}

              {!user && (
                <>
                  <Link to="/#home" className="text-gray-700 dark:text-gray-100 hover:text-brand-600 transition text-sm lg:text-[13px]">
                    Home
                  </Link>
                  <Link to="/#services" className="text-gray-700 dark:text-gray-100 hover:text-brand-600 transition text-sm lg:text-[13px]">
                    Services
                  </Link>
                  <Link to="/#about" className="text-gray-700 dark:text-gray-100 hover:text-brand-600 transition text-sm lg:text-[13px]">
                    About Us
                  </Link>
                  <Link to="/#contact" className="text-gray-700 dark:text-gray-100 hover:text-brand-600 transition text-sm lg:text-[13px]">
                    Contact Us
                  </Link>
                  <Link to="/#how-to-use" className="text-gray-700 dark:text-gray-100 hover:text-brand-600 transition text-sm lg:text-[13px]">
                    How to use
                  </Link>
                  <Link to="/faq" className="text-gray-700 dark:text-gray-100 hover:text-brand-600 transition text-sm lg:text-[13px]">
                    FAQ
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-gray-700 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle theme"
              type="button"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user?.wallet && (
              <div
                className={`hidden md:flex items-center gap-1 bg-white dark:bg-gray-900 px-5 rounded-full border border-gray-100 dark:border-gray-800 transition-all duration-300 ${
                  scrolled ? "py-1" : "py-1.5"
                }`}
              >
                <span className="text-[11px] text-gray-500">Balance</span>
                <span className="font-semibold text-[12px] text-gray-900 dark:text-gray-100">
                  {user.wallet.currency} {availableBalance(user.wallet).toFixed(2)}
                </span>
              </div>
            )}

            {user && (
              <div className="relative hidden md:block" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <button onClick={toggleAccount} className="flex items-center" type="button">
                  <img
                    src={accountIcon}
                    alt="Account"
                    className={`rounded-full transition-all duration-300 dark:invert ${scrolled ? "w-10 h-10" : "w-11 h-11"}`}
                  />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-2xl py-2 z-20 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={closeAccountDropdown}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/developer"
                      className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={closeAccountDropdown}
                    >
                      Developer API
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={closeAccountDropdown}
                    >
                      Change Password
                    </Link>
                    <Link
                      to="/support"
                      className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={closeAccountDropdown}
                    >
                      Contact Support
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-700 text-red-600"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-xl text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              type="button"
            >
              {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
