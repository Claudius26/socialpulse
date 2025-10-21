import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

import { ToastContainer,Slide } from "react-toastify";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
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
        className="z-[9999]" 
      />
    </div>
  );
}

export default Layout;
