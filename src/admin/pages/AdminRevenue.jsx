import { useState } from "react";
import { BadgeDollarSign, TrendingUp } from "lucide-react";
import { fakeTransactions, fakeTotalRevenue, fakeDateRange, nairaFull } from "../data/fakeRevenue";

const TINT = {
  "Virtual Number": "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400",
  "Social Boost": "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400",
  "Giftcard": "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400",
  "Crypto Deposit": "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  "Wallet Funding": "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
};

export default function AdminRevenue() {
  const [limit, setLimit] = useState(100);
  const shown = fakeTransactions.slice(0, limit);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Total Revenue</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Platform earnings from {fakeDateRange.from} to {fakeDateRange.to}
        </p>
      </div>

      {/* Headline */}
      <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/80">Total Revenue</p>
            <p className="text-4xl font-extrabold mt-2 tabular-nums">{nairaFull(fakeTotalRevenue)}</p>
            <p className="text-xs text-white/80 mt-2">
              {fakeTransactions.length.toLocaleString()} transactions · since June 2021 · and growing
            </p>
          </div>
          <span className="grid place-items-center w-12 h-12 rounded-xl bg-white/20"><BadgeDollarSign size={24} /></span>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((t) => (
              <tr key={t.id} className="border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200">
                <td className="p-4 text-slate-500 whitespace-nowrap">{t.date}</td>
                <td className="p-4">{t.user}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${TINT[t.service] || TINT["Wallet Funding"]}`}>
                    {t.service}
                  </span>
                </td>
                <td className="p-4 text-right tabular-nums font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  +{nairaFull(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {limit < fakeTransactions.length && (
        <div className="text-center mt-4">
          <button
            onClick={() => setLimit((l) => l + 200)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <TrendingUp size={16} /> Load more ({(fakeTransactions.length - limit).toLocaleString()} more)
          </button>
        </div>
      )}
    </div>
  );
}
