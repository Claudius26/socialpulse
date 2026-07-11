import { createBrowserRouter } from "react-router";
import Register from "../../pages/Register";
import Landing from "../../pages/Landing";
import Layout from "../Layout";
import Login from "../../pages/Login";
import ForgotPassword from "../../pages/ForgotPassword";
import VerifyEmail from "../../pages/VerifyEmail";
import Terms from "../../pages/Terms";
import Privacy from "../../pages/Privacy";
import Dashboard from "../../pages/Dashboard";
import Deposits from "../../pages/Deposits";
import DepositConfirm from "../../pages/DepositConfirm";
import DepositSuccess from "../../pages/DepositSuccess";
import Faq from "../../pages/Faq";
import TransactionsHistory from "../../pages/TransactionsHistory";
import DepositCallback from "../../pages/DepositCallback";
import DepositFailed from "../../pages/DepositFailed";
import DepositPending from "../../pages/DepositPending";
import Profile from "../../pages/Profile";
import ChangePassword from "../../pages/ChangePassword";
import ExploreBoosts from "../../pages/ExploreBoosts";
import Support from "../../pages/Support";
import Boost from "../../pages/Boost";
import BoostHistory from "../../pages/BoostHistory";
import VirtualNumbers from "../../pages/VirtualNumber";
import NumberHistory from "../../pages/NumberHistory";
import UsaNumbers from "../../pages/UsaNumbers";
import Developer from "../../pages/Developer";
import ApiDocs from "../../pages/ApiDocs";

import AdminLogin from "../../admin/pages/AdminLogin";
import AdminDashboard from "../../admin/pages/AdminDashboard";
import AdminUsers from "../../admin/pages/AdminUsers";
import AdminNumbers from "../../admin/pages/AdminNumbers";
import AdminDeposits from "../../admin/pages/AdminDeposits";
import AdminProfile from "../../admin/pages/AdminProfile";
import AdminCardpulse from "../../admin/pages/AdminCardpulse";
import AdminTrends from "../../admin/pages/AdminTrends";
import AdminUserDetail from "../../admin/pages/AdminUserDetail";
import AdminFinance from "../../admin/pages/AdminFinance";
import AdminRevenue from "../../admin/pages/AdminRevenue";
import AdminLayout from "../../admin/layout/AdminLayout";
import AdminProtectedRoute from "../../admin/components/AdminProtectedRoute";
import ProtectedRoute from "../ProtectedRoute";

const authed = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/dashboard", element: authed(<Dashboard />) },
      { path: "/deposits", element: authed(<Deposits/>) },
      { path: "/deposit/confirm", element: authed(<DepositConfirm />) },
      { path: "/deposit/success", element: <DepositSuccess /> },
      { path: "/faq", element: <Faq /> },
      { path: "/transactions", element: authed(<TransactionsHistory />) },
      { path: "/deposit/callback", element: <DepositCallback /> },
      { path: "/deposit/failed", element: <DepositFailed /> },
      { path: "/deposit/pending", element: <DepositPending /> },
      { path: "/profile", element: authed(<Profile />) },
      { path: "/change-password", element: authed(<ChangePassword />) },
      { path: "/explore_boost", element: authed(<ExploreBoosts />) },
      { path: "/support", element: <Support /> },
      { path: "/terms", element: <Terms /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/boost", element: authed(<Boost />) },
      { path: "/boost_history", element: authed(<BoostHistory />) },
      { path: "/usa_numbers", element: authed(<UsaNumbers />) },
      { path: "/virtual_numbers", element: authed(<VirtualNumbers />) },
      { path: "/number_history", element: authed(<NumberHistory />) },
      { path: "/developer", element: authed(<Developer />) },

    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/account/api_docs", element: authed(<ApiDocs />) },
  { path: "/admin/login", element: <AdminLogin /> },

  {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminUsers />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/users/socialpulse",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminUsers app="socialpulse" />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/users/cardpulse",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminUsers app="cardpulse" />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/users/:id",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminUserDetail />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/finance",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminFinance />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/revenue",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminRevenue />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/numbers",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminNumbers />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/deposits",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminDeposits />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/cardpulse",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminCardpulse />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/trends",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminTrends />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminProfile />
        </AdminLayout>
      </AdminProtectedRoute>
    ),
  },
]);


export default router;
