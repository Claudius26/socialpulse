import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentUser } from "../features/auth/authSlice";
import accountIcon from "../images/account.svg";
import Sidebar from "./Sidebar";
import { Menu, ChevronDown } from "lucide-react";

function Navbar({ isLanding = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const [accountOpen, setAccountOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const toggleAccount = () => setAccountOpen(!accountOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleHistory = () => setHistoryOpen(!historyOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setAccountOpen(false);
  };

  const closeAccountDropdown = () => setAccountOpen(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {sidebarOpen && (
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          user={user}
          handleLogout={handleLogout}
        />
      )}

      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl shadow-lg px-4 py-2 flex items-center justify-between z-50 border border-transparent dark:border-gray-800">

        {/* Left Section */}
        <div className="flex items-center gap-8">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              SP
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
              SocialPulse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 ml-2">
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-600 transition text-sm lg:text-[13px]"
                >
                  Dashboard
                </Link>

                <Link
                  to="/deposits"
                  className="hover:text-blue-600 transition text-sm lg:text-[13px]"
                >
                  Fund Wallet
                </Link>

                <Link
                  to="/usa_numbers"
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-95 transition text-sm lg:text-[13px]"
                >
                  USA Numbers
                </Link>

                <Link
                  to="/virtual_numbers"
                  className="hover:text-blue-600 transition text-sm lg:text-[13px]"
                >
                  GET All Countries Numbers
                </Link>

                <Link
                  to="/boost"
                  className="hover:text-blue-600 transition text-sm lg:text-[13px]"
                >
                  Boost Social Media
                </Link>

                <div className="relative">
                  <button
                    onClick={toggleHistory}
                    className="flex items-center hover:text-blue-600 transition text-sm lg:text-[13px]"
                  >
                    History <ChevronDown size={16} className="ml-1" />
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

                <Link
                  to="/faq"
                  className="hover:text-blue-400 transition text-sm lg:text-[12px]"
                >
                  FAQs
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">

          {user && user.wallet && (
            <div className="hidden md:flex items-center gap-1 bg-white/70 dark:bg-gray-800/70 px-5 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-[11px] text-gray-500">Balance</span>
              <span className="font-semibold text-[12px] text-gray-900 dark:text-gray-100">
                {user.wallet.currency} {user.wallet.balance.toFixed(2)}
              </span>
            </div>
          )}

          {user && (
            <div className="relative hidden md:block">
              <button onClick={toggleAccount} className="flex items-center">
                <img
                  src={accountIcon}
                  alt="Account"
                  className="w-11 h-11 rounded-full transition"
                />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-2xl py-2 z-20 border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {user.full_name}
                    </p>
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
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden" onClick={toggleSidebar}>
            <Menu size={28} />
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
