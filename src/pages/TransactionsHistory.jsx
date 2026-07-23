import { useEffect, useState } from "react";
import { getUserAccess } from "../features/auth/token";
import { motion } from "framer-motion";
import { Receipt, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

export default function TransactionsHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getUserAccess();

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${backendBase}/api/deposit/transactions/`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
        <Loader2 className="h-5 w-5 animate-spin text-brand-600 dark:text-brand-400" />
        Loading transaction history...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <div className="container-app py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl mx-auto"
        >
          <div className="mb-6 md:mb-8">
            <p className="eyebrow">Wallet</p>
            <h1 className="mt-2 flex items-center gap-2 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              <Receipt className="h-7 w-7 text-brand-600 dark:text-brand-400" />
              Transaction History
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              A record of all your deposits and payments.
            </p>
          </div>

          {transactions.length === 0 ? (
            <div className="card p-10 text-center">
              <Receipt className="h-10 w-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                No transactions yet.
              </p>
            </div>
          ) : (
            <>
              <div className="block sm:hidden space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="card p-4 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex justify-between mb-1.5">
                      <span className="font-medium text-slate-500 dark:text-slate-400">
                        Date
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{tx.created_at}</span>
                    </div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-medium text-slate-500 dark:text-slate-400">Amount</span>
                      <span className="font-semibold text-slate-900 dark:text-white">₦{tx.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-500 dark:text-slate-400">Status</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          tx.status === "paid"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
                        }`}
                      >
                        {tx.status === "paid" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {tx.status === "paid" ? "Successful" : "Failed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm sm:text-base">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold">Date</th>
                        <th className="py-3 px-4 font-semibold">Amount (₦)</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, i) => (
                        <tr
                          key={tx.id}
                          className={`border-t border-slate-200 dark:border-slate-800 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                            i % 2 === 1 ? "bg-slate-50/50 dark:bg-slate-900/40" : ""
                          }`}
                        >
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{tx.created_at}</td>
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                            {tx.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                                tx.status === "paid"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
                              }`}
                            >
                              {tx.status === "paid" ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              {tx.status === "paid" ? "Successful" : "Failed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
