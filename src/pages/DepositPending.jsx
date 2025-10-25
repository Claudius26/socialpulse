import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Loader2, Clock, Home } from "lucide-react";
import { motion } from "framer-motion";

function DepositPending() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(120);

   const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const depositId = params.get("deposit_id");
    const token = localStorage.getItem("access_token");

    if (!depositId) {
      navigate("/dashboard");
      return;
    }

    let intervalId;
    let timerId;

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `${backendBase}/api/deposit/status/${depositId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to check deposit status");
        const data = await res.json();

        if (data.status === "paid") {
          clearInterval(intervalId);
          clearTimeout(timerId);
          navigate(`/deposit/success?deposit_id=${depositId}`);
        } else if (data.status === "failed") {
          clearInterval(intervalId);
          clearTimeout(timerId);
          navigate(`/deposit/failed?deposit_id=${depositId}`);
        }
      } catch (err) {
        console.error("Error checking deposit:", err);
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 2000);

    timerId = setTimeout(async () => {
      clearInterval(intervalId);
      try {
        await fetch(`http://localhost:8000/api/deposit/status/${depositId}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "failed" }),
        });
      } catch (err) {
        console.error("Timeout marking deposit failed:", err);
      }
      navigate(`/deposit/failed?deposit_id=${depositId}`);
    }, 120000);

    const countdown = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timerId);
      clearInterval(countdown);
    };
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 text-center text-white"
      >
        <div className="flex justify-center mb-4">
          <Loader2 className="animate-spin text-blue-400 w-14 h-14" />
        </div>

        <h2 className="text-3xl sm:text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-400 bg-clip-text text-transparent mb-3">
          Payment Pending
        </h2>

        <p className="text-gray-300 text-base sm:text-sm mb-4">
          Your payment is being processed. This may take a few moments.
        </p>

        <div className="flex items-center justify-center text-gray-400 text-sm sm:text-xs mb-6 gap-1">
          <Clock size={16} />
          <p>
            If not completed within{" "}
            <span className="font-semibold text-blue-400">{timeLeft}s</span>, it
            will automatically be marked as failed.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-200"
        >
          <Home size={18} /> Return to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}

export default DepositPending;
