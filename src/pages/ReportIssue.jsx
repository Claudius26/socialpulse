import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, ChevronRight, CheckCircle2, LifeBuoy, MessageCircle, ShieldCheck, Loader2,
} from "lucide-react";
import { selectAuthToken } from "../features/auth/authSlice";
import { useContact } from "../components/ContactProvider";
import { ISSUES, ISSUE_BY_ID } from "../lib/issueCatalog";
import RefundRequestModal from "../components/RefundRequestModal";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

/**
 * Guided "Report an Issue" help centre. The user picks a problem, is walked
 * through self-help steps, and ONLY if that doesn't resolve it does the flow
 * escalate — to a proof-backed refund request (for refundable issues, reviewed
 * by the super admin) or to live support (everything else). Refunds are never a
 * bare button; they're the last resort of a deliberate flow.
 */
export default function ReportIssue() {
  const token = useSelector(selectAuthToken);
  const { openContact } = useContact();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const deepNumberId = params.get("number");

  const [issueId, setIssueId] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [stage, setStage] = useState("pick"); // pick | guide | resolved | escalate
  const [numbers, setNumbers] = useState(null); // charged, refund-eligible numbers (lazy)
  const [loadingNums, setLoadingNums] = useState(false);
  const [chosenNumber, setChosenNumber] = useState(null);
  const [refundOpen, setRefundOpen] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(null);

  const issue = issueId ? ISSUE_BY_ID[issueId] : null;

  // Deep link from Rental History: /report-issue?number=<id> jumps straight into
  // the invalid-code walkthrough with that number remembered for the refund step.
  useEffect(() => {
    if (deepNumberId && stage === "pick" && !issueId) {
      setIssueId("invalid_code");
      setStepIdx(0);
      setStage("guide");
    }
    // eslint-disable-next-line
  }, [deepNumberId]);

  const pickIssue = (id) => {
    setIssueId(id);
    setStepIdx(0);
    setStage(ISSUE_BY_ID[id].steps.length ? "guide" : "escalate");
  };

  const nextStep = () => {
    if (issue && stepIdx < issue.steps.length - 1) setStepIdx((i) => i + 1);
    else setStage("escalate");
  };

  const reset = () => {
    setIssueId(null); setStepIdx(0); setStage("pick");
    setChosenNumber(null); setRefundOpen(false); setSubmittedStatus(null);
  };

  // Only load numbers when a refundable issue reaches escalation.
  useEffect(() => {
    if (stage !== "escalate" || !issue?.refundable || numbers !== null) return;
    let alive = true;
    (async () => {
      setLoadingNums(true);
      try {
        const auth = { credentials: "include", headers: { Authorization: `Bearer ${token}` } };
        const [hRes, rRes] = await Promise.all([
          fetch(`${BACKEND_BASE}/api/virtualnumbers/history/`, auth),
          fetch(`${BACKEND_BASE}/api/refund-requests/mine/`, auth),
        ]);
        const hist = hRes.ok ? await hRes.json().catch(() => []) : [];
        const reqs = rRes.ok ? await rRes.json().catch(() => []) : [];
        // A number already carrying a pending/approved request can't be re-filed.
        const blocked = new Set(
          (Array.isArray(reqs) ? reqs : [])
            .filter((r) => r.status === "pending" || r.status === "approved")
            .map((r) => r.number_id)
        );
        const eligible = (Array.isArray(hist) ? hist : []).filter(
          (n) => n.charged && !blocked.has(n.id)
        );
        if (!alive) return;
        setNumbers(eligible);
        // Preselect the deep-linked number if it's eligible.
        if (deepNumberId) {
          const match = eligible.find((n) => String(n.id) === String(deepNumberId));
          if (match) setChosenNumber(match);
        }
      } finally {
        if (alive) setLoadingNums(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line
  }, [stage, issueId]);

  const money = (n) =>
    n?.cost != null ? Number(n.cost).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";

  const Shell = ({ children }) => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app max-w-3xl py-8 md:py-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow">
            <LifeBuoy size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Report an Issue</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Tell us what happened — we'll try to sort it out right here.
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  // ---- Stage: pick an issue -------------------------------------------------
  if (stage === "pick") {
    return (
      <Shell>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          What went wrong?
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {ISSUES.map((it) => (
            <button
              key={it.id}
              onClick={() => pickIssue(it.id)}
              className="group text-left rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 hover:border-brand-400 hover:shadow-md transition flex items-start gap-3"
            >
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shrink-0">
                <it.icon size={20} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-slate-900 dark:text-white">{it.label}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{it.blurb}</span>
              </span>
              <ChevronRight size={18} className="ml-auto text-slate-300 group-hover:text-brand-500 shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </Shell>
    );
  }

  // ---- Stage: guided self-help steps ---------------------------------------
  if (stage === "guide" && issue) {
    const step = issue.steps[stepIdx];
    const last = stepIdx === issue.steps.length - 1;
    return (
      <Shell>
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4">
          <ArrowLeft size={16} /> All issues
        </button>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            {issue.label}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {issue.steps.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full flex-1 ${i <= stepIdx ? "bg-brand-500" : "bg-slate-200 dark:bg-slate-700"}`} />
            ))}
          </div>
          <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
            Step {stepIdx + 1}: {step.title}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">{step.body}</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={() => setStage("resolved")} className="btn btn-md btn-primary flex-1">
              <CheckCircle2 size={18} /> This solved it
            </button>
            <button onClick={nextStep} className="btn btn-md btn-outline flex-1">
              {last ? "Still not working" : "Didn't help — next tip"}
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  // ---- Stage: resolved ------------------------------------------------------
  if (stage === "resolved") {
    return (
      <Shell>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center">
          <CheckCircle2 size={52} className="mx-auto text-emerald-500" />
          <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Glad that helped! 🎉</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Thanks for using SocialPulse.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={reset} className="btn btn-md btn-ghost">Report another issue</button>
            <button onClick={() => navigate("/dashboard")} className="btn btn-md btn-primary">Back to dashboard</button>
          </div>
        </div>
      </Shell>
    );
  }

  // ---- Stage: escalate ------------------------------------------------------
  if (stage === "escalate" && issue) {
    // Non-refundable → route to live support.
    if (!issue.refundable) {
      return (
        <Shell>
          <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4">
            <ArrowLeft size={16} /> All issues
          </button>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center">
            <MessageCircle size={48} className="mx-auto text-brand-500" />
            <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{issue.unresolvedTitle}</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">{issue.unresolvedBody}</p>
            <button onClick={openContact} className="btn btn-md btn-primary mt-6">
              <MessageCircle size={18} /> Chat with support
            </button>
          </div>
        </Shell>
      );
    }

    // Already filed on this visit → confirmation.
    if (submittedStatus) {
      return (
        <Shell>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center">
            <ShieldCheck size={52} className="mx-auto text-emerald-500" />
            <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Your report is with our team</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              The super admin reviews refund requests and credits your wallet if approved. You can track the status in your Rental History.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={reset} className="btn btn-md btn-ghost">Report another issue</button>
              <button onClick={() => navigate("/number_history")} className="btn btn-md btn-primary">View status</button>
            </div>
          </div>
        </Shell>
      );
    }

    // Refundable → pick the affected number, then open the proof form.
    return (
      <Shell>
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4">
          <ArrowLeft size={16} /> All issues
        </button>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{issue.unresolvedTitle}</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">{issue.unresolvedBody}</p>

          <p className="mt-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Which number had the problem?
          </p>

          {loadingNums ? (
            <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading your numbers…
            </div>
          ) : numbers && numbers.length ? (
            <div className="mt-3 space-y-2">
              {numbers.map((n) => (
                <label
                  key={n.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                    chosenNumber?.id === n.id
                      ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/30"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="refund-number"
                    checked={chosenNumber?.id === n.id}
                    onChange={() => setChosenNumber(n)}
                    className="accent-brand-600"
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-sm text-slate-900 dark:text-white">{n.phone_number}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      {n.service} · {n.country} · {money(n)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 text-sm text-slate-500 dark:text-slate-400">
              We couldn't find a charged number that's eligible for a refund request. If you think this is a mistake,{" "}
              <button onClick={openContact} className="text-brand-600 dark:text-brand-400 font-medium underline underline-offset-2">
                chat with support
              </button>.
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setRefundOpen(true)}
              disabled={!chosenNumber}
              className="btn btn-md btn-primary"
            >
              Continue with proof
            </button>
          </div>
        </div>

        {refundOpen && chosenNumber && (
          <RefundRequestModal
            item={chosenNumber}
            token={token}
            issueType={issue.id}
            onClose={() => setRefundOpen(false)}
            onSubmitted={(req) => { setSubmittedStatus(req?.status || "pending"); setRefundOpen(false); }}
          />
        )}
      </Shell>
    );
  }

  return null;
}
