import { Outlet } from "react-router";
import { useEffect } from "react";
import { ToastContainer, Slide } from "react-toastify";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToHash from "../components/ScrollToHash";
import ContactProvider from "../components/ContactProvider";
import ReviewPrompt from "../components/ReviewPrompt";
import AdCenter from "../components/AdCenter";
import { applyTheme, getInitialTheme } from "../utils/theme";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken } from "../features/auth/authSlice";
import { fetchBoostCatalogue } from "../features/boosts/catalogue";

function Layout() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);

    useEffect(() => {
    applyTheme(getInitialTheme());
  }, []);

  // Load the boost catalogue as soon as the app opens (any page), so the Boost
  // page has every platform/type/price ready before the user gets there.
  useEffect(() => {
    dispatch(fetchBoostCatalogue(token));
  }, [dispatch, token]);
  return (
    <ContactProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-x-hidden">

        <ScrollToHash />
        <NavBar />

        <main className="flex-grow pt-16 overflow-x-hidden">
          <Outlet />
        </main>

        <footer className="mt-auto z-10">
          <Footer />
        </footer>

        <AdCenter />

        <ReviewPrompt />

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
    </ContactProvider>
  );
}

export default Layout;