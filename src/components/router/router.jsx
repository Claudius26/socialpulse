import { createBrowserRouter } from "react-router";
import Register from "../../pages/Register";
import Landing from "../../pages/Landing";
import Layout from "../Layout";
import Login from "../../pages/Login";
import Dashboard from "../../pages/Dashboard";
import Deposits from "../../pages/Deposits";
import DepositConfirm from "../../pages/DepositConfirm";
import DepositSuccess from "../../pages/DepositSuccess";
import Faq from "../../pages/Faq";
import TransactionsHistory from "../../pages/TransactionsHistory";
import DepositCallback from "../../pages/DepositCallBack";
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


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/deposits", element: <Deposits/> },
      { path: "/deposit/confirm", element: <DepositConfirm /> },
      { path: "/deposit/success", element: <DepositSuccess /> },
      { path: "/faq", element: <Faq /> },
      { path: "/transactions", element: <TransactionsHistory /> },
      { path: "/deposit/callback", element: <DepositCallback /> },
      { path: "/deposit/failed", element: <DepositFailed /> },
      { path: "/deposit/pending", element: <DepositPending /> },
      { path: "/profile", element: <Profile /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: "/explore_boost", element: <ExploreBoosts /> },
      { path: "/support", element: <Support /> },
      { path: "/boost", element: <Boost /> },
      { path: "/boost_history", element: <BoostHistory /> },
      { path: "/virtual_numbers", element: <VirtualNumbers /> },
      { path: "/number_history", element: <NumberHistory /> },
      
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> }

]);

export default router;
