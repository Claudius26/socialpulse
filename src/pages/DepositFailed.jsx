import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { XCircle, Home } from "lucide-react";

function DepositFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card w-full max-w-md p-6 sm:p-8 text-center"
      >
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950">
            <XCircle className="text-rose-600 dark:text-rose-400 w-9 h-9" />
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Payment Failed
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
          Unfortunately, your payment could not be completed.
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-8">
          Please try again or contact support if the issue persists.
        </p>

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

export default DepositFailed;
