import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, CreditCard } from "lucide-react";

function DepositConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Paystack");
  const [currency, setCurrency] = useState("NGN");
  const [loading, setLoading] = useState(false);

   const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";  

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
      const res = await fetch(`${backendBase}/api/deposit/create/`, {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-950 to-gray-900 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 space-y-6 text-white"
      >
        <h2 className="text-3xl sm:text-2xl font-bold text-center bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
          Confirm Deposit
        </h2>

        <div className="space-y-4 text-center">
          <p className="text-lg sm:text-base text-blue-100">
            You’re about to deposit
            <br />
            <span className="block text-3xl sm:text-2xl font-extrabold mt-2 text-blue-400">
              {amount} {currency}
            </span>
          </p>

          <div className="flex items-center justify-center gap-2 mt-3">
            <CreditCard className="text-blue-400" size={18} />
            <p className="text-sm sm:text-xs text-blue-200 font-medium">
              Payment Method:
              <span className="ml-1 text-blue-400 font-semibold">{method}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 w-full sm:w-1/3 py-3 rounded-xl border border-blue-600 text-blue-300 hover:bg-blue-900/40 hover:text-white transition-all duration-200 font-semibold"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`w-full sm:w-2/3 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-800/50 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Processing...
              </>
            ) : (
              "Confirm & Pay"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DepositConfirm;
