import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import walletReducer from "../features/wallet/walletSlice";
import boostReducer from "../features/boosts/boostSlice";
import adminAuthReducer from "../features/auth/adminAuth/adminAuthSlice";
import adminDashboardReducer from "../admin/adminDashboardSlice";
import adminDataReducer from "../admin/adminDataSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    boosts: boostReducer,
    adminAuth: adminAuthReducer,
    adminDashboard: adminDashboardReducer,
    // Cache for every admin dataset — see adminDataSlice. This is what makes
    // admin navigation instant instead of refetching from zero each time.
    adminData: adminDataReducer,
  },
});
