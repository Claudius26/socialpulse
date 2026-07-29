import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import walletReducer from "../features/wallet/walletSlice";
import boostReducer from "../features/boosts/boostSlice";

// Customer store — the admin & super-admin consoles are separate apps.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    boosts: boostReducer,
  },
});
