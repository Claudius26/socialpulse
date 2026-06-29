import { Outlet } from "react-router";
import { useEffect } from "react";
import { ToastContainer, Slide } from "react-toastify";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToHash from "../components/ScrollToHash";
import { applyTheme, getInitialTheme } from "../utils/theme";

function Layout() {
    useEffect(() => {
    applyTheme(getInitialTheme());
  }, []);
  return (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-x-hidden">

      <ScrollToHash />
      <NavBar />

      <main className="flex-grow pt-16 overflow-x-hidden">
        <Outlet />
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
