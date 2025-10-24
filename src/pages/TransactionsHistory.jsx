import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TransactionsHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/deposit/transactions/", {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
        Loading transaction history...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-b from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-10 px-3 sm:px-6 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-4 sm:p-8 overflow-hidden"
      >
        <h2 className="text-xl sm:text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-4 sm:mb-6">
          Transaction History
        </h2>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            No transactions yet.
          </p>
        ) : (
          <>
            {/* Mobile stacked view */}
            <div className="block sm:hidden space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white/60 dark:bg-gray-700/60 rounded-xl shadow-sm p-4 text-sm text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Date:
                    </span>
                    <span>{tx.created_at}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Amount:</span>
                    <span>₦{tx.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Method:</span>
                    <span>{tx.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        tx.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.status === "paid" ? "Successful" : "Failed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="bg-blue-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <th className="py-3 px-4 rounded-tl-lg">Date</th>
                    <th className="py-3 px-4">Amount (₦)</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="py-3 px-4">{tx.created_at}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                        {tx.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">{tx.method}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            tx.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status === "paid" ? "Successful" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
