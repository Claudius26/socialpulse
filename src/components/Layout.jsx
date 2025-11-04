import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { ToastContainer, Slide } from "react-toastify";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useState } from "react";

function Layout() {
  const user = useSelector(selectCurrentUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!user) {
    // For logged-out users, sidebar only opens from menu button
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100">
        <NavBar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto z-0 pt-16 md:pt-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  // For logged-in users, sidebar always visible
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-60 lg:ml-64 min-h-screen overflow-hidden">
        <NavBar />
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
          <Outlet />
        </main>
        <Footer />
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
