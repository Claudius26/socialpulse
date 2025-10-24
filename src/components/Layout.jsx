import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";
import { ToastContainer, Slide } from "react-toastify";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

function Layout() {
  const user = useSelector(selectCurrentUser);

  // Not logged in layout
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
          className="z-[9999]"
        />
      </div>
    );
  }

  // Logged in layout
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={true} />

      {/* Main content area */}
      <div className="flex-1 ml-56 md:ml-60 lg:ml-64 p-6 overflow-y-auto">
        <Outlet />
      </div>

      {/* Toasts */}
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
