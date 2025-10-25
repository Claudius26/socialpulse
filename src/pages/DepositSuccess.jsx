import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

function DepositSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const depositId = params.get("deposit_id");
    const reference = params.get("reference");
      console.log("Deposit Success Params:", { depositId, reference });

    if (!depositId) {
      navigate("/dashboard");
      return;
    }

    const token = localStorage.getItem("access_token");

    const fetchDeposit = async () => {
      try {
        const res = await fetch(
          `${backendBase}/api/deposit/status/${depositId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        console.log("Deposit API response:", data);
        console.log("Wallet balance from backend:", data.balance);

        setDeposit(data);

        localStorage.setItem("wallet_balance", data.balance);
        window.dispatchEvent(new Event("walletUpdate"));
      } catch (err) {
        console.error("Failed to fetch deposit info:", err);
        alert("Failed to fetch deposit info.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposit();
  }, [location.search, navigate]);

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading deposit info...</p>;

  if (!deposit)
    return (
      <p className="text-center mt-10 text-red-500">
        Deposit not found or still processing.
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Payment Successful!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
          You’ve successfully credited your wallet with{" "}
          <span className="font-semibold text-blue-700">
            ₦{deposit.amount.toLocaleString()}
          </span>
          .
        </p>
        <div className="mt-4 mb-6 bg-green-50 dark:bg-green-900 p-3 rounded-lg">
          <p className="text-green-700 dark:text-green-300">
            Current Wallet Balance:{" "}
            <span className="font-semibold">
              ₦{deposit.balance.toLocaleString()}
            </span>
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default DepositSuccess;
