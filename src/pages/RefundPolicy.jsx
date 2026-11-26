import { Link } from "react-router";
import { ReceiptText } from "lucide-react";
import LegalPage from "../components/LegalPage";
import { COMPANY } from "../legal/company";

const SECTIONS = [
  {
    h: "1. Summary",
    body: [
      "Most refunds on SocialPulse happen automatically, straight back to your wallet. If a service you paid for is not delivered, you get your money back. Once a service has been delivered, it cannot be refunded.",
    ],
  },
  {
    h: "2. Virtual numbers (one-time codes)",
    list: [
      "If no code arrives before the number expires, the order is cancelled and the full amount is returned to your wallet automatically.",
      "If you cancel a number before any code arrives, the full amount is returned to your wallet.",
      "Once a code has been delivered, the purchase is complete and is not refundable.",
      "If you believe a delivered code was wrong or unusable, open Number History and tap \"Request a refund\" with screenshots as proof. We review every request and reply within 72 hours.",
    ],
  },
  {
    h: "3. Rental numbers",
    list: [
      "If the rental cannot be activated, the full amount is returned to your wallet.",
      "Once a rental is active, it is not refundable for the time already used. If the number stops working through no fault of yours, contact support and we will review a pro-rata refund to your wallet.",
    ],
  },
  {
    h: "4. Social media boosts",
    list: [
      "If an order fails or is cancelled before it starts, the full amount is returned to your wallet.",
      "If an order is only partly delivered, the undelivered portion is returned to your wallet automatically (shown as \"Refunded to wallet\" in Boost History).",
      "Engagement that has already been delivered is not refundable, including if the platform later removes it.",
    ],
  },
  {
    h: "5. eSIM data plans",
    list: [
      "If an eSIM cannot be issued, the full amount is returned to your wallet.",
      "Once an eSIM has been issued (the QR code or activation details are shown), it cannot be refunded, because it cannot be reused.",
    ],
  },
  {
    h: "6. Wallet deposits",
    body: [
      "Wallet funds are prepaid credit for SocialPulse Services. Deposits are not normally refunded to your card or bank. We will refund to your original payment method when:",
    ],
    list: [
      "you were charged but your wallet was not credited, and we cannot credit it;",
      "you were charged twice for the same deposit; or",
      "the law requires us to.",
    ],
    after: [
      "Report a payment problem within 30 days with your payment reference. Approved refunds to a card or bank account are sent through the original payment provider and usually arrive within 5 to 10 business days.",
    ],
  },
  {
    h: "7. When we may refuse a refund",
    warn: true,
    list: [
      "The service was delivered as ordered.",
      "The account or order is linked to fraud, a chargeback, or a breach of our Terms of Service.",
      "The request is made more than 30 days after the purchase.",
    ],
  },
  {
    h: "8. Chargebacks",
    body: [
      "Please contact us before disputing a payment with your bank. Most issues are fixed within a day. If a chargeback is raised for a payment you authorised, we may suspend the account while it is investigated and recover the amount from your wallet.",
    ],
  },
  {
    h: "9. How to ask for help",
    body: [
      `Use the Support chat on the website or email ${COMPANY.email}. Include your username, the order or payment reference, and what went wrong. We acknowledge refund requests within 2 business days.`,
      "If you are not satisfied with our decision, you can escalate a complaint to the Federal Competition and Consumer Protection Commission (FCCPC).",
    ],
  },
];

export default function RefundPolicy() {
  return (
    <LegalPage
      title="Refund Policy"
      icon={ReceiptText}
      intro="This policy explains when you can get your money back on SocialPulse Global and how to ask for it. It forms part of our Terms of Service."
      sections={SECTIONS}
      footer={
        <p>
          See also our <Link to="/terms" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</Link>.
        </p>
      }
    />
  );
}
