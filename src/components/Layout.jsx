import { useState } from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";
import { ToastContainer, Slide } from "react-toastify";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { Menu } from "lucide-react";

function Layout() {
  const user = useSelector(selectCurrentUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!user) {
   
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <NavBar />
        <main className="flex-grow pt-16 pb-12">
          <Outlet />
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          transition={Slide}
          theme="dark"
        />
      </div>
    );
  }

  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 relative overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        className="absolute top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md md:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={22} />
      </button>

      
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      
      <div
        className={`flex-1 transition-all duration-300 md:ml-60 lg:ml-64 ${
          sidebarOpen ? "blur-sm md:blur-0" : ""
        }`}
      >
        <div className="p-4 sm:p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </div>

      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        transition={Slide}
        theme="dark"
      />
    </div>
  );
}

export default Layout;
