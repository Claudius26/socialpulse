import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Wallet, ArrowRight } from "lucide-react";

function Deposits() {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!amount || Number(amount) < 1000) {
      alert("Minimum deposit is ₦1000");
      return;
    }
    navigate(`/deposit/confirm?amount=${amount}&method=paystack`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-950 to-gray-900 overflow-hidden px-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 text-white"
      >
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          <Wallet className="text-blue-400 w-10 h-10 sm:w-12 sm:h-12" />

          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
            Deposit Funds
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm">
            Add money to your wallet securely
          </p>
        </div>

        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-[11px] sm:text-sm text-gray-300 mb-1">
              Enter Amount (₦)
            </label>
            <input
              type="number"
              placeholder="Minimum ₦1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none text-xs sm:text-sm"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full py-2 sm:py-2.5 rounded-lg font-semibold text-white shadow-md flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-200 text-xs sm:text-sm"
          >
            Next <ArrowRight size={16} />
          </motion.button>

          <p className="text-center text-gray-400 text-[11px] sm:text-xs mt-2">
            Minimum deposit: ₦1000
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Deposits;
