import { Outlet } from "react-router";
import { useEffect } from "react";
import { ToastContainer, Slide } from "react-toastify";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { applyTheme, getInitialTheme } from "../utils/theme";

function Layout() {
    useEffect(() => {
    applyTheme(getInitialTheme());
  }, []);
  return (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-x-hidden">

      <NavBar />

      <main className="flex-grow pt-16 pb-20 overflow-x-hidden">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <footer className="mt-auto z-10">
        <Footer />
      </footer>

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
