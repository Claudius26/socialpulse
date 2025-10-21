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
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6">
      <motion.h1
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Virtual Number History
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-10">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No numbers found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="text-blue-600 w-5 h-5" />
                    <span className="font-semibold text-lg">
                      {item.number || "N/A"}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span>{item.country || "Unknown"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RefreshCcw className="w-4 h-4 text-gray-500" />
                    <span>{item.service || "Unknown Service"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>
                      Created:{" "}
                      {new Date(item.created_at).toLocaleString("en-GB")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
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
  );
}
