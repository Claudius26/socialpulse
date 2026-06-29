import { useEffect, useState } from "react";
import {
  KeyRound,
  Plus,
  Trash2,
  Copy,
  Check,
  Wallet,
  Code2,
  ShieldCheck,
  ArrowRightLeft,
} from "lucide-react";

const BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

export default function Developer() {
  const token = localStorage.getItem("access_token");
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [credit, setCredit] = useState(null);
  const [keys, setKeys] = useState([]);
  const [newKey, setNewKey] = useState(null); // full key shown once
  const [keyName, setKeyName] = useState("");
  const [topupAmount, setTopupAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  };

  const loadCredit = async () => {
    const r = await fetch(`${BASE}/api/developer/credit/`, { headers: authHeaders });
    if (r.ok) setCredit(await r.json());
  };
  const loadKeys = async () => {
    const r = await fetch(`${BASE}/api/developer/keys/`, { headers: authHeaders });
    if (r.ok) setKeys(await r.json());
  };

  useEffect(() => {
    loadCredit();
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createKey = async () => {
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch(`${BASE}/api/developer/keys/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ name: keyName || "Default" }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed to create key");
      setNewKey(data.key);
      setKeyName("");
      loadKeys();
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  const revokeKey = async (id) => {
    await fetch(`${BASE}/api/developer/keys/${id}/revoke/`, { method: "POST", headers: authHeaders });
    loadKeys();
  };

  const topup = async () => {
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch(`${BASE}/api/developer/credit/topup/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ amount: topupAmount }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Top-up failed");
      setTopupAmount("");
      setMsg("✅ API credit topped up.");
      loadCredit();
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  const cur = credit?.currency || "NGN";
  const docBlocks = [
    {
      id: "list",
      title: "List available numbers",
      code: `curl "${BASE}/api/v1/numbers/?country=US&service=whatsapp" \\
  -H "Authorization: Api-Key YOUR_API_KEY"`,
    },
    {
      id: "buy",
      title: "Purchase a number",
      code: `curl -X POST "${BASE}/api/v1/numbers/purchase/" \\
  -H "Authorization: Api-Key YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"service":"whatsapp","country":"US","pool_id":"5"}'`,
    },
    {
      id: "sms",
      title: "Fetch the SMS code",
      code: `curl "${BASE}/api/v1/numbers/ACTIVATION_ID/sms/" \\
  -H "Authorization: Api-Key YOUR_API_KEY"`,
    },
    {
      id: "cancel",
      title: "Cancel a number",
      code: `curl -X POST "${BASE}/api/v1/numbers/ACTIVATION_ID/cancel/" \\
  -H "Authorization: Api-Key YOUR_API_KEY"`,
    },
    {
      id: "bal",
      title: "Check API credit balance",
      code: `curl "${BASE}/api/v1/balance/" \\
  -H "Authorization: Api-Key YOUR_API_KEY"`,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12 max-w-4xl">
        <div className="mb-8">
          <p className="eyebrow flex items-center gap-2">
            <Code2 className="w-4 h-4" /> Developers
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
            API <span className="heading-gradient">Access</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base">
            Purchase numbers programmatically from your own backend. Authenticate with an API key and
            pay from your separate API credit balance.
          </p>
        </div>

        {/* API credit */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-brand-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">API Credit</h2>
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
          <label className="label flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-brand-500" /> Move funds from wallet → API credit
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              min="1"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              placeholder={`Amount in ${cur}`}
              className="input"
            />
            <button onClick={topup} disabled={busy || !topupAmount} className="btn btn-md btn-primary shrink-0">
              Top up
            </button>
          </div>
        </div>

        {/* API keys */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-brand-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">API Keys</h2>
          </div>

          {newKey && (
            <div className="mb-5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                Copy your new key now — it won't be shown again.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm break-all text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700">
                  {newKey}
                </code>
                <button onClick={() => copy(newKey, "newkey")} className="btn btn-sm btn-outline shrink-0">
                  {copied === "newkey" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Key name (e.g. Production)"
              className="input"
            />
            <button onClick={createKey} disabled={busy} className="btn btn-md btn-primary shrink-0">
              <Plus className="w-4 h-4" /> New key
            </button>
          </div>

          <div className="space-y-3">
            {keys.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">No API keys yet.</p>
            )}
            {keys.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{k.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{k.prefix}…</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      k.is_active
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {k.is_active ? "Active" : "Revoked"}
                  </span>
                  {k.is_active && (
                    <button
                      onClick={() => revokeKey(k.id)}
                      className="text-rose-600 hover:text-rose-700 transition"
                      title="Revoke key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {msg && (
          <div className="mb-6 text-sm text-center text-slate-700 dark:text-slate-300 bg-brand-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
            {msg}
          </div>
        )}

        {/* Docs */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-brand-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Quick start</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
            Send your key in the <code className="text-brand-600 dark:text-brand-400">Authorization</code> header
            as <code className="text-brand-600 dark:text-brand-400">Api-Key YOUR_API_KEY</code>. Base URL:{" "}
            <code className="text-brand-600 dark:text-brand-400 break-all">{BASE}/api/v1</code>
          </p>
          <div className="space-y-4">
            {docBlocks.map((b) => (
              <div key={b.id}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{b.title}</p>
                  <button onClick={() => copy(b.code, b.id)} className="text-xs text-brand-600 dark:text-brand-400 inline-flex items-center gap-1">
                    {copied === b.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
                <pre className="text-xs overflow-x-auto rounded-xl bg-slate-900 dark:bg-black text-slate-100 p-4 border border-slate-800">
                  <code>{b.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
