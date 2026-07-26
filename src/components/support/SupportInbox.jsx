import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageCircle, Send, Bot, User, Pencil, Check, X, Lock,
  RotateCcw, UserCog, Phone,
} from "lucide-react";
import useSupportSocket from "../../hooks/useSupportSocket";

// Shared two-pane support inbox used by BOTH the super-admin (/admin/support) and
// the referral-admin panel (/panel/support). The two pages differ only in theme
// (accent), whether the viewer is the super admin (isSuperView -> can reassign),
// whether the WhatsApp escalation button shows, and which bound API object they
// pass (adminApi with a token vs panelApi that carries its token internally).
//
// Everything here is READ-ONLY over the socket; every write goes through `api`.

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
    return new Date(iso).toLocaleString([], {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function fmtClock(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function SupportInbox({
  token,
  accent,
  isSuperView = false,
  api,
  showWhatsApp = false,
}) {
  const [conversations, setConversations] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [admins, setAdmins] = useState([]);

  const scrollRef = useRef(null);
  const whatsapp = import.meta.env.VITE_SUPPORT_WHATSAPP;

  const loadInbox = async () => {
    try {
      const data = await api.inbox();
      setConversations(Array.isArray(data?.conversations) ? data.conversations : []);
      setError("");
    } catch (e) {
      setError(e.message || "Could not load conversations.");
    } finally {
      setLoadingInbox(false);
    }
  };

  const loadThread = async (id) => {
    if (!id) return;
    setLoadingThread(true);
    try {
      const data = await api.thread(id);
      setConversation(data?.conversation || null);
      setMessages(Array.isArray(data?.messages) ? data.messages : []);
      setError("");
    } catch (e) {
      setError(e.message || "Could not load this conversation.");
    } finally {
      setLoadingThread(false);
    }
  };

  // Inbox poll every 8s.
  useEffect(() => {
    loadInbox();
    const t = setInterval(loadInbox, 8000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Super admin loads the assignee list once.
  useEffect(() => {
    if (!isSuperView || !api.listAdmins) return;
    api
      .listAdmins()
      .then((data) => setAdmins(Array.isArray(data) ? data : data?.admins || []))
      .catch(() => setAdmins([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperView]);

  // Open a thread when the selection changes.
  useEffect(() => {
    if (openId) loadThread(openId);
    else {
      setConversation(null);
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);

  // Live push for the open thread.
  useSupportSocket(openId, token, {
    enabled: !!openId && !!token,
    onMessage: (msg) => setMessages((prev) => upsert(prev, msg)),
    onEdit: (msg) => setMessages((prev) => upsert(prev, msg)),
    onMode: (mode) => {
      setConversation((c) => (c ? { ...c, mode, is_ai: mode === "ai" } : c));
      loadInbox();
    },
    onAssigned: () => {
      // The handler (and therefore can_reply for this viewer) changed — refetch.
      loadThread(openId);
      loadInbox();
    },
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const canReply = !!conversation?.can_reply;

  const sendReply = async () => {
    const text = reply.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const created = await api.reply(openId, text);
      setReply("");
      if (created && created.id) setMessages((prev) => upsert(prev, created));
      loadInbox();
    } catch (e) {
      setError(e.message || "Reply failed.");
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
      const updated = await api.editMessage(id, text);
      if (updated && updated.id) setMessages((prev) => upsert(prev, updated));
      cancelEdit();
    } catch (e) {
      setError(e.message || "Could not edit message.");
    }
  };

  const toggleMode = async () => {
    const next = conversation?.is_ai ? "human" : "ai";
    try {
      await api.setMode(openId, next);
      await loadThread(openId);
      loadInbox();
    } catch (e) {
      setError(e.message || "Could not change mode.");
    }
  };

  const doAssign = async (adminId) => {
    if (!adminId) return;
    try {
      await api.assign(openId, adminId);
      await loadThread(openId);
      loadInbox();
    } catch (e) {
      setError(e.message || "Could not reassign.");
    }
  };

  // Assignee options: non-suspended referral admins + "Me (super admin)".
  const assignOptions = useMemo(
    () =>
      admins.filter(
        (a) => !a.suspended && !a.admin_suspended && a.role !== "superadmin"
      ),
    [admins]
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageCircle /> Support
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {isSuperView
            ? "Every customer support thread. Reply to the ones you handle, hand a chat to the AI, or reassign it to a referral admin."
            : "Support threads from your referred customers. Reply, or hand a chat to the AI assistant when you're away."}
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        {/* Left: thread list */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden lg:h-[72vh] flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Conversations
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingInbox ? (
              <p className="p-4 text-sm text-slate-400 animate-pulse">Loading…</p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-slate-400">No conversations yet.</p>
            ) : (
              conversations.map((c) => {
                const active = c.id === openId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setOpenId(c.id)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-800 transition ${
                      active
                        ? `${accent.activeBg} border-l-2 ${accent.activeBorder}`
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate flex-1">
                        {c.customer_name || c.customer_email || "Customer"}
                      </p>
                      {c.unread > 0 && (
                        <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full bg-gradient-to-r ${accent.gradient}`}>
                          {c.unread}
                        </span>
                      )}
                    </div>
                    {c.customer_email && (
                      <p className="text-[11px] text-slate-400 truncate">{c.customer_email}</p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {c.last_message || "—"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          c.is_ai
                            ? "bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-400"
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {c.is_ai ? <Bot size={10} /> : <User size={10} />}
                        {c.is_ai ? "AI" : "Human"}
                      </span>
                      {isSuperView && c.handler_name && (
                        <span className="text-[10px] text-slate-400 truncate">
                          · {c.handler_name}
                          {c.handler_is_super ? " (super)" : ""}
                        </span>
                      )}
                      {c.last_message_at && (
                        <span className="text-[10px] text-slate-400 ml-auto">
                          {fmtTime(c.last_message_at)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: open thread */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden lg:h-[72vh] flex flex-col">
          {!openId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 p-6">
              <MessageCircle className="h-10 w-10 mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm">Select a conversation to view it.</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 flex-wrap">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white bg-gradient-to-r ${accent.gradient} shrink-0`}>
                  <User className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {conversation?.customer_name || conversation?.customer_email || "Customer"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {conversation?.customer_email}
                    {isSuperView && conversation?.handler_name
                      ? ` · handler: ${conversation.handler_name}`
                      : ""}
                  </p>
                </div>

                {/* Mode toggle (handler only) */}
                {canReply && (
                  <button
                    onClick={toggleMode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {conversation?.is_ai ? (
                      <>
                        <RotateCcw size={14} /> Reopen
                      </>
                    ) : (
                      <>
                        <Bot size={14} /> Hand to AI
                      </>
                    )}
                  </button>
                )}

                {/* Escalate to super admin (panel only) */}
                {showWhatsApp && whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    title="Message the super admin on WhatsApp"
                  >
                    <Phone size={14} /> Super admin
                  </a>
                )}

                {/* Assign (super admin only) */}
                {isSuperView && (
                  <div className="inline-flex items-center gap-1.5">
                    <UserCog size={14} className="text-slate-400" />
                    <select
                      value=""
                      onChange={(e) => doAssign(e.target.value)}
                      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200"
                    >
                      <option value="">Assign to…</option>
                      <option value="self">Me (super admin)</option>
                      {assignOptions.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.full_name || a.username}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* AI-mode notice */}
              {conversation?.is_ai && (
                <div className="px-4 py-2 text-xs bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border-b border-brand-100 dark:border-brand-900 flex items-center gap-2">
                  <Bot size={14} /> This chat is handled by the AI assistant.
                </div>
              )}

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950"
              >
                {loadingThread ? (
                  <p className="text-sm text-slate-400 animate-pulse text-center mt-6">Loading…</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center mt-6">No messages yet.</p>
                ) : (
                  messages.map((msg) => {
                    // "mine" = this staff viewer's own message (right side). The
                    // customer and other staff sit on the left.
                    const mine = !!msg.mine;
                    const isAi = !!msg.is_ai;
                    const isCustomer = msg.sender === "user";
                    const editing = editingId === msg.id;
                    return (
                      <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className="max-w-[80%]">
                          {!mine && (
                            <div className="flex items-center gap-1.5 mb-1 ml-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {isAi ? (
                                <>
                                  <Bot className="h-3.5 w-3.5 text-brand-500" /> Assistant
                                </>
                              ) : isCustomer ? (
                                <span>{msg.sender_name || "Customer"}</span>
                              ) : (
                                <span>{msg.sender_name || "Staff"}</span>
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
                              className={`group px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm break-words shadow-sm ${
                                mine
                                  ? `bg-gradient-to-r ${accent.gradient} text-white`
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
                                <span>{fmtClock(msg.created_at)}</span>
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

              {/* Composer / read-only notice */}
              {canReply ? (
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendReply()}
                    placeholder="Type a reply…"
                    className="input flex-1"
                  />
                  <button
                    onClick={sendReply}
                    disabled={sending || !reply.trim()}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r ${accent.gradient} disabled:opacity-50 shrink-0`}
                  >
                    <Send className="h-4 w-4" />
                    {sending ? "…" : "Send"}
                  </button>
                </div>
              ) : (
                <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 px-3 py-2.5 text-sm text-amber-700 dark:text-amber-400">
                    <Lock size={15} className="shrink-0" />
                    <span>Read-only — you are not the handler of this chat.</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
