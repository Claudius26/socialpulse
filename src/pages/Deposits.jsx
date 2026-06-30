import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Wallet, ArrowRight } from "lucide-react";
import { selectCurrentUser } from "../features/auth/authSlice";

const SYMBOLS = { NGN: "₦", GHS: "₵", KES: "KSh", ZAR: "R", XOF: "CFA", XAF: "FCFA", UGX: "USh", USD: "$" };

function Deposits() {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const cur = user?.wallet?.currency || "NGN";
  const sym = SYMBOLS[cur] || `${cur} `;

  const handleNext = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    navigate(`/deposit/confirm?amount=${amount}&method=paystack`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card w-full max-w-md p-6 sm:p-8"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950">
            <Wallet className="text-brand-600 dark:text-brand-400 w-7 h-7" />
          </span>

          <h2 className="text-2xl font-bold heading-gradient">Deposit Funds</h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Add money to your wallet securely
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="label">Enter Amount ({sym})</label>
            <input
              type="number"
              placeholder={`Amount in ${cur}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="btn btn-md btn-primary w-full"
          >
            Next <ArrowRight size={16} />
          </motion.button>

          <p className="text-center text-slate-500 dark:text-slate-400 text-xs">
            You'll be charged the equivalent in NGN at checkout.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Deposits;
