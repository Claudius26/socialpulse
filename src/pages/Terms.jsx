import { Link } from "react-router";
import { ShieldCheck } from "lucide-react";
import LegalPage from "../components/LegalPage";
import { COMPANY } from "../legal/company";

const SECTIONS = [
  {
    h: "1. Who we are",
    body: [
      `The Services are operated by ${COMPANY.legalName}, a business registered with the Corporate Affairs Commission of Nigeria under registration number ${COMPANY.cacNumber}, with its address at ${COMPANY.address} ("SocialPulse", "we", "us", "our").`,
      `You can reach us at ${COMPANY.email} or through the Support chat on the website.`,
    ],
  },
  {
    h: "2. Acceptance of these Terms",
    body: [
      "These Terms of Service (\"Terms\") are a binding agreement between you and SocialPulse. By creating an account, funding your wallet, or using any part of our website or services (the \"Services\"), you confirm that you have read, understood, and agreed to these Terms, our Privacy Policy and our Refund Policy.",
      "If you do not agree, do not use the Services.",
    ],
  },
  {
    h: "3. Eligibility",
    body: [
      "You must be at least 18 years old and legally able to enter into a contract. You confirm this when you create an account. You must not be barred from using the Services under the laws of your country. All information you give us must be accurate and belong to you.",
      "We do not knowingly provide the Services to anyone under 18. If we learn that an account belongs to someone under 18, we will close it.",
    ],
  },
  {
    h: "4. Your account and identity checks",
    body: [
      "You are responsible for keeping your login details confidential and for all activity under your account. Create only one account unless we authorise otherwise, and tell us immediately about any unauthorised use.",
      "To meet our legal obligations and to prevent fraud, we may ask you at any time to verify your identity (for example with a government-issued ID, NIN or BVN) and may limit or suspend your account until verification is complete.",
    ],
  },
  {
    h: "5. The Services",
    body: [
      "SocialPulse provides digital services, which may include: temporary virtual phone numbers for receiving SMS one-time passwords (OTP) and verification codes, rental phone numbers for longer-term SMS reception, eSIM mobile data plans, social media growth (\"boost\") services, bill payments, and wallet funding.",
      "Services are delivered through third-party providers and networks. We do not control those providers and cannot guarantee that every number, service, or platform will always be available or successful.",
      "CardPulse, our separate mobile app, has its own terms. These Terms cover the SocialPulse website and its Services only.",
    ],
  },
  {
    h: "6. Wallet, pricing and payments",
    body: [
      "Purchases are made from your SocialPulse wallet. You fund the wallet through our supported payment methods (card, bank transfer and, where offered, cryptocurrency), which are processed by licensed third-party payment providers. We do not store your full card details.",
      "Prices are shown before you buy and may change at any time. Amounts are charged in your wallet currency (or the displayed equivalent). Prices include any applicable taxes unless stated otherwise.",
      "Wallet funds are prepaid credit for buying Services only. They are not a bank deposit, earn no interest, cannot be transferred to other users and cannot be withdrawn to cash, except as described in our Refund Policy or where the law requires.",
    ],
  },
  {
    h: "7. Virtual numbers: how they work",
    body: [
      "Virtual numbers are temporary and may be shared or recycled. They are intended for receiving one-time verification codes only, not for long-term use, banking security, or as a permanent contact number.",
      "If no code arrives within the allowed time, the order is cancelled automatically and your wallet is refunded. Once a code has been delivered, the purchase is complete and non-refundable. We cannot guarantee that any specific platform will accept a given number.",
      "We keep records of every number order (account, time, IP address and messages received) so that we can assist law enforcement if a number is misused.",
    ],
  },
  {
    h: "8. Acceptable use: prohibited activities",
    warn: true,
    body: [
      "You agree to use the Services only for lawful purposes. You must NOT use the Services, or allow anyone else to use your account, to do any of the following:",
    ],
    list: [
      "Commit or facilitate fraud, scams, phishing, identity theft, or financial crime of any kind.",
      "Launder money, finance terrorism, or move the proceeds of unlawful activity.",
      "Create fake, fraudulent, or bulk accounts to deceive people or platforms, evade bans, or manipulate systems.",
      "Impersonate any person, business, or SocialPulse, or misrepresent your identity or affiliation.",
      "Use virtual numbers to bypass law enforcement, harass, threaten, stalk, defraud, or send spam or unsolicited messages.",
      "Access, hack, or attempt to gain unauthorised access to any account, device, network, or data that is not yours.",
      "Boost, promote, or distribute content that is illegal, hateful, violent, sexual/abusive, involves minors, or infringes others' rights; or provide login passwords of accounts you do not own.",
      "Buy, sell, or resell the Services without our written authorisation, or use them to breach a third party's terms in an unlawful way.",
      "Initiate fraudulent chargebacks or disputes on payments you actually authorised.",
      "Do anything that violates any applicable law, regulation, or sanctions.",
    ],
    after: [
      "We take these rules seriously. We cooperate with law enforcement and regulators, may report unlawful activity, disclose account information where legally required, suspend or close your account, and freeze or withhold funds reasonably believed to be connected to prohibited use.",
    ],
  },
  {
    h: "9. Refunds and cancellations",
    body: [
      "Refunds are governed by our Refund Policy, which forms part of these Terms. In summary: undelivered virtual-number codes are refunded to your wallet automatically, failed or partly delivered orders are refunded to your wallet, and completed Services are non-refundable.",
    ],
  },
  {
    h: "10. Third-party providers and availability",
    body: [
      "The Services depend on mobile networks, social platforms, payment processors, and other providers. We provide the Services on an \"as available\" basis and are not responsible for outages, delays, price changes, or decisions made by those third parties, including a platform choosing to block a number or reverse an action.",
      "Social media growth services may be against the rules of the platform concerned. You use them at your own risk, and we are not responsible if a platform removes engagement or restricts your account.",
    ],
  },
  {
    h: "11. Intellectual property",
    body: [
      "The SocialPulse name, logo, website, and content are owned by us or our licensors and are protected by law. You may not copy, resell, or reuse them without our written permission.",
    ],
  },
  {
    h: "12. Disclaimers",
    body: [
      "Except as required by law (including the Federal Competition and Consumer Protection Act 2018), the Services are provided \"as is\" and \"as available\" without warranties of any kind. We do not warrant that the Services will be uninterrupted, error-free, or that any number or boost will achieve a specific result.",
    ],
  },
  {
    h: "13. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, SocialPulse will not be liable for any indirect, incidental, or consequential loss, or loss of profit, data, or goodwill. Our total liability for any claim relating to the Services is limited to the amount you paid us for the specific transaction giving rise to the claim. Nothing in these Terms limits any right you have that cannot be limited by law.",
    ],
  },
  {
    h: "14. Indemnity",
    body: [
      "You agree to indemnify and hold SocialPulse harmless from any claims, losses, or costs arising from your misuse of the Services or your breach of these Terms or the law.",
    ],
  },
  {
    h: "15. Suspension, closure and deleting your account",
    body: [
      "We may suspend or close your account, remove content, or withhold funds if we reasonably believe you have breached these Terms or the law, or to protect our users and providers.",
      "You may stop using the Services at any time. You can deactivate your account, or ask us to delete it, from your Profile page. When an account is closed we keep certain records for as long as the law requires, as explained in our Privacy Policy.",
    ],
  },
  {
    h: "16. Complaints and disputes",
    body: [
      `If you have a complaint, contact us first through the Support chat or ${COMPANY.email}. We aim to acknowledge complaints within 2 business days and resolve them within 14 days.`,
      "If you are not satisfied with our response, you may contact the Federal Competition and Consumer Protection Commission (FCCPC) or, for data-protection matters, the Nigeria Data Protection Commission (NDPC).",
    ],
  },
  {
    h: "17. Governing law",
    body: [
      "These Terms are governed by the laws of the Federal Republic of Nigeria. Any dispute that cannot be resolved through our complaints process will be subject to the jurisdiction of the courts of Rivers State, Nigeria, without affecting any mandatory consumer rights you have where you live.",
    ],
  },
  {
    h: "18. Changes to these Terms",
    body: [
      "We may update these Terms from time to time. The latest version will always be posted here with a new effective date, and we will tell you about significant changes through the website or by email. Continuing to use the Services after changes take effect means you accept them.",
    ],
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      icon={ShieldCheck}
      intro="Please read these Terms carefully before using SocialPulse Global. They explain your rights and responsibilities and, importantly, what you may and may not use our Services for."
      sections={SECTIONS}
      footer={
        <p>
          By registering or using SocialPulse Global you confirm that you are 18 or older and agree to these Terms, our{" "}
          <Link to="/privacy" className="text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</Link> and our{" "}
          <Link to="/refund-policy" className="text-brand-600 dark:text-brand-400 hover:underline">Refund Policy</Link>.
        </p>
      }
    />
  );
}
