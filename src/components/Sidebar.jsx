import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentUser } from "../features/auth/authSlice";
import { useState } from "react";
import accountIcon from "../images/account.svg";

function Sidebar({ isOpen = true, toggleSidebar }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    if (toggleSidebar) toggleSidebar();
  };

  const toggleAccountMenu = () => setAccountMenuOpen(!accountMenuOpen);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      if (toggleSidebar) toggleSidebar();
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (toggleSidebar) toggleSidebar();
  };

  const isFixedSidebar = !toggleSidebar;

  return (
    <>
      {!isFixedSidebar && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`${
          isFixedSidebar
            ? "fixed top-0 left-0 h-full bg-gradient-to-b from-blue-800 to-blue-900 text-white z-50 w-56 md:w-60 lg:w-64"
            : `fixed top-0 left-0 h-full bg-gradient-to-b from-blue-800 to-blue-900 text-white z-50 transform transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              } w-[70%] sm:w-[50%] md:w-[40%]`
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-blue-700">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wider text-white">
            <span className="text-yellow-300">SP</span> SocialPulse
          </h2>
          {!isFixedSidebar && (
            <button
              onClick={toggleSidebar}
              className="hover:bg-blue-700 p-1 rounded-full transition"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex flex-col h-[calc(100%-3.5rem)] no-scrollbar overflow-y-auto text-sm md:text-base">
          <nav
            className={`flex flex-col px-5 space-y-3 flex-grow ${
              user ? "mt-6" : "mt-10"
            }`}
          >
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick("/dashboard")}
                  className="font-semibold text-left hover:text-blue-200 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick("/deposits")}
                  className="font-semibold text-left hover:text-blue-200 transition"
                >
                  Fund Wallet
                </button>
                <button
                  onClick={() => handleNavClick("/virtual_numbers")}
                  className="font-semibold text-left hover:text-blue-200 transition"
                >
                  Request Numbers
                </button>
                <button
                  onClick={() => handleNavClick("/boost")}
                  className="font-semibold text-left hover:text-blue-200 transition"
                >
                  Boost Social Media
                </button>

                <div className="space-y-1">
                  <p className="px-1 py-1 font-semibold opacity-80 text-xs uppercase tracking-wide">
                    History
                  </p>
                  <button
                    onClick={() => handleNavClick("/number_history")}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Numbers Purchased
                  </button>
                  <button
                    onClick={() => handleNavClick("/transactions")}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Transactions
                  </button>
                  <button
                    onClick={() => handleNavClick("/boost_history")}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Boost History
                  </button>
                </div>

                <button
                  onClick={() => handleNavClick("/faq")}
                  className="font-semibold text-left hover:text-blue-200 transition"
                >
                  FAQs
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-left text-sm sm:text-base font-semibold hover:text-blue-200 transition"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left text-sm sm:text-base font-semibold hover:text-blue-200 transition"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-left text-sm sm:text-base font-semibold hover:text-blue-200 transition"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-left text-sm sm:text-base font-semibold hover:text-blue-200 transition"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-sm sm:text-base font-semibold hover:text-blue-200 transition"
                >
                  Contact
                </button>

                <hr className="border-blue-700 my-4" />

                <button
                  onClick={() => handleNavClick("/login")}
                  className="block w-full text-center bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick("/register")}
                  className="block w-full text-center border border-white py-2 rounded-lg hover:bg-white hover:text-blue-700 font-semibold transition"
                >
                  Register
                </button>
              </>
            )}
          </nav>

          {user && (
            <div className="border-t border-blue-700 p-3 bg-blue-900 mt-auto">
              <button
                onClick={toggleAccountMenu}
                className="w-full flex items-center justify-between bg-blue-700 hover:bg-blue-600 rounded-lg px-3 py-2 transition"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={accountIcon}
                    alt="Account"
                    className="w-8 h-8 rounded-full border border-white object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold leading-tight text-[11px] truncate">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-[10px] text-blue-200 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                {accountMenuOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>

              {accountMenuOpen && (
                <div className="mt-2 bg-blue-700 rounded-lg overflow-hidden animate-fadeIn">
                  <button
                    onClick={() => handleNavClick("/profile")}
                    className="block w-full text-left px-3 py-1 hover:bg-blue-600 transition text-[11px]"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavClick("/change-password")}
                    className="block w-full text-left px-3 py-1 hover:bg-blue-600 transition text-[11px]"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => handleNavClick("/support")}
                    className="block w-full text-left px-3 py-1 hover:bg-blue-600 transition text-[11px]"
                  >
                    Contact Support
                  </button>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="mt-3 w-full bg-red-600 text-white py-1.5 rounded-lg hover:bg-red-700 transition text-[12px]"
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
