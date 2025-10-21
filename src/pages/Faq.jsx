export default function Faq() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-10 px-4">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-8">
          Frequently Asked Questions (FAQ)
        </h1>

        <div className="space-y-8 text-gray-700 dark:text-gray-200">
          <div>
            <h2 className="font-semibold text-lg">1. What is SocialPulse?</h2>
            <p>
              SocialPulse is a platform that helps creators, influencers, and businesses
              boost their online presence across multiple social media platforms through
              genuine engagement tools and growth services.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">2. How do I fund my wallet?</h2>
            <p>
              Simply go to your <strong>Dashboard → Deposit</strong>, choose your preferred
              payment method, and confirm. Your balance will automatically update once
              your payment is verified.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">3. My payment went through but my balance didn’t update. What should I do?</h2>
            <p>
              Wait a few minutes — sometimes Paystack confirmations take a little time.
              If your wallet still doesn’t update, contact our support team with your
              transaction reference.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">4. How can I use my wallet balance?</h2>
            <p>
              You can use your wallet balance to purchase likes, followers, comments,
              and other social media engagement services directly from your dashboard.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">5. Are my payments and data secure?</h2>
            <p>
              Absolutely. We use Paystack’s secure payment gateway, and all user
              information is encrypted. Your details are never shared or stored insecurely.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">6. Can I get a refund if I make a wrong payment?</h2>
            <p>
              Refunds are only possible if your payment has not yet been processed for
              service delivery. Please contact support immediately after any issue to
              review your case.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">7. How can I reach support?</h2>
            <p>
              You can reach our support team anytime via{" "}
              <strong>support@socialpulse.com</strong> or by using the live chat option
              on your dashboard. We respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
