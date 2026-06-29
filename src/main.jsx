import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App.jsx";
import "./App.css";
import { applyTheme, getInitialTheme } from "./utils/theme";

// Apply the saved (or OS) theme before rendering so EVERY route — including
// pages outside the Layout like Login/Register — reflects dark mode on load.
applyTheme(getInitialTheme());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
