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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card w-full max-w-md p-6 sm:p-8 text-center"
      >
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950">
            <Loader2 className="animate-spin text-amber-600 dark:text-amber-400 w-8 h-8" />
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Payment Pending
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-sm mb-5">
          Your payment is being processed. This may take a few moments.
        </p>

        <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs mb-6 gap-1.5">
          <Clock size={16} />
          <p>
            If not completed within{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {timeLeft}s
            </span>
            , it will automatically be marked as failed.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard")}
          className="btn btn-md btn-primary w-full"
        >
          <Home size={18} /> Return to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}

export default DepositPending;
