import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App.jsx";
import "./App.css";
import { applyTheme, getInitialTheme } from "./utils/theme";

// Apply the saved (or OS) theme before rendering so EVERY route — including
// pages outside the Layout like Login/Register — reflects dark mode on load.
applyTheme(getInitialTheme());

// NOTE: We intentionally do NOT wrap in <StrictMode>. StrictMode double-mounts
// every component in development (mount → unmount → remount), which replayed
// the dashboard's entrance animation and re-ran its data fetch — looking like
// the page "rendered twice". It has no effect in production, but removing it
// makes screens mount exactly once everywhere.
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
