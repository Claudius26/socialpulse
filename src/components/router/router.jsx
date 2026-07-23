import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

// Eager: the shells, route guards, and the public entry pages (landing/auth),
// so the very first paint never waits on a lazy chunk.
import Layout from "../Layout";
import ProtectedRoute from "../ProtectedRoute";
import Landing from "../../pages/Landing";
import Login from "../../pages/Login";
import Register from "../../pages/Register";

// Lazy: everything else loads only when its route is visited — this keeps the
// initial bundle small so login/landing load fast.
const ForgotPassword = lazy(() => import("../../pages/ForgotPassword"));
const VerifyEmail = lazy(() => import("../../pages/VerifyEmail"));
const Terms = lazy(() => import("../../pages/Terms"));
const Privacy = lazy(() => import("../../pages/Privacy"));
const Dashboard = lazy(() => import("../../pages/Dashboard"));
const Deposits = lazy(() => import("../../pages/Deposits"));
const DepositConfirm = lazy(() => import("../../pages/DepositConfirm"));
const DepositSuccess = lazy(() => import("../../pages/DepositSuccess"));
const Faq = lazy(() => import("../../pages/Faq"));
const TransactionsHistory = lazy(() => import("../../pages/TransactionsHistory"));
const DepositCallback = lazy(() => import("../../pages/DepositCallback"));
const DepositFailed = lazy(() => import("../../pages/DepositFailed"));
const DepositPending = lazy(() => import("../../pages/DepositPending"));
const Profile = lazy(() => import("../../pages/Profile"));
const ChangePassword = lazy(() => import("../../pages/ChangePassword"));
const ExploreBoosts = lazy(() => import("../../pages/ExploreBoosts"));
const Support = lazy(() => import("../../pages/Support"));
const Boost = lazy(() => import("../../pages/Boost"));
const BoostHistory = lazy(() => import("../../pages/BoostHistory"));
const VirtualNumbers = lazy(() => import("../../pages/VirtualNumber"));
const Esim = lazy(() => import("../../pages/Esim"));
const RentNumber = lazy(() => import("../../pages/RentNumber"));
const NumberHistory = lazy(() => import("../../pages/NumberHistory"));
const UsaNumbers = lazy(() => import("../../pages/UsaNumbers"));
const Developer = lazy(() => import("../../pages/Developer"));
const ApiDocs = lazy(() => import("../../pages/ApiDocs"));

// The admin shell is lazy too. It used to be a static import, which shipped
// AdminLayout + AdminSidebar + the admin guard in the MAIN bundle — downloaded by
// every anonymous visitor to the landing page, who will never see the admin.
const AdminProtectedRoute = lazy(() => import("../../admin/components/AdminProtectedRoute"));
const AdminLayout = lazy(() => import("../../admin/layout/AdminLayout"));

const AdminLogin = lazy(() => import("../../admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../../admin/pages/AdminDashboard"));
const AdminUsers = lazy(() => import("../../admin/pages/AdminUsers"));
const AdminNumbers = lazy(() => import("../../admin/pages/AdminNumbers"));
const AdminDeposits = lazy(() => import("../../admin/pages/AdminDeposits"));
const AdminAds = lazy(() => import("../../admin/pages/AdminAds"));
const AdminProfile = lazy(() => import("../../admin/pages/AdminProfile"));
const AdminCardpulse = lazy(() => import("../../admin/pages/AdminCardpulse"));
const AdminTrends = lazy(() => import("../../admin/pages/AdminTrends"));
const AdminUserDetail = lazy(() => import("../../admin/pages/AdminUserDetail"));
const AdminFinance = lazy(() => import("../../admin/pages/AdminFinance"));
const AdminRevenue = lazy(() => import("../../admin/pages/AdminRevenue"));
const AdminEsims = lazy(() => import("../../admin/pages/AdminEsims"));
const AdminRentals = lazy(() => import("../../admin/pages/AdminRentals"));
const AdminAdmins = lazy(() => import("../../admin/pages/AdminAdmins"));
const ApiHealth = lazy(() => import("../../admin/pages/ApiHealth"));

// The regular referral-admin panel — a separate area with its own shell.
const PanelLayout = lazy(() => import("../../panel/layout/PanelLayout"));
const PanelDashboard = lazy(() => import("../../panel/pages/PanelDashboard"));
const PanelUsers = lazy(() => import("../../panel/pages/PanelUsers"));
const PanelUserDetail = lazy(() => import("../../panel/pages/PanelUserDetail"));
const PanelAds = lazy(() => import("../../panel/pages/PanelAds"));

