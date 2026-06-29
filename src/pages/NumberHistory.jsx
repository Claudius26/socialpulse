import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Globe, Phone, RefreshCcw, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectAuthToken } from "../features/auth/authSlice";


export default function NumberHistory() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_BASE;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/virtualnumbers/history/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch number history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [backendUrl, user]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="eyebrow flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Virtual Numbers
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
            Number <span className="heading-gradient">History</span>
          </h1>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 className="animate-spin text-brand-500 w-8 h-8" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading your numbers...</p>
          </div>
        ) : error ? (
          <div className="card max-w-md mx-auto p-8 text-center mt-6 border-rose-200 dark:border-rose-900">
            <p className="font-medium text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="card max-w-md mx-auto p-10 text-center mt-6">
            <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Phone className="w-7 h-7" />
            </span>
            <h3 className="font-semibold text-slate-900 dark:text-white">No numbers found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Purchased numbers will appear here once you buy one.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <motion.div
                key={item.id}
                className="card card-hover p-5 flex flex-col justify-between"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 shrink-0">
                        <Phone className="w-5 h-5" />
                      </span>
                      <span className="font-semibold text-base text-slate-900 dark:text-white truncate">
                        {item.number || "N/A"}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                        item.status === "Active"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>{item.country || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>{item.service || "Unknown Service"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>
                        Created:{" "}
                        {new Date(item.created_at).toLocaleString("en-GB")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>
                        Expires:{" "}
                        {item.expires_at
                          ? new Date(item.expires_at).toLocaleString("en-GB")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
