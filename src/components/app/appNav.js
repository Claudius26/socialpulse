import {
  LayoutDashboard, Wallet, Phone, Globe, TrendingUp, Wifi, RefreshCw, Code2,
  History, Receipt, BarChart3, Headphones, HelpCircle, LifeBuoy, UserCircle,
  KeyRound, Layers, Clock, User,
} from "lucide-react";

// The 5 major pages: always visible in the sidebar (desktop) and drawer.
export const PRIMARY = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/deposits", label: "Fund Wallet", icon: Wallet },
  { to: "/usa_numbers", label: "USA Numbers", icon: Phone, highlight: true },
  { to: "/virtual_numbers", label: "All Countries Numbers", icon: Globe },
  { to: "/boost", label: "Boost Social Media", icon: TrendingUp },
];

// Everything else, grouped. A group opens when clicked (and starts open when
// you're already on one of its pages).
export const GROUPS = [
  {
    id: "services",
    label: "More services",
    icon: Layers,
    items: [
      { to: "/esim", label: "Buy eSIM", icon: Wifi },
      { to: "/rent_number", label: "Rent US Number", icon: RefreshCw },
      { to: "/explore_boost", label: "Explore Boosts", icon: TrendingUp },
      { to: "/developer", label: "Developer API", icon: Code2 },
    ],
  },
  {
    id: "history",
    label: "History",
    icon: Clock,
    items: [
      { to: "/number_history", label: "Numbers Purchased", icon: History },
      { to: "/transactions", label: "Transactions", icon: Receipt },
      { to: "/boost_history", label: "Boost History", icon: BarChart3 },
    ],
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    items: [
      { to: "/support", label: "Support Chat", icon: Headphones },
      { to: "/faq", label: "FAQs", icon: HelpCircle },
      { to: "/report-issue", label: "Report an Issue", icon: LifeBuoy },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: User,
    items: [
      { to: "/profile", label: "Profile", icon: UserCircle },
      { to: "/change-password", label: "Change Password", icon: KeyRound },
    ],
  },
];

// Mobile bottom tab bar: 4 destinations + "More" (opens the drawer).
export const TABS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/usa_numbers", label: "USA", icon: Phone },
  { to: "/deposits", label: "Fund", icon: Wallet, center: true },
  { to: "/boost", label: "Boost", icon: TrendingUp },
];

const EXTRA_TITLES = {
  "/terms": "Terms of Service",
  "/privacy": "Privacy Policy",
  "/refund-policy": "Refund Policy",
  "/deposit/confirm": "Confirm Deposit",
  "/deposit/success": "Deposit Successful",
  "/deposit/failed": "Deposit Failed",
  "/deposit/pending": "Deposit Pending",
  "/deposit/callback": "Payment",
};

export function titleFor(pathname) {
  const all = [...PRIMARY, ...GROUPS.flatMap((g) => g.items)];
  const hit = all.find((i) => pathname === i.to || pathname.startsWith(i.to + "/"));
  return hit?.label || EXTRA_TITLES[pathname] || "SocialPulse";
}
