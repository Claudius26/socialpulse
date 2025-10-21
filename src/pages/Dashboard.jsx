import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUser, logout, selectCurrentUser, selectAuthToken } from "../features/auth/authSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          dispatch(logout());
          navigate("/login");
          return;
        }

        const data = await response.json();
        if (response.ok) {
          dispatch(setUser({ user: data.user, token }));
          setWallet(data.user.wallet);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, dispatch, navigate]);

  const formatCurrency = (amount, currency) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency || "NGN",
        minimumFractionDigits: 2,
      }).format(amount || 0);
    } catch {
      return `${currency || "₦"}${(amount || 0).toFixed(2)}`;
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading dashboard...</p>;
  if (!user) return <p className="text-center mt-10 text-gray-600">User not logged in</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Profile Section */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">User Information</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Name:</span> {user.full_name || "N/A"}</p>
          <p><span className="font-semibold">Email:</span> {user.email || "N/A"}</p>
          <p><span className="font-semibold">Phone Number:</span> {user.phone || "N/A"}</p>
          <p><span className="font-semibold">Country:</span> {user.country || "N/A"}</p>
        </div>
        <p className="mt-4 text-gray-600">
          Wallet Balance: <span className="font-semibold">{formatCurrency(wallet?.balance, wallet?.currency)}</span>
        </p>
      </div>

      
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        
        <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Wallet Balance</p>
            <p className="text-xl font-bold">{formatCurrency(wallet?.balance, wallet?.currency)}</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            Recharge
          </button>
        </div>

       
        <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Virtual Account</p>
            <p className="text-sm text-blue-600">Click to show</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            Show Account
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Numbers Purchased - Lifetime</p>
            <p className="text-lg font-bold">{user.numbersPurchased || 0}</p>
          </div>
          <button className="text-blue-600 text-sm">➡️</button>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Recharge Lifetime</p>
          <p className="text-xl font-bold">{formatCurrency(user.totalRecharge || 0, wallet?.currency)}</p>
        </div>
      </div>

     
      <div className="w-full max-w-4xl bg-white rounded-xl shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-md font-semibold">Number Purchase History</p>
          <button className="text-blue-600 text-sm">View All</button>
        </div>
        <p className="text-gray-500 text-sm">
          {user.numberHistory?.length ? "" : "No Recent Numbers Yet."}
        </p>
      </div>
      <div className="w-full max-w-4xl bg-white rounded-xl shadow p-4 mb-10">
        <div className="flex justify-between items-center mb-2">
          <p className="text-md font-semibold">Recent Transactions</p>
          <button className="text-blue-600 text-sm">View All</button>
        </div>
        <p className="text-gray-500 text-sm">
          {user.transactions?.length ? "" : "No Recent Transactions"}
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Deposit Funds</h3>
          <ul className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Deposit Funds".</li>
            <li>Enter the amount you want to deposit.</li>
            <li>Choose your preferred payment method.</li>
            <li>Confirm and complete the payment.</li>
            <li>Check your wallet for updated balance.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-green-600 mb-4">Buy Virtual Numbers</h3>
          <ul className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Buy Numbers".</li>
            <li>Choose the country and type of number.</li>
            <li>Enter your payment details.</li>
            <li>Confirm purchase.</li>
            <li>Receive your virtual number instantly.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-purple-600 mb-4">Boost Social Media</h3>
          <ul className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Boost Social Media".</li>
            <li>Select the platform (Instagram, TikTok, etc.).</li>
            <li>Choose the type of boost (likes, followers, views).</li>
            <li>Enter your account details.</li>
            <li>Confirm and process payment.</li>
            <li>Watch your account grow!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
