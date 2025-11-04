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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-x-hidden">
      <NavBar toggleSidebar={handleToggleSidebar} />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:hidden`}
      >
        <Sidebar closeSidebar={handleCloseSidebar} />
      </aside>

      {sidebarOpen && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
        />
      )}

      <main className="flex-1 flex flex-col pt-16">
        <div className="flex-grow">
          <Outlet />
        </div>

        <Footer />
      </main>

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
