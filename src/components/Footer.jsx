function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-blue-800 text-white py-4 shadow-inner z-40">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-sm">
        <p className="text-center sm:text-left mb-2 sm:mb-0">
          © {new Date().getFullYear()} <span className="font-semibold">SocialPulse</span>. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="/privacy" className="hover:text-gray-300">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-300">
            Terms
          </a>
          <a href="/support" className="hover:text-gray-300">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
