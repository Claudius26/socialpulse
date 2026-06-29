import { useState } from "react";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const BASE = (import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000") + "/api/v1";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "authentication", label: "Authentication" },
  { id: "base-url", label: "Base URL" },
  { id: "quick-start", label: "Quick Start" },
  { id: "list-numbers", label: "List numbers" },
  { id: "purchase", label: "Purchase a number" },
  { id: "get-sms", label: "Get the SMS" },
  { id: "cancel", label: "Cancel a number" },
  { id: "balance", label: "Check balance" },
];

function Code({ children, id }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };
  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute right-3 top-3 inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
        aria-label="copy"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-xs leading-relaxed border border-slate-800">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Method({ verb }) {
  const tint =
    verb === "GET"
      ? "bg-emerald-100 text-emerald-700"
      : verb === "POST"
      ? "bg-brand-100 text-brand-700"
      : "bg-slate-100 text-slate-700";
  return <span className={`text-xs font-bold px-2 py-0.5 rounded ${tint}`}>{verb}</span>;
}

function Endpoint({ id, title, verb, path, children }) {
  return (
    <section id={id} className="scroll-mt-24 pt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <Method verb={verb} />
        <code className="text-slate-700 dark:text-slate-300 break-all">{path}</code>
      </div>
      <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  );
}

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 text-white text-sm font-bold">
              SP
            </span>
            <span className="font-bold text-slate-900 dark:text-white">SocialPulse API Docs</span>
          </div>
          <Link to="/developer" className="text-sm text-brand-600 dark:text-brand-400 inline-flex items-center gap-1">
            <ArrowLeft size={15} /> Back to API settings
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 py-10">
          <nav className="sticky top-24 space-y-1">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="block px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 py-10 pb-24">
          <section id="overview" className="scroll-mt-24">
            <p className="eyebrow">Developer API</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">API Documentation</h1>
            <p className="mt-4 max-w-2xl">
              The SocialPulse API lets you purchase virtual numbers and read their SMS codes
              programmatically from your own backend. Purchases are billed to your separate{" "}
              <strong>API credit</strong> balance, funded from your main wallet.
            </p>
          </section>

          <section id="authentication" className="scroll-mt-24 pt-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication</h2>
            <p className="mt-3 text-sm">
              Authenticate every request with your API key in the <code>Authorization</code> header.
              You can view and regenerate your key on the API settings page. Keep it secret — anyone
              with your key can spend your API credit.
            </p>
            <div className="mt-4">
              <Code>{`Authorization: Api-Key YOUR_API_KEY`}</Code>
            </div>
          </section>

          <section id="base-url" className="scroll-mt-24 pt-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Base URL</h2>
            <p className="mt-3 text-sm">All endpoints are relative to this base URL:</p>
            <div className="mt-4">
              <Code>{BASE}</Code>
            </div>
          </section>

          <section id="quick-start" className="scroll-mt-24 pt-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Start</h2>
            <ol className="mt-3 space-y-2 text-sm list-decimal list-inside">
              <li>Generate your API key on the API settings page.</li>
              <li>Top up your API credit (move funds from your wallet).</li>
              <li>
                Include <code>Authorization: Api-Key YOUR_API_KEY</code> on every request.
              </li>
              <li>List numbers, purchase one, then poll for the SMS.</li>
            </ol>
            <div className="mt-4">
              <Code>{`# List available US WhatsApp numbers
curl "${BASE}/numbers/?country=US&service=whatsapp" \\
  -H "Authorization: Api-Key YOUR_API_KEY"`}</Code>
            </div>
          </section>

          <Endpoint id="list-numbers" title="List available numbers" verb="GET" path="/numbers/?country={country}&service={service}">
            <p>Returns the available number pools for a country/service, with prices and success rates.</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Example request</p>
            <Code>{`curl "${BASE}/numbers/?country=US&service=whatsapp" \\
  -H "Authorization: Api-Key YOUR_API_KEY"`}</Code>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Example response</p>
            <Code>{`{
  "country": "US",
  "service": "whatsapp",
  "numbers": [
    { "pool_id": 7, "name": "Generic", "success_rate": 56, "price": 3304.8 }
  ]
}`}</Code>
          </Endpoint>

          <Endpoint id="purchase" title="Purchase a number" verb="POST" path="/numbers/purchase/">
            <p>Rents a number and holds its cost from your API credit. Body parameters:</p>
            <Code>{`curl -X POST "${BASE}/numbers/purchase/" \\
  -H "Authorization: Api-Key YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"service":"whatsapp","country":"US","pool_id":"7"}'`}</Code>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Example response</p>
            <Code>{`{
  "activation_id": "EQR2GPUM",
  "number": "16605281002",
  "service": "whatsapp",
  "country": "US",
  "cost": 3304.8,
  "status": "Pending"
}`}</Code>
          </Endpoint>

          <Endpoint id="get-sms" title="Get the SMS" verb="GET" path="/numbers/{activation_id}/sms/">
            <p>
              Poll this until the code arrives. While waiting it returns <code>pending</code>; once
              received, your API credit is charged and the code is returned.
            </p>
            <Code>{`curl "${BASE}/numbers/EQR2GPUM/sms/" \\
  -H "Authorization: Api-Key YOUR_API_KEY"`}</Code>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Example response</p>
            <Code>{`{ "status": "received", "sms": "123456" }`}</Code>
          </Endpoint>

          <Endpoint id="cancel" title="Cancel a number" verb="POST" path="/numbers/{activation_id}/cancel/">
            <p>Cancels a number that hasn't received an SMS and releases the held credit.</p>
            <Code>{`curl -X POST "${BASE}/numbers/EQR2GPUM/cancel/" \\
  -H "Authorization: Api-Key YOUR_API_KEY"`}</Code>
          </Endpoint>

          <Endpoint id="balance" title="Check balance" verb="GET" path="/balance/">
            <p>Returns your available API credit.</p>
            <Code>{`curl "${BASE}/balance/" \\
  -H "Authorization: Api-Key YOUR_API_KEY"`}</Code>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Example response</p>
            <Code>{`{ "api_balance": 5000.0, "api_available": 1695.2, "currency": "NGN" }`}</Code>
          </Endpoint>
        </main>
      </div>
    </div>
  );
}
