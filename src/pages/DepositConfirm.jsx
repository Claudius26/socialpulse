import { useNavigate, useLocation } from "react-router";
import { getUserAccess } from "../features/auth/token";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, CreditCard, Bitcoin } from "lucide-react";
import { selectCurrentUser } from "../features/auth/authSlice";

function DepositConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("flutterwave");
  // The deposit is in the user's own WALLET currency (not an IP guess).
  const currency = user?.wallet?.currency || "NGN";
  const [loading, setLoading] = useState(false);

   const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setAmount(params.get("amount") || "");
    setMethod(params.get("method") || "flutterwave");
  }, [location.search]);

  // Endpoint + response-URL key per method. Paystack is kept for later but not
  // offered on the deposit page right now.
  const METHOD_CONFIG = {
    flutterwave: { endpoint: "/api/deposit/flutterwave/create/", urlKey: "authorization_url", label: "Card / Bank (Flutterwave)" },
    crypto: { endpoint: "/api/deposit/crypto/create/", urlKey: "invoice_url", label: "Crypto (USDT, BTC …)" },
    paystack: { endpoint: "/api/deposit/create/", urlKey: "authorization_url", label: "Card / Bank (Paystack)" },
  };
  const cfg = METHOD_CONFIG[method] || METHOD_CONFIG.flutterwave;
  const isCrypto = method === "crypto";
  const methodLabel = cfg.label;

  const handleConfirm = async () => {
    if (!amount) {
      alert("Enter a valid amount");
      return;
    }

    setLoading(true);
    const token = getUserAccess();

    try {
      const res = await fetch(`${backendBase}${cfg.endpoint}`, {
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

      // Flutterwave/Paystack return authorization_url; NOWPayments -> invoice_url.
      const url = data[cfg.urlKey];
      if (!url) {
        alert("Could not start payment. Please try again.");
        return;
      }
      window.location.href = url;
    } catch (err) {
      console.error("Error creating deposit:", err);
      setLoading(false);
      alert("Network error. Try again.");
    }
  };

  const handleBack = () => navigate("/deposits");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="card w-full max-w-md p-6 sm:p-8 space-y-6"
      >
        <div className="text-center">
          <p className="eyebrow">Checkout</p>
          <h2 className="text-2xl font-bold heading-gradient mt-1">
            Confirm Deposit
          </h2>
        </div>

        <div className="space-y-4 text-center">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You’re about to deposit
            </p>
            <span className="block text-3xl font-extrabold mt-2 text-slate-900 dark:text-white">
              {amount} {currency}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {isCrypto
              ? <Bitcoin className="text-brand-600 dark:text-brand-400" size={18} />
              : <CreditCard className="text-brand-600 dark:text-brand-400" size={18} />}
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Payment Method:
              <span className="ml-1 text-slate-900 dark:text-white font-semibold">
                {methodLabel}
              </span>
            </p>
          </div>

          {isCrypto && (
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              You'll be taken to a secure crypto checkout. Your wallet is credited
              automatically once the payment confirms.
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
          <button
            onClick={handleBack}
            className="btn btn-md btn-outline w-full sm:w-1/3"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="btn btn-md btn-primary w-full sm:w-2/3"
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
