import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import walletReducer from "../features/wallet/walletSlice";
import boostReducer from "../features/boosts/boostSlice";
import adminAuthReducer from "../features/auth/adminAuth/adminAuthSlice";
import adminDashboardReducer from "../admin/adminDashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    boosts: boostReducer,
    adminAuth: adminAuthReducer,
    adminDashboard: adminDashboardReducer,
  },
});
