import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Users, Bolt, Shield, BarChart2, TrendingUp, DollarSign } from "lucide-react";
import socialImage from "../images/socialImage.jpg";

function Landing() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [contactStatus, setContactStatus] = useState("");
  const revealRefs = useRef([]);
  const heroImgRef = useRef(null);
  const [imgTransform, setImgTransform] = useState({ x: 0, y: 0 });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus("Sending...");
    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
      setContactStatus("Please fill out all fields before sending.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setContactStatus("Message sent successfully!");
      setContactData({ name: "", email: "", message: "" });
    } catch {
      setContactStatus("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleHeroMove = (e) => {
    const el = heroImgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const py = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    setImgTransform({ x: px * 6, y: py * 6 });
  };

  const handleHeroLeave = () => setImgTransform({ x: 0, y: 0 });

  const [typedText, setTypedText] = useState("");
  const fullText = "SOCIALPULSE";
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!deleting && index < fullText.length) {
        setTypedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      } else if (deleting && index > 0) {
        setTypedText((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      } else if (index === fullText.length && !deleting) {
        setTimeout(() => setDeleting(true), 1500);
      } else if (index === 0 && deleting) {
        setDeleting(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [index, deleting]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-hidden">
      <style>{`
        .in-view { opacity: 1 !important; transform: translateY(0) !important; transition: opacity 700ms ease, transform 700ms ease; }
        @keyframes floaty { 0% { transform: translateY(0);} 50% { transform: translateY(-6px);} 100% { transform: translateY(0);} }
      `}</style>
      <Navbar />

      <section
        id="home"
        className="relative flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white"
        onMouseMove={handleHeroMove}
        onMouseLeave={handleHeroLeave}
      >
        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-5 md:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-snug">
            <span className="text-blue-600 tracking-widest">{typedText}</span>
            <span className="animate-pulse text-blue-700">|</span>
          </h1>
          <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-md leading-relaxed">
            Boost Your <span className="font-semibold">Social Media</span> Growth
          </p>
          <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-md leading-relaxed">
            Instantly increase likes, followers, comments, and engagement across Facebook, Instagram, YouTube, TikTok, and more — all in one seamless platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/register"
              className="px-5 py-3 bg-blue-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/explore_boost"
              className="px-5 py-3 border border-blue-600 text-blue-600 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-50 transition"
            >
              Explore Boosts
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 mb-10 md:mb-0">
          <div
            ref={heroImgRef}
            className="mx-auto md:mx-0 max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{ transform: `translate3d(${imgTransform.x}px, ${imgTransform.y}px, 0)` }}
          >
            <img
              src={socialImage}
              alt="Social Media Growth"
              className="w-full object-cover block transition-transform duration-500 ease-out hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section id="stats" className="py-16 md:py-20 px-6 bg-white text-center border-t border-gray-200">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 text-gray-900">
          Our Global Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {[
            { label: "Boosts Delivered", value: "20K+", icon: TrendingUp },
            { label: "Numbers Purchased", value: "25K+", icon: Users },
            { label: "Amount Spent on Boosts", value: "₦500K+", icon: DollarSign },
            { label: "Amount Spent on Numbers", value: "₦300K+", icon: DollarSign },
            { label: "Total Amount Spent", value: "₦900K+", icon: BarChart2 },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-md p-6 hover:shadow-2xl transition-transform hover:-translate-y-2"
              >
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-3xl sm:text-4xl font-extrabold text-blue-700">{stat.value}</p>
                <p className="text-gray-700 text-sm sm:text-base">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="services" className="py-16 md:py-20 px-6 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-12 text-gray-900">
          Our Services
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-12 text-base sm:text-lg md:text-xl leading-relaxed">
          SocialPulse offers a complete solution to grow your social media accounts safely, effectively, and effortlessly.
        </p>
        <div
          ref={(el) => (revealRefs.current[0] = el)}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto"
        >
          {[
            { title: "1. Create an Account", desc: "Sign up quickly and gain access to all services instantly." },
            { title: "2. Add Funds", desc: "Deposit funds into your wallet to use our services seamlessly." },
            { title: "3. Request Services", desc: "Choose followers, likes, comments, or numbers — all in one place." },
            { title: "4. Receive Your Requests", desc: "Enjoy fast delivery and track results in real-time." },
          ].map((service, index) => {
            const icons = [Users, Bolt, BarChart2, Shield];
            const Icon = icons[index] || Users;
            return (
              <div
                key={index}
                ref={(el) => (revealRefs.current[index + 1] = el)}
                className="p-5 sm:p-6 border rounded-xl shadow-md hover:shadow-2xl bg-white transition transform hover:-translate-y-2 opacity-0 translate-y-6 flex flex-col items-start gap-4"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg">{service.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="about" className="py-16 md:py-20 px-6 bg-blue-50 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900">About SocialPulse</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-base sm:text-lg md:text-xl leading-relaxed">
          SocialPulse helps creators, brands, and influencers grow their online presence efficiently and securely. Our tools empower users to gain engagement and manage all social growth needs in one place.
        </p>
        <Link
          to="/register"
          className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started Now
        </Link>
      </section>

      <section id="contact" className="py-16 md:py-20 px-6 bg-blue-50 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900">Contact Us</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-10 text-base sm:text-lg md:text-xl leading-relaxed">
          Have questions or need support? Send us a message — we’ll respond promptly.
        </p>
        <form onSubmit={handleContactSubmit} className="max-w-3xl mx-auto flex flex-col gap-4 text-left" aria-live="polite">
          <input
            type="text"
            placeholder="Your Name"
            value={contactData.name}
            onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
            required
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={contactData.email}
            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
            required
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          />
          <textarea
            placeholder="Your Message"
            value={contactData.message}
            onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
            required
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            rows="4"
          />
          <button
            type="submit"
            className="px-5 sm:px-6 py-3 bg-blue-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
        {contactStatus && (
          <p className="mt-4 text-gray-700 text-sm sm:text-base" role="status">
            {contactStatus}
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
