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

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 relative">
       
        <NavBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </aside>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          />
        )}

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
    <div className="flex min-h-screen bg-blue overflow-hidden">
      <aside className="w-64 bg-white shadow-md h-screen overflow-y-auto">
        <Sidebar />
      </aside>

     
      <div className="flex flex-col flex-1 min-h-screen overflow-y-auto">
        <main className="flex-1">
          <Outlet />
        </main>

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
