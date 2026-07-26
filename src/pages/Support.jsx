import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../features/auth/authSlice";
import { motion } from "framer-motion";
import { MessageCircle, Send, Bot, Pencil, Check, X } from "lucide-react";
import { getSupport, sendSupport, editSupport } from "../api/supportApi";
import useSupportSocket from "../hooks/useSupportSocket";

// Merge a pushed/created message into the list without duplicating (WS + poll +
// optimistic send can all deliver the same id).
function upsert(list, msg) {
  const i = list.findIndex((m) => m.id === msg.id);
  if (i === -1) return [...list, msg];
  const next = list.slice();
  next[i] = { ...next[i], ...msg };
  return next;
}

function fmtTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function Support() {
  const token = useSelector(selectAuthToken);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const scrollRef = useRef(null);

  const load = async () => {
    try {
      const data = await getSupport(token);
      setConversation(data.conversation || null);
      setMessages(Array.isArray(data.messages) ? data.messages : []);
      setError("");
    } catch (e) {
      setError(e.message || "Could not load support chat.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load + 5s poll fallback (in case the socket drops or is blocked).
  useEffect(() => {
    if (!token) return;
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Live push.
  useSupportSocket(conversation?.id, token, {
    enabled: !!conversation?.id && !!token,
    onMessage: (msg) => setMessages((prev) => upsert(prev, msg)),
    onEdit: (msg) => setMessages((prev) => upsert(prev, msg)),
    onMode: (mode) =>
      setConversation((c) => (c ? { ...c, mode, is_ai: mode === "ai" } : c)),
  });

  // Auto-scroll to newest whenever the message list grows/changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async () => {
    const text = newMessage.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const created = await sendSupport(token, text);
      setNewMessage("");
      if (created && created.id) setMessages((prev) => upsert(prev, created));
      else load();
    } catch (e) {
      setError(e.message || "Message failed to send.");
    } finally {
      setSending(false);
    }
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditText(msg.message ?? msg.body ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    const text = editText.trim();
    if (!text) return;
    try {
      const updated = await editSupport(token, id, text);
      if (updated && updated.id) setMessages((prev) => upsert(prev, updated));
      cancelEdit();
    } catch (e) {
      setError(e.message || "Could not edit message.");
    }
  };

  const isAiMode = conversation?.is_ai;

  const rows = useMemo(() => messages, [messages]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card w-full max-w-3xl sm:max-w-4xl h-[85vh] p-3 sm:p-6 flex flex-col overflow-hidden"
      >
        {/* Header */}
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

        {/* AI-mode banner */}
        {isAiMode && (
          <div className="mb-3 sm:mb-4 flex items-start gap-2.5 rounded-xl border border-brand-100 dark:border-brand-900 bg-brand-50 dark:bg-brand-950/50 px-3 py-2.5 text-sm text-brand-700 dark:text-brand-300">
            <Bot className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              Support is offline right now — you're chatting with our assistant. A
              human will follow up when they're back.
            </p>
          </div>
        )}

        {error && (
          <p className="mb-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto mb-3 sm:mb-4 space-y-2 sm:space-y-3 p-2 sm:p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
        >
          {loading ? (
            <div className="flex items-center justify-center mt-10 text-slate-400 dark:text-slate-500 text-sm animate-pulse">
              Loading conversation…
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-10 text-slate-500 dark:text-slate-400">
              <MessageCircle className="h-10 w-10 mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm sm:text-base">
                No messages yet. Start a conversation!
              </p>
            </div>
          ) : (
            rows.map((msg) => {
              const mine = !!msg.mine;
              const isAi = !!msg.is_ai;
              const editing = editingId === msg.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[80%]">
                    {/* Sender tag for staff / AI */}
                    {!mine && (
                      <div className="flex items-center gap-1.5 mb-1 ml-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {isAi ? (
                          <>
                            <Bot className="h-3.5 w-3.5 text-brand-500" />
                            <span>Assistant</span>
                          </>
                        ) : (
                          <span>{msg.sender_name || "Support"}</span>
                        )}
                      </div>
                    )}

                    {editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit(msg.id)}
                          className="input py-1.5 text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(msg.id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                          aria-label="Save"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          aria-label="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`group px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm sm:text-base break-words shadow-sm ${
                          mine
                            ? "bg-gradient-to-r from-brand-600 to-violet-600 text-white"
                            : isAi
                            ? "bg-white dark:bg-slate-800 border border-brand-100 dark:border-brand-900 text-slate-800 dark:text-slate-200"
                            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <p>{msg.message ?? msg.body}</p>
                        <div
                          className={`mt-1 flex items-center gap-1.5 text-[10px] ${
                            mine ? "text-white/70" : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          <span>{fmtTime(msg.created_at)}</span>
                          {msg.edited_at && <span>· edited</span>}
                          {mine && msg.can_edit && (
                            <button
                              onClick={() => startEdit(msg)}
                              className="inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition hover:underline"
                            >
                              <Pencil className="h-3 w-3" /> edit
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Composer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your message..."
            className="input flex-1"
          />
          <button
            onClick={send}
            disabled={sending || !newMessage.trim()}
            className="btn btn-md btn-primary w-full sm:w-auto"
          >
            {sending ? (
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
