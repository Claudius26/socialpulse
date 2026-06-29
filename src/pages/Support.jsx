import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthToken, selectCurrentUser } from "../features/auth/authSlice";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";

const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

function Support() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/support/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendBase}/api/support/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card w-full max-w-3xl sm:max-w-4xl h-[85vh] p-3 sm:p-6 flex flex-col overflow-hidden"
      >
        <div className="flex items-center gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-slate-200 dark:border-slate-800">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-600/20">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="eyebrow">Support</p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Support Chat
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 space-y-2 sm:space-y-3 p-2 sm:p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-10 text-slate-500 dark:text-slate-400">
              <MessageCircle className="h-10 w-10 mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm sm:text-base">
                No messages yet. Start a conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl max-w-[80%] text-sm sm:text-base break-words shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-brand-600 to-violet-600 text-white"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="input flex-1"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="btn btn-md btn-primary w-full sm:w-auto"
          >
            {loading ? (
              "..."
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Support;
