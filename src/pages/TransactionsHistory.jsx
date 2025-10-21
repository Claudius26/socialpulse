import { useEffect, useState } from "react";

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading transaction history...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6 flex justify-center">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-6">
          Transaction History
        </h2>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No transactions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  <th className="py-3 px-4 rounded-tl-lg">Date</th>
                  <th className="py-3 px-4">Amount (₦)</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
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
        )}
      </div>
    </div>
  );
}