const PageFallback = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">Loading…</p>
  </div>
);

const s = (el) => <Suspense fallback={<PageFallback />}>{el}</Suspense>;
const authed = (el) => <ProtectedRoute>{s(el)}</ProtectedRoute>;
// Super-admin area: requires role=superadmin. A regular admin who forces one of
// these URLs is bounced to their own panel by the guard.
const adminEl = (el) => (
  <Suspense fallback={<PageFallback />}>
    <AdminProtectedRoute requireRole="superadmin">
      <AdminLayout>{s(el)}</AdminLayout>
    </AdminProtectedRoute>
  </Suspense>
);
// Regular referral-admin panel: requires role=admin. The super admin who lands
// here is bounced to /admin/dashboard.
const panelEl = (el) => (
  <Suspense fallback={<PageFallback />}>
    <AdminProtectedRoute requireRole="admin">
      <PanelLayout>{s(el)}</PanelLayout>
    </AdminProtectedRoute>
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/dashboard", element: authed(<Dashboard />) },
      { path: "/deposits", element: authed(<Deposits />) },
      { path: "/deposit/confirm", element: authed(<DepositConfirm />) },
      { path: "/deposit/success", element: s(<DepositSuccess />) },
      { path: "/faq", element: s(<Faq />) },
      { path: "/transactions", element: authed(<TransactionsHistory />) },
      { path: "/deposit/callback", element: s(<DepositCallback />) },
      { path: "/deposit/failed", element: s(<DepositFailed />) },
      { path: "/deposit/pending", element: s(<DepositPending />) },
      { path: "/profile", element: authed(<Profile />) },
      { path: "/change-password", element: authed(<ChangePassword />) },
      { path: "/explore_boost", element: authed(<ExploreBoosts />) },
      { path: "/support", element: s(<Support />) },
      { path: "/terms", element: s(<Terms />) },
      { path: "/privacy", element: s(<Privacy />) },
      { path: "/boost", element: authed(<Boost />) },
      { path: "/boost_history", element: authed(<BoostHistory />) },
      { path: "/usa_numbers", element: authed(<UsaNumbers />) },
      { path: "/virtual_numbers", element: authed(<VirtualNumbers />) },
      { path: "/esim", element: authed(<Esim />) },
      { path: "/rent_number", element: authed(<RentNumber />) },
      { path: "/number_history", element: authed(<NumberHistory />) },
      { path: "/developer", element: authed(<Developer />) },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: s(<ForgotPassword />) },
  { path: "/verify-email", element: s(<VerifyEmail />) },
  { path: "/account/api_docs", element: authed(<ApiDocs />) },
  { path: "/admin/login", element: s(<AdminLogin />) },

  { path: "/admin/dashboard", element: adminEl(<AdminDashboard />) },
  { path: "/admin/users", element: adminEl(<AdminUsers />) },
  { path: "/admin/users/socialpulse", element: adminEl(<AdminUsers app="socialpulse" />) },
  { path: "/admin/users/cardpulse", element: adminEl(<AdminUsers app="cardpulse" />) },
  { path: "/admin/users/:id", element: adminEl(<AdminUserDetail />) },
  { path: "/admin/finance", element: adminEl(<AdminFinance />) },
  { path: "/admin/revenue", element: adminEl(<AdminRevenue />) },
  { path: "/admin/numbers", element: adminEl(<AdminNumbers />) },
  { path: "/admin/esims", element: adminEl(<AdminEsims />) },
  { path: "/admin/rentals", element: adminEl(<AdminRentals />) },
  { path: "/admin/deposits", element: adminEl(<AdminDeposits />) },
  { path: "/admin/ads", element: adminEl(<AdminAds />) },
  { path: "/admin/cardpulse", element: adminEl(<AdminCardpulse />) },
  { path: "/admin/trends", element: adminEl(<AdminTrends />) },
  { path: "/admin/admins", element: adminEl(<AdminAdmins />) },
  { path: "/admin/api-health", element: adminEl(<ApiHealth />) },
  { path: "/admin/profile", element: adminEl(<AdminProfile />) },

  // Regular referral-admin panel (role=admin) — separate shell, scoped data.
  { path: "/panel/dashboard", element: panelEl(<PanelDashboard />) },
  { path: "/panel/users", element: panelEl(<PanelUsers />) },
  { path: "/panel/users/:id", element: panelEl(<PanelUserDetail />) },
  { path: "/panel/ads", element: panelEl(<PanelAds />) },
  { path: "/panel/api-health", element: panelEl(<ApiHealth />) },
]);

export default router;
