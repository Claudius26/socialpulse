import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { ToastContainer, Slide } from "react-toastify";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { selectCurrentUser } from "../features/auth/authSlice";

function Layout() {
  const user = useSelector(selectCurrentUser);

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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 overflow-hidden">
     
      <aside className="w-44 sm:w-52 md:w-60 lg:w-64 h-screen bg-white shadow-md flex-shrink-0">
        <Sidebar />
      </aside>

    
      <main className="flex-1 h-screen overflow-y-auto">
        <Outlet />
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
