import { useEffect, useState } from "react";
import {
  KeyRound,
  Copy,
  Check,
  Wallet,
  Eye,
  EyeOff,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Lock,
  Server,
  EyeOff as EyeOffIcon,
} from "lucide-react";

const BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";
const DOCS_URL = "/account/api_docs";

export default function Developer() {
  const token = localStorage.getItem("access_token");
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [keyData, setKeyData] = useState(null); // { has_key, key, prefix }
  const [showKey, setShowKey] = useState(false);
  const [credit, setCredit] = useState(null);
  const [topupAmount, setTopupAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadKey = async () => {
    const r = await fetch(`${BASE}/api/developer/key/`, { headers: authHeaders });
    if (r.ok) setKeyData(await r.json());
  };
  const loadCredit = async () => {
    const r = await fetch(`${BASE}/api/developer/credit/`, { headers: authHeaders });
    if (r.ok) setCredit(await r.json());
  };

  useEffect(() => {
    loadKey();
    loadCredit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const regenerate = async () => {
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch(`${BASE}/api/developer/key/`, { method: "POST", headers: authHeaders });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      setKeyData(data);
      setShowKey(true);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  const copyKey = async () => {
    if (!keyData?.key) return;
    try {
      await navigator.clipboard.writeText(keyData.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const moveCredit = async (direction) => {
    const amount = direction === "topup" ? topupAmount : withdrawAmount;
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch(`${BASE}/api/developer/credit/${direction}/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ amount }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      setTopupAmount("");
      setWithdrawAmount("");
      setMsg(direction === "topup" ? "✅ Moved to API credit." : "✅ Moved back to wallet.");
      loadCredit();
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  const cur = credit?.currency || "NGN";
  const hasKey = keyData?.has_key;
  const fullKey = keyData?.key || null;
  const masked = "•".repeat(44);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">API Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your API access key and integrate SocialPulse into your applications
          </p>
        </div>

        {/* ===== Your API Key ===== */}
        <div className="card p-6 mb-6">
          <div className="flex items-start gap-3 mb-5">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shrink-0">
              <KeyRound size={20} />
            </span>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Your API Key</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Use this key to authenticate API requests
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Access token</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 min-w-0 truncate font-mono text-sm text-slate-800 dark:text-slate-200">
                {!hasKey
                  ? "No key yet — generate one below"
                  : !fullKey
                  ? "•••••••••• (regenerate to view a new key)"
                  : showKey
                  ? fullKey
                  : masked}
              </code>
              {hasKey && fullKey && (
                <>
                  <button
                    onClick={() => setShowKey((v) => !v)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition shrink-0"
                    title={showKey ? "Hide" : "Show"}
                  >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={copyKey}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition shrink-0"
                    title="Copy"
                  >
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-500" />
              Keep this key secret. Never share it publicly.
            </p>
            <button onClick={regenerate} disabled={busy} className="btn btn-md btn-primary shrink-0">
              <RefreshCw size={16} />
              {hasKey ? "Regenerate Key" : "Generate Key"}
            </button>
          </div>
        </div>

        {/* ===== API Credit ===== */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-brand-500" />
            <h2 className="font-bold text-slate-900 dark:text-white">API Credit</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl bg-brand-50 dark:bg-brand-950 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Available API credit</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {cur} {Number(credit?.api_available ?? 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Main wallet balance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {cur} {Number(credit?.wallet_balance ?? 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Wallet → API credit</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder={`Amount (${cur})`}
                  className="input"
                />
                <button onClick={() => moveCredit("topup")} disabled={busy || !topupAmount} className="btn btn-md btn-primary shrink-0">
                  Move
                </button>
              </div>
            </div>
            <div>
              <label className="label">API credit → Wallet</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Amount (${cur})`}
                  className="input"
                />
                <button onClick={() => moveCredit("withdraw")} disabled={busy || !withdrawAmount} className="btn btn-md btn-outline shrink-0">
                  Move back
                </button>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            API credit is funded only from your wallet — there is no free credit.
          </p>
        </div>

        {msg && (
          <div className="mb-6 text-sm text-center text-slate-700 dark:text-slate-300 bg-brand-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
            {msg}
          </div>
        )}

        {/* ===== API Documentation banner ===== */}
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-6 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 p-6 text-white"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-white/20 shrink-0">
                <BookOpen size={20} />
              </span>
              <div>
                <h2 className="font-bold">API Documentation</h2>
                <p className="text-sm text-white/85">Full endpoint reference, examples, and response formats</p>
              </div>
            </div>
            <span className="btn btn-md bg-white text-brand-700 hover:bg-slate-100 shrink-0">
              View Documentation <ArrowRight size={16} />
            </span>
          </div>
        </a>

        {/* ===== Security Best Practices ===== */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-slate-900 dark:text-white">Security Best Practices</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: Lock, title: "Use environment variables", desc: "Never hardcode your API key in source code." },
              { icon: RefreshCw, title: "Rotate regularly", desc: "Regenerate your key periodically for safety." },
              { icon: Server, title: "Server-side only", desc: "Make API calls from your backend, not the frontend." },
              { icon: EyeOffIcon, title: "Keep it private", desc: "Never share your key in public repos or chats." },
            ].map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="flex gap-3">
                  <Icon size={18} className="text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{t.title}</p>
                    <p className="text-slate-500 dark:text-slate-400">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
