import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, CreditCard, Bitcoin } from "lucide-react";
import { selectCurrentUser } from "../features/auth/authSlice";

const SYMBOLS = { NGN: "₦", GHS: "₵", KES: "KSh", ZAR: "R", XOF: "CFA", XAF: "FCFA", UGX: "USh", USD: "$" };

const METHODS = [
  { id: "flutterwave", label: "Card / Bank", icon: CreditCard, hint: "Via Flutterwave" },
  { id: "crypto", label: "Crypto", icon: Bitcoin, hint: "USDT, BTC & more" },
];

function Deposits() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("flutterwave");
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const cur = user?.wallet?.currency || "NGN";
  const sym = SYMBOLS[cur] || `${cur} `;

  const handleNext = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    navigate(`/deposit/confirm?amount=${amount}&method=${method}`);
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

          <div>
            <label className="label">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {METHODS.map((m) => {
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border p-4 transition ${
                      active
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-950/50 ring-2 ring-brand-500/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <m.icon size={22} className={active ? "text-brand-600 dark:text-brand-400" : "text-slate-500"} />
                    <span className={`text-sm font-medium ${active ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                      {m.label}
                    </span>
                    <span className="text-[11px] text-slate-400">{m.hint}</span>
                  </button>
                );
              })}
            </div>
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
            {method === "crypto"
              ? "Pay in crypto — your wallet is credited automatically after confirmation."
              : "You'll be charged the equivalent in NGN at checkout."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Deposits;
