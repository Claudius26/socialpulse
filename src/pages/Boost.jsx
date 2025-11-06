import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectAuthToken } from "../features/auth/authSlice";
import { Instagram, Music2, Youtube, Twitter, Facebook, Send } from "lucide-react";
import { useNavigate } from "react-router";

function Boost() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const wallet = user?.wallet?.balance || 0;

  const [platform, setPlatform] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [target, setTarget] = useState("");
  const [audience, setAudience] = useState("");
  const [quality, setQuality] = useState("");
  const [trafficSource, setTrafficSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("0.00");

  const navigate = useNavigate();
  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  const platforms = [
    { name: "Instagram", icon: <Instagram className="w-6 h-6 text-pink-600" /> },
    { name: "TikTok", icon: <Music2 className="w-6 h-6 text-gray-700" /> },
    { name: "YouTube", icon: <Youtube className="w-6 h-6 text-red-600" /> },
    { name: "Twitter", icon: <Twitter className="w-6 h-6 text-blue-500" /> },
    { name: "Facebook", icon: <Facebook className="w-6 h-6 text-blue-700" /> },
    { name: "Telegram", icon: <Send className="w-6 h-6 text-sky-500" /> },
  ];

  const subcategoriesMap = {
    Instagram: ["Followers", "Likes", "Comments"],
    TikTok: ["Followers", "Likes", "Views"],
    YouTube: ["Subscribers", "Views", "Likes"],
    Twitter: ["Followers", "Likes", "Retweets"],
    Facebook: ["Followers", "Likes"],
    Telegram: ["Channel Views", "Members"],
  };

  useEffect(() => {
    if (!platform || !subcategory) return;
    setSelectedCategory(null);
    setCategories([]);
    fetch(`${backendBase}/api/boost/categories/?platform=${platform}&subcategory=${subcategory}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        else setCategories([]);
      })
      .catch(() => setCategories([]));
  }, [platform, subcategory]);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!selectedCategory || !quantity) {
        setEstimatedPrice("0.00");
        return;
      }
      try {
        const res = await fetch(
          `${backendBase}/api/boost/price/?service_id=${selectedCategory.service_id}&quantity=${quantity}`
        );
        const data = await res.json();
        if (res.ok && data.total_with_profit_ngn)
          setEstimatedPrice(data.total_with_profit_ngn);
        else setEstimatedPrice("0.00");
      } catch {
        setEstimatedPrice("0.00");
      }
    };
    fetchPrice();
  }, [quantity, selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!platform || !subcategory || !selectedCategory || !quantity || !target) {
      setMessage("Please fill all required fields.");
      return;
    }

    const min = selectedCategory?.min || 0;
    if (parseInt(quantity) < min) {
      setMessage(`Quantity must be at least ${min}.`);
      return;
    }

    if (wallet < parseFloat(estimatedPrice)) {
      setMessage("Insufficient funds. Please fund your wallet.");
      return;
    }

    setLoading(true);
    setMessage("");

    const payload = {
      platform,
      service: selectedCategory.name,
      target,
      quantity: parseInt(quantity),
      audience: audience || "Global",
      quality: quality || "Standard",
      traffic_source: trafficSource || platform,
    };

    try {
      const res = await fetch(`${backendBase}/api/boost/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (res.ok) {
        setMessage("Boost request submitted successfully!");
        setQuantity("");
        setTarget("");
        setAudience("");
        setQuality("");
        setTrafficSource("");
      } else {
        setMessage(data.error || "Failed to process boost request.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const insufficientFunds = parseFloat(wallet) < parseFloat(estimatedPrice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 sm:py-12 px-3 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl sm:shadow-2xl p-5 sm:p-8 overflow-hidden">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-8 sm:mb-10">
          Boost Your Social Media Presence 🚀
        </h2>

        {/* Platform Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 mb-8 sm:mb-10">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setPlatform(p.name);
                setSubcategory("");
              }}
              className={`border rounded-xl p-3 sm:p-5 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 shadow-sm hover:shadow-md transition w-full ${
                platform === p.name ? "bg-blue-600 text-white" : "bg-gray-50"
              }`}
            >
              {p.icon}
              <span className="font-semibold text-sm sm:text-base">{p.name}</span>
            </button>
          ))}
        </div>

        {platform && (
          <div className="mb-6">
            <label className="block font-medium mb-2 text-sm sm:text-base">Select Type</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            >
              <option value="">-- Choose Type --</option>
              {subcategoriesMap[platform]?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {categories.length > 0 && (
          <div className="mb-6">
            <label className="block font-medium mb-2 text-sm sm:text-base">Select Category</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
              value={selectedCategory?.service_id || ""}
              onChange={(e) =>
                setSelectedCategory(
                  categories.find((c) => c.service_id === parseInt(e.target.value))
                )
              }
            >
              <option value="">-- Choose Category --</option>
              {categories.map((c) => (
                <option key={c.service_id} value={c.service_id}>
                  {c.name} - ₦{parseFloat(c.rate_ngn).toFixed(2)} per 1000
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCategory && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Target (Username or Post URL)
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. https://instagram.com/username"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Quantity
                </label>
                <input
                  type="number"
                  min={selectedCategory.min}
                  max={selectedCategory.max}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`Min ${selectedCategory.min} - Max ${selectedCategory.max}`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Min {selectedCategory.min} - Max {selectedCategory.max}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Audience (Optional)"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base w-full"
                />
                <input
                  type="text"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  placeholder="Quality (Optional)"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base w-full"
                />
                <input
                  type="text"
                  value={trafficSource}
                  onChange={(e) => setTrafficSource(e.target.value)}
                  placeholder="Traffic Source (Optional)"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base w-full"
                />
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <p className="text-sm text-gray-700">
                  <strong>Estimated Price:</strong>{" "}
                  <span className="text-blue-700 font-semibold">{estimatedPrice}</span>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Wallet Balance:</strong>{" "}
                  <span className="text-green-700 font-semibold">{wallet}</span>
                </p>
              </div>

              {insufficientFunds ? (
                <button
                  type="button"
                  onClick={() => navigate("/deposits")}
                  className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition mt-4 text-sm sm:text-base"
                >
                  Fund Wallet
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4 text-sm sm:text-base"
                >
                  {loading ? "Processing..." : "Boost"}
                </button>
              )}
            </form>
          </div>
        )}

        {message && (
          <p className="text-center text-sm sm:text-base text-gray-700 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Boost;
