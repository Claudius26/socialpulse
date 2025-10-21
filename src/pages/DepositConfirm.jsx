import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";

function DepositConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Paystack");
  const [currency, setCurrency] = useState("NGN");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const amt = params.get("amount");
    setAmount(amt || "");

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => setCurrency(data.currency || "NGN"))
      .catch(() => setCurrency("NGN"));
  }, [location.search]);

  const handleConfirm = async () => {
    if (!amount) {
      alert("Enter a valid amount");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("http://localhost:8000/api/deposit/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "Payment failed");
        return;
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("Error creating deposit:", err);
      setLoading(false);
      alert("Network error. Try again.");
    }
  };

  const handleBack = () => navigate("/deposits");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-400">
          Confirm Deposit
        </h2>

        <div className="space-y-4 text-gray-800 dark:text-gray-200">
          <p className="text-center text-lg">
            You’re about to deposit:
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {" "}
              {amount} {currency}
            </span>
          </p>
          <p className="text-center">
            Payment Method:
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {" "}
              {method}
            </span>
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={handleBack}
            className="w-1/3 py-2 border rounded-lg border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`w-1/2 text-white py-2 rounded-lg font-semibold transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DepositConfirm;
