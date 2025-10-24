import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { XCircle, Home } from "lucide-react";

function DepositFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-950 to-gray-900 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 text-center text-white"
      >
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-400 w-16 h-16" />
        </div>

        <h2 className="text-3xl sm:text-2xl font-bold bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent mb-3">
          Payment Failed
        </h2>

        <p className="text-gray-300 text-base sm:text-sm mb-4">
          Unfortunately, your payment could not be completed.
        </p>
        <p className="text-gray-400 text-sm sm:text-xs mb-8">
          Please try again or contact support if the issue persists.
        </p>

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

export default DepositFailed;
