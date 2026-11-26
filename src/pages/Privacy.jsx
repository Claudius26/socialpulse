import { Link } from "react-router";
import { Lock } from "lucide-react";
import LegalPage from "../components/LegalPage";
import { COMPANY } from "../legal/company";

const SECTIONS = [
  {
    h: "1. Who we are",
    body: [
      `${COMPANY.legalName} (a business name registered with the Corporate Affairs Commission, ${COMPANY.registration}), ${COMPANY.address}, operates the website ${COMPANY.website} ("SocialPulse", "we", "us"). We are the data controller for the personal data described in this policy.`,
      "This policy explains what personal data we collect, why, who we share it with, how long we keep it, and your rights under the Nigeria Data Protection Act 2023 (NDPA) and, where they apply to you, other data-protection laws such as the EU/UK GDPR.",
    ],
  },
  {
    h: "2. Contact and Data Protection Officer",
    body: [
      `For any privacy question or to exercise your rights, contact our Data Protection Officer at ${COMPANY.email} (subject line: "Data Protection"), or write to us at ${COMPANY.address}.`,
    ],
  },
  {
    h: "3. The data we collect",
    list: [
      "Account details: full name, email address, username, phone number (if you add it), country, and your password (stored only as a secure hash). If you sign in with Google, we receive your name, email and Google account ID.",
      "Wallet and transaction data: deposits, purchases, refunds, wallet balance, payment references and the payment method type. Card and bank details are entered with our payment providers; we never receive or store your full card number.",
      "Service data: virtual numbers and rentals you order and the SMS messages received on them, eSIM orders, boost orders (including the social media links or usernames you give us), and refund requests with any screenshots you upload.",
      "Support data: messages you send in the Support chat or contact form, including replies written by our AI assistant.",
      "Technical data: IP address, device and browser type, login times and security logs.",
      "Consent records: when you confirmed you are 18+ and accepted our Terms and this policy.",
      "Identity documents: only if we ask you to verify your identity (for example ID, NIN or BVN) to meet legal obligations or prevent fraud.",
    ],
  },
  {
    h: "4. Why we use it, and our lawful basis",
    list: [
      "To create your account and provide the Services you buy (performance of our contract with you).",
      "To process payments, prevent fraud and keep the platform secure (contract and legitimate interests).",
      "To keep transaction and order records, verify identity where required, and respond to lawful requests from law enforcement and regulators (legal obligation).",
      "To answer support requests and improve our Services (legitimate interests).",
      "To send you service emails such as verification codes, receipts and security alerts (contract). We only send marketing emails if you have agreed, and you can unsubscribe at any time (consent).",
    ],
    after: [
      "We do not sell your personal data. We do not use it for automated decisions that have legal or similarly significant effects on you.",
    ],
  },
  {
    h: "5. Who we share it with",
    body: [
      "We share personal data only with service providers who help us run the Services, under contracts that require them to protect it, and only as much as each one needs:",
    ],
    list: [
      "Payment processors (such as Paystack, Flutterwave and NOWPayments) to take deposits.",
      "Phone-number, SMS, eSIM and social-media-growth providers to fulfil your orders. They receive order details, not your account profile.",
      "Hosting, database, storage and email providers that store and send our data (including Render, Neon, Supabase and Resend).",
      "Anthropic, which provides the AI assistant in the Support chat, receives the messages in that conversation when the assistant replies.",
      "Google, if you choose to sign in with Google.",
      "Law enforcement, regulators or courts, when the law requires it or to prevent fraud or other crime.",
    ],
  },
  {
    h: "6. International transfers",
    body: [
      "Some of our providers store or process data outside Nigeria (for example in the European Union or the United States). When we transfer personal data abroad we do so in line with Part VIII of the NDPA, relying on adequate protection in the receiving country, contractual safeguards with the provider, or another lawful basis the NDPA allows.",
    ],
  },
  {
    h: "7. How long we keep it",
    list: [
      "Account data: while your account is open.",
      "Transaction, payment, number-order and SMS records: for up to 6 years after the transaction, because the law requires us to keep financial records and so that we can assist investigations into fraud.",
      "Support conversations: for up to 2 years after the last message.",
      "Security logs: for up to 1 year.",
    ],
    after: [
      "When you ask us to delete your account, we close it and delete or anonymise the data we no longer need. Records we must keep by law are kept securely until the retention period ends, and are then deleted.",
    ],
  },
  {
    h: "8. Your rights",
    body: [
      "Under the NDPA you have the right to:",
    ],
    list: [
      "be told how your data is used (this policy);",
      "get a copy of your personal data;",
      "have inaccurate data corrected (you can edit most details on your Profile page);",
      "have your data deleted, subject to the records we must keep by law;",
      "restrict or object to certain uses, including marketing;",
      "receive your data in a portable format;",
      "withdraw consent at any time, where we rely on consent; and",
      "complain to the Nigeria Data Protection Commission (NDPC) at ndpc.gov.ng.",
    ],
    after: [
      `To request deletion, use "Delete my account" on your Profile page. For any other request, email ${COMPANY.email}. We may ask you to confirm your identity, and we will respond within 30 days.`,
    ],
  },
  {
    h: "9. Cookies and local storage",
    body: [
      "We use only cookies and browser storage that are needed for the website to work: a secure, HttpOnly cookie that keeps you signed in, and local storage on your device that remembers your basic profile and dashboard summary so pages load faster, plus small preferences. We do not use advertising or third-party tracking cookies. If you block cookies in your browser, you will not be able to stay signed in.",
    ],
  },
  {
    h: "10. Security",
    body: [
      "We protect your data with encryption in transit (HTTPS), hashed passwords, restricted staff access, and logging of sensitive actions. No system is completely secure. If a personal-data breach is likely to put you at risk, we will notify the NDPC within 72 hours and tell you without undue delay, as the NDPA requires.",
    ],
  },
  {
    h: "11. Children",
    body: [
      "SocialPulse is only for people aged 18 or older. We do not knowingly collect data from anyone under 18. If you believe a child has given us their data, contact us and we will delete it.",
    ],
  },
  {
    h: "12. Changes to this policy",
    body: [
      "We may update this policy. The latest version is always on this page with its effective date, and we will tell you about significant changes through the website or by email.",
    ],
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      icon={Lock}
      intro="Your privacy matters to us. This policy explains, in plain language, how SocialPulse Global handles your personal data."
      sections={SECTIONS}
      footer={
        <p>
          This policy forms part of our{" "}
          <Link to="/terms" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</Link>.
        </p>
      }
    />
  );
}
