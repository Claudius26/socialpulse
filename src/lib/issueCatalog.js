/**
 * The guided "Report an Issue" catalogue.
 *
 * Each issue walks the user through a few self-help steps BEFORE anything is
 * escalated. Only `refundable` issues can end in a refund request (which the
 * super admin reviews); everything else routes to live support. This keeps the
 * refund path deliberate and professional — never a bare "give me my money" button.
 *
 * `id` doubles as the backend `issue_type` slug stored on the refund request.
 */
import {
  ShieldAlert, Ban, MessageSquareOff, TimerReset, Wallet, HelpCircle,
} from "lucide-react";

export const ISSUES = [
  {
    id: "invalid_code",
    label: "The code I received didn't work",
    blurb: "A code arrived but the target app/website rejected it.",
    icon: ShieldAlert,
    refundable: true,
    steps: [
      {
        title: "Enter the code exactly as received",
        body: "Type the full code including any leading zeros, and use it before it expires. Copy-paste to avoid typos, and make sure there are no extra spaces.",
      },
      {
        title: "Check for a second SMS",
        body: "Some services send a fresh code on a retry. Open the number's messages in your Rental History and use the most recent code, then request a resend on the target app if it offers one.",
      },
      {
        title: "Confirm it's the right service",
        body: "The number must be used on the exact service you purchased it for (e.g. a Telegram number only works for Telegram). Using it elsewhere will always be rejected.",
      },
    ],
    unresolvedTitle: "Still rejected? Let's get you refunded.",
    unresolvedBody:
      "If the code genuinely doesn't work on the correct service, you can send us proof and our team will review a refund.",
  },
  {
    id: "rejected_number",
    label: "The number was rejected / not accepted",
    blurb: "The app said the number is already used or not supported.",
    icon: Ban,
    refundable: true,
    steps: [
      {
        title: "Try the exact service again",
        body: "Occasionally the target app rejects a number on the first try but accepts it moments later. Re-enter the number carefully in the correct country format.",
      },
      {
        title: "Make sure the service matches",
        body: "A number bought for one service (say WhatsApp) can be rejected by another. Confirm you selected the same service you're trying to verify.",
      },
    ],
    unresolvedTitle: "Number truly not accepted? We'll review a refund.",
    unresolvedBody:
      "If the platform rejects the number outright, attach a screenshot of the rejection and our team will look into it.",
  },
  {
    id: "no_sms",
    label: "No code / SMS ever arrived",
    blurb: "The number was charged but never received any message.",
    icon: MessageSquareOff,
    refundable: false,
    steps: [
      {
        title: "Give it a couple of minutes",
        body: "Codes can take a moment to route. Keep the number's page open — new messages appear automatically in your Rental History.",
      },
      {
        title: "Trigger the code again",
        body: "Ask the target app to resend the verification code once. Only request it after selecting the correct country for your number.",
      },
    ],
    unresolvedTitle: "Nothing came through?",
    unresolvedBody:
      "Chat with our support team — they can check the number on the provider and help sort it out.",
  },
  {
    id: "expired_early",
    label: "The number expired or stopped too soon",
    blurb: "It stopped working earlier than expected.",
    icon: TimerReset,
    refundable: false,
    steps: [
      {
        title: "Check the expiry window",
        body: "Each number is active for a limited window shown on its card. Verify the time that has passed since purchase in your Rental History.",
      },
    ],
    unresolvedTitle: "Ended earlier than it should have?",
    unresolvedBody: "Let our support team take a look with you.",
  },
  {
    id: "deposit_not_credited",
    label: "My deposit didn't reach my wallet",
    blurb: "You paid but the balance didn't update.",
    icon: Wallet,
    refundable: false,
    steps: [
      {
        title: "Refresh and check Transactions",
        body: "Some payments confirm after a short delay. Open Transactions to see if the deposit is listed as pending or completed.",
      },
    ],
    unresolvedTitle: "Balance still missing?",
    unresolvedBody:
      "Contact support with your payment reference and we'll trace the deposit right away.",
  },
  {
    id: "other",
    label: "Something else",
    blurb: "A different problem or a general question.",
    icon: HelpCircle,
    refundable: false,
    steps: [],
    unresolvedTitle: "Talk to a human",
    unresolvedBody: "Our support team is happy to help with anything not listed here.",
  },
];

export const ISSUE_BY_ID = Object.fromEntries(ISSUES.map((i) => [i.id, i]));

// Slug -> short human label, shared with the admin panels.
export const ISSUE_LABELS = {
  invalid_code: "Invalid code",
  rejected_number: "Rejected number",
  no_sms: "No SMS received",
  expired_early: "Expired early",
  deposit_not_credited: "Deposit issue",
  other: "Other",
};
