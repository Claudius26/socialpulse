import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthToken, selectCurrentUser } from "../features/auth/authSlice";
import { motion } from "framer-motion";

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
      const res = await fetch("/api/support/", {
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="
          w-full 
          max-w-3xl 
          sm:max-w-4xl 
          h-[85vh] 
          bg-white dark:bg-gray-800 
          shadow-2xl rounded-2xl 
          p-3 sm:p-6 flex flex-col 
          overflow-hidden
        "
      >
        <h2 className="text-lg sm:text-2xl font-semibold text-center mb-3 sm:mb-4 text-blue-700 dark:text-blue-300">
          Support Chat
        </h2>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 space-y-2 sm:space-y-3 p-2 sm:p-4 border rounded-xl bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-blue-400">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-10">
              No messages yet. Start a conversation!
            </p>
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
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input field and Send button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-gray-200"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`w-full sm:w-auto text-center text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Support;
