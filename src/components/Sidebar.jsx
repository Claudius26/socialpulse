import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentUser } from "../features/auth/authSlice";

import { useState } from "react";
import accountIcon from "../images/account.svg";

function Sidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toggleSidebar();
  };

  const toggleAccountMenu = () => setAccountMenuOpen(!accountMenuOpen);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      toggleSidebar();
    }
  };

  return (
    <>
     
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-blue-700">
          <h2 className="text-xl font-bold tracking-wide">
            {user ? "Dashboard" : "Menu"}
          </h2>
          <button
            onClick={toggleSidebar}
            className="hover:bg-blue-700 p-2 rounded-full transition"
          >
            <X size={22} />
          </button>
        </div>

        
        <div className="flex flex-col h-[calc(100%-4rem)] no-scrollbar overflow-y-auto">
          <nav className="flex flex-col p-6 space-y-4 flex-grow">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={toggleSidebar}
                  className="hover:text-blue-200 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/deposits"
                  onClick={toggleSidebar}
                  className="hover:text-blue-200 transition"
                >
                  Fund Wallet
                </Link>
                <Link
                  to="/virtual_numbers"
                  onClick={toggleSidebar}
                  className="hover:text-blue-200 transition"
                >
                  Request Numbers
                </Link>
                <Link
                  to="/boost"
                  onClick={toggleSidebar}
                  className="hover:text-blue-200 transition"
                >
                  Boost Social Media
                </Link>

                <div className="space-y-1">
                  <p className="px-1 py-1 font-semibold opacity-80">History</p>
                  <Link
                    to="/number_history"
                    onClick={toggleSidebar}
                    className="block px-4 py-1 text-sm rounded hover:bg-blue-700 transition"
                  >
                    Numbers Purchased
                  </Link>
                  <Link
                    to="/transactions"
                    onClick={toggleSidebar}
                    className="block px-4 py-1 text-sm rounded hover:bg-blue-700 transition"
                  >
                    Transactions
                  </Link>
                  <Link
                    to="/boost_history"
                    onClick={toggleSidebar}
                    className="block px-4 py-1 text-sm rounded hover:bg-blue-700 transition"
                  >
                    Boost History
                  </Link>
                </div>

                <Link
                  to="/faq"
                  onClick={toggleSidebar}
                  className="hover:text-blue-200 transition"
                >
                  FAQs
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-left hover:text-blue-200 transition"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left hover:text-blue-200 transition"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-left hover:text-blue-200 transition"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-left hover:text-blue-200 transition"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left hover:text-blue-200 transition"
                >
                  Contact
                </button>

                <hr className="border-blue-700 my-4" />

                <Link
                  to="/login"
                  onClick={toggleSidebar}
                  className="block text-center bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleSidebar}
                  className="block text-center border border-white py-2 rounded-lg hover:bg-white hover:text-blue-700 font-semibold transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Account + Logout section */}
          {user && (
            <div className="border-t border-blue-700 p-4 bg-blue-900 mt-auto">
              <button
                onClick={toggleAccountMenu}
                className="w-full flex items-center justify-between bg-blue-700 hover:bg-blue-600 rounded-lg px-4 py-3 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={accountIcon}
                    alt="Account"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold leading-tight">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-xs text-blue-200">{user.email}</p>
                  </div>
                </div>
                {accountMenuOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {accountMenuOpen && (
                <div className="mt-2 bg-blue-700 rounded-lg shadow-md overflow-hidden animate-fadeIn">
                  <Link
                    to="/profile"
                    onClick={toggleSidebar}
                    className="block px-4 py-2 hover:bg-blue-600 transition text-sm"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={toggleSidebar}
                    className="block px-4 py-2 hover:bg-blue-600 transition text-sm"
                  >
                    Change Password
                  </Link>
                  <Link
                    to="/support"
                    onClick={toggleSidebar}
                    className="block px-4 py-2 hover:bg-blue-600 transition text-sm"
                  >
                    Contact Support
                  </Link>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
