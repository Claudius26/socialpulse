import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What is SocialPulse?",
    a: (
      <>
        SocialPulse is a platform that helps creators, influencers, and businesses
        boost their online presence across multiple social media platforms through
        genuine engagement tools and growth services.
      </>
    ),
  },
  {
    q: "How do I fund my wallet?",
    a: (
      <>
        Simply go to your <strong>Dashboard → Deposit</strong>, choose your preferred
        payment method, and confirm. Your balance will automatically update once
        your payment is verified.
      </>
    ),
  },
  {
    q: "My payment went through but my balance didn’t update. What should I do?",
    a: (
      <>
        Wait a few minutes — sometimes Paystack confirmations take a little time.
        If your wallet still doesn’t update, contact our support team with your
        transaction reference.
      </>
    ),
  },
  {
    q: "How can I use my wallet balance?",
    a: (
      <>
        You can use your wallet balance to purchase likes, followers, comments,
        and other social media engagement services directly from your dashboard.
      </>
    ),
  },
  {
    q: "Are my payments and data secure?",
    a: (
      <>
        Absolutely. We use Paystack’s secure payment gateway, and all user
        information is encrypted. Your details are never shared or stored insecurely.
      </>
    ),
  },
  {
    q: "Can I get a refund if I make a wrong payment?",
    a: (
      <>
        Refunds are only possible if your payment has not yet been processed for
        service delivery. Please contact support immediately after any issue to
        review your case.
      </>
    ),
  },
  {
    q: "How can I reach support?",
    a: (
      <>
        You can reach our support team anytime via{" "}
        <strong>support@socialpulse.com</strong> or by using the live chat option
        on your dashboard. We respond within 24 hours.
      </>
    ),
  },
];

export default function Faq() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <p className="eyebrow">Help Center</p>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked <span className="heading-gradient">Questions</span>
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Everything you need to know about using SocialPulse.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, index) => (
            <div key={index} className="card card-hover p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  <HelpCircle className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
                    {item.q}
                  </h2>
                  <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
