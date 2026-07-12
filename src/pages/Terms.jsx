import { Link } from "react-router";
import { ShieldCheck, ArrowLeft } from "lucide-react";

const EFFECTIVE = "10 July 2026";

const SECTIONS = [
  {
    h: "1. Acceptance of these Terms",
    body: [
      "These Terms of Service (\"Terms\") are a binding agreement between you and SocialPulse Global (\"SocialPulse\", \"we\", \"us\"). By creating an account, funding your wallet, or using any part of our website or services (the \"Services\"), you confirm that you have read, understood, and agreed to these Terms and our Privacy Policy.",
      "If you do not agree, do not use the Services.",
    ],
  },
  {
    h: "2. Eligibility",
    body: [
      "You must be at least 18 years old and legally able to enter into a contract. You must not be barred from using the Services under the laws of your country. By using the Services you represent that you meet these requirements and that all information you provide is accurate and belongs to you.",
    ],
  },
  {
    h: "3. Your account",
    body: [
      "You are responsible for keeping your login details and password confidential and for all activity that happens under your account. Create only one account unless we authorise otherwise. Notify us immediately of any unauthorised use. We may require identity verification (KYC) at any time and may suspend accounts pending verification.",
    ],
  },
  {
    h: "4. The Services",
    body: [
      "SocialPulse provides digital services which may include: temporary virtual phone numbers for receiving SMS one-time passwords (OTP) and verification codes, rental phone numbers for longer-term SMS reception, eSIM mobile data plans, social media growth (\"boost\") services, VPN & proxy access, bill payments, cable TV subscriptions, gift cards, and wallet funding (by card and bank transfer).",
      "Services are delivered through third-party providers and networks. We do not control those providers and cannot guarantee that every number, service, or platform will always be available or successful.",
    ],
  },
  {
    h: "5. Wallet, pricing & payments",
    body: [
      "Purchases are made from your SocialPulse wallet. You fund the wallet through our supported payment methods. Prices are shown before you buy and may change at any time. Amounts are charged in your wallet currency (or the displayed equivalent).",
      "Wallet funds are for buying Services only. They are not a bank deposit, earn no interest, and cannot be transferred to other users. Deposits are generally non-refundable to your original payment method except where required by law or expressly stated in these Terms.",
    ],
  },
  {
    h: "6. Virtual numbers — how they work",
    body: [
      "Virtual numbers are temporary and may be shared or recycled. They are intended for receiving one-time verification codes only — not for long-term use, banking security, or as a permanent contact number.",
      "If no code arrives within the allowed time, the order is cancelled automatically and your wallet is refunded. Once a code has been delivered, the purchase is complete and non-refundable. We cannot guarantee that any specific service or platform will accept a given number.",
    ],
  },
  {
    h: "7. Acceptable use — prohibited activities",
    prohibited: true,
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
      "We take these rules seriously. We cooperate with law enforcement and may report unlawful activity, disclose account information where legally required, suspend or terminate your account, and freeze or withhold funds reasonably believed to be connected to prohibited use.",
    ],
  },
  {
    h: "8. Refunds & cancellations",
    body: [
      "Undelivered virtual-number codes are auto-refunded to your wallet as described in Section 6. Otherwise, completed Services (including successfully delivered codes, boosts already started, and top-ups already processed) are non-refundable. Wallet funds are used only to pay for the Services on SocialPulse and are not withdrawable to cash or transferable off the platform.",
    ],
  },
  {
    h: "9. Third-party providers & availability",
    body: [
      "The Services depend on mobile networks, social platforms, payment processors, and other providers. We provide the Services on an \"as available\" basis and are not responsible for outages, delays, price changes, or decisions made by those third parties, including a platform choosing to block a number or reverse an action.",
    ],
  },
  {
    h: "10. Intellectual property",
    body: [
      "The SocialPulse name, logo, website, and content are owned by us or our licensors and are protected by law. You may not copy, resell, or reuse them without our written permission.",
    ],
  },
  {
    h: "11. Disclaimers",
    body: [
      "The Services are provided \"as is\" and \"as available\" without warranties of any kind, whether express or implied, including fitness for a particular purpose. We do not warrant that the Services will be uninterrupted, error-free, or that any number or boost will achieve a specific result.",
    ],
  },
  {
    h: "12. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, SocialPulse will not be liable for any indirect, incidental, or consequential loss, or loss of profit, data, or goodwill. Our total liability for any claim relating to the Services is limited to the amount you paid us for the specific transaction giving rise to the claim.",
    ],
  },
  {
    h: "13. Indemnity",
    body: [
      "You agree to indemnify and hold SocialPulse harmless from any claims, losses, or costs arising from your misuse of the Services or your breach of these Terms or the law.",
    ],
  },
  {
    h: "14. Suspension & termination",
    body: [
      "We may suspend or close your account, remove content, or withhold funds if we reasonably believe you have breached these Terms or the law, or to protect our users and providers. You may stop using the Services at any time.",
    ],
  },
  {
    h: "15. Changes to these Terms",
    body: [
      "We may update these Terms from time to time. The latest version will always be posted here with a new effective date. Continuing to use the Services after changes means you accept them.",
    ],
  },
  {
    h: "16. Contact",
    body: [
      "Questions about these Terms? Use the Contact button on our website or reach our support team, and we'll be happy to help.",
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12 max-w-3xl">
        <Link to="/register" className="inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:underline mb-6">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <ShieldCheck size={22} />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Effective date: {EFFECTIVE}</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Please read these Terms carefully before using SocialPulse Global. They explain your rights and
          responsibilities and, importantly, what you may and may not use our Services for.
        </p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className={`text-lg font-bold ${s.prohibited ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                {s.h}
              </h2>
              {s.body?.map((p, i) => (
                <p key={i} className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p}</p>
              ))}
              {s.list && (
                <ul className="mt-3 space-y-2">
                  {s.list.map((li, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.after?.map((p, i) => (
                <p key={i} className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-xs text-slate-500 dark:text-slate-400">
          By registering or using SocialPulse Global you acknowledge that you have read and agree to these Terms of Service and our{" "}
          <Link to="/privacy" className="text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}