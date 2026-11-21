import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectAuthToken, fetchUserProfile } from "../features/auth/authSlice";
import {
  fetchBoostCatalogue, estimateTotal, selectBoostCatalogue, selectBoostCatalogueStatus,
  selectBoostCatalogueError,
} from "../features/boosts/catalogue";
import { Instagram, Music2, Youtube, Twitter, Facebook, Send, Rocket, Wallet, Tag } from "lucide-react";
import { useNavigate } from "react-router";

function Boost() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const wallet = user?.wallet?.balance || 0;
  const walletCurrency = (user?.wallet?.currency || "NGN").toUpperCase();
  const dispatch = useDispatch();
  const fmt = (v, cur) => {
    const n = Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (cur || "NGN").toUpperCase() === "NGN" ? `₦${n}` : `${n} ${cur}`;
  };

  const [platform, setPlatform] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [target, setTarget] = useState("");
  const [audience, setAudience] = useState("");
  const [quality, setQuality] = useState("");
  const [trafficSource, setTrafficSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Every platform/type/service is loaded ONCE on entry (and refreshed on every
  // visit) — picking a platform and type below is then instant.
  const catalogue = useSelector(selectBoostCatalogue);
  const catalogueStatus = useSelector(selectBoostCatalogueStatus);
  const catalogueError = useSelector(selectBoostCatalogueError);
  useEffect(() => {
    dispatch(fetchBoostCatalogue(token));
  }, [dispatch, token]);
  // Prices are in the wallet currency; ignore a catalogue priced for another one.
  const usable = catalogue && (!user || catalogue.currency === walletCurrency) ? catalogue : null;
  const priceCurrency = usable?.currency || walletCurrency;
  const decimals = usable?.decimals ?? 2;

  const navigate = useNavigate();
  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  const platforms = [
    { name: "Instagram", icon: <Instagram className="w-6 h-6 text-pink-600" /> },
    { name: "TikTok", icon: <Music2 className="w-6 h-6 text-slate-700 dark:text-slate-300" /> },
    { name: "YouTube", icon: <Youtube className="w-6 h-6 text-rose-600" /> },
    { name: "Twitter", icon: <Twitter className="w-6 h-6 text-cyan-500" /> },
    { name: "Facebook", icon: <Facebook className="w-6 h-6 text-brand-600" /> },
    { name: "Telegram", icon: <Send className="w-6 h-6 text-cyan-500" /> },
  ];

  const subcategoriesMap = {
    Instagram: ["Followers", "Likes", "Comments"],
    TikTok: ["Followers", "Likes", "Views"],
    YouTube: ["Subscribers", "Views", "Likes"],
    Twitter: ["Followers", "Likes", "Retweets"],
    Facebook: ["Followers", "Likes"],
    Telegram: ["Channel Views", "Members"],
  };

  // Straight from the store — no request when picking a platform/type.
  const categories = useMemo(
    () => (platform && subcategory ? usable?.platforms?.[platform]?.[subcategory] || [] : []),
    [usable, platform, subcategory]
  );
  // Looked up by id, so a background price refresh updates the selection too.
  const selectedCategory = categories.find((c) => c.service_id === selectedId) || null;

  // Estimate with the SAME rule the order is charged with.
  const qtyNum = parseInt(quantity, 10);
  const estimatedPrice = selectedCategory && qtyNum > 0
    ? estimateTotal(selectedCategory.rate, qtyNum, decimals)
    : 0;
  const quantityError = selectedCategory && quantity && (
    !Number.isInteger(qtyNum) || qtyNum < selectedCategory.min ||
    (selectedCategory.max && qtyNum > selectedCategory.max))
    ? `Quantity must be between ${selectedCategory.min} and ${selectedCategory.max || "unlimited"}.`
    : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!platform || !subcategory || !selectedCategory || !quantity || !target) {
      setMessage("Please fill all required fields.");
      return;
    }

    const min = selectedCategory?.min || 0;
    const max = selectedCategory?.max || 0;
    const qty = parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty < min || (max && qty > max)) {
      setMessage(`Quantity must be between ${min} and ${max || "unlimited"}.`);
      return;
    }

    if (Number(wallet) < estimatedPrice) {
      setMessage("Insufficient funds. Please fund your wallet.");
      return;
    }

    setLoading(true);
    setMessage("");

    const payload = {
      platform,
      // The exact service the user picked + was quoted for (the backend used to
      // guess by name and could order a different one).
      service_id: selectedCategory.service_id,
      service: selectedCategory.name,
      target,
      quantity: parseInt(quantity),
      // The total we showed — the server refuses (409) rather than charge more.
      expected_total: estimatedPrice.toFixed(decimals),
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
        setMessage("Boost order placed! Track it in Boost History.");
        if (token) dispatch(fetchUserProfile(token));
        setQuantity("");
        setTarget("");
        setAudience("");
        setQuality("");
        setTrafficSource("");
      } else if (res.status === 409 && data.price_changed) {
        // Prices moved since the page loaded: pull the new ones, show them.
        dispatch(fetchBoostCatalogue(token));
        setMessage(`${data.error} New total: ${fmt(data.total, data.currency)}.`);
      } else {
        setMessage(data.error || "Failed to process boost request.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const insufficientFunds = Number(wallet) < estimatedPrice;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="eyebrow inline-flex items-center justify-center gap-1.5 mb-2">
            <Rocket className="w-4 h-4" />
            Boost
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Boost Your Social Media Presence
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Pick a platform and service to grow your reach effortlessly.
          </p>
        </div>

        <div className="card p-5 sm:p-8">
        {/* Platform Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setPlatform(p.name);
                setSubcategory("");
                setSelectedId("");
                setMessage("");
              }}
              className={`border rounded-xl p-3 sm:p-5 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 shadow-sm hover:shadow-md transition w-full ${
                platform === p.name
                  ? "bg-gradient-to-r from-brand-600 to-violet-600 text-white border-transparent"
                  : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800"
              }`}
            >
              {p.icon}
              <span className="font-semibold text-sm sm:text-base">{p.name}</span>
            </button>
          ))}
        </div>

        {platform && (
          <div className="mb-6">
            <label className="label">Select Type</label>
            <select
              className="input"
              value={subcategory}
              onChange={(e) => {
                setSubcategory(e.target.value);
                setSelectedId("");
                setMessage("");
              }}
            >
              <option value="">-- Choose Type --</option>
              {(usable?.types?.[platform] || subcategoriesMap[platform])?.map((type) => (
                <option key={type} value={type}>
                  {type}
                  {usable ? ` (${usable.platforms?.[platform]?.[type]?.length || 0})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Only the very first visit ever waits — afterwards the store has it. */}
        {platform && subcategory && !usable && catalogueStatus === "loading" && (
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Loading services…</p>
        )}
        {platform && subcategory && !usable && catalogueStatus === "error" && (
          <p className="mb-6 text-sm text-rose-600 dark:text-rose-400">
            {catalogueError}{" "}
            <button type="button" className="underline" onClick={() => dispatch(fetchBoostCatalogue(token))}>
              Retry
            </button>
          </p>
        )}
        {platform && subcategory && usable && categories.length === 0 && (
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            No services available for this type right now.
          </p>
        )}

        {categories.length > 0 && (
          <div className="mb-6">
            <label className="label">Select Category</label>
            <select
              className="input"
              value={selectedCategory?.service_id || ""}
              onChange={(e) => {
                const picked = categories.find((c) => String(c.service_id) === e.target.value) || null;
                setSelectedId(picked ? picked.service_id : "");
                if (picked) setQuantity(String(picked.min));
              }}
            >
              <option value="">-- Choose Category --</option>
              {categories.map((c) => (
                <option key={c.service_id} value={c.service_id}>
                  {c.name} - {fmt(c.rate, priceCurrency)} per 1000
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCategory && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  Target (Username or Post URL)
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. https://instagram.com/username"
                  className="input"
                />
              </div>

              <div>
                <label className="label">
                  Quantity
                </label>
                <input
                  type="number"
                  min={selectedCategory.min}
                  max={selectedCategory.max}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`Min ${selectedCategory.min} - Max ${selectedCategory.max}`}
                  className="input"
                />
                <p className={`text-xs mt-1 ${quantityError ? "text-rose-600 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"}`}>
                  {quantityError || `Min ${selectedCategory.min} - Max ${selectedCategory.max || "unlimited"}`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Audience (Optional)"
                  className="input"
                />
                <input
                  type="text"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  placeholder="Quality (Optional)"
                  className="input"
                />
                <input
                  type="text"
                  value={trafficSource}
                  onChange={(e) => setTrafficSource(e.target.value)}
                  placeholder="Traffic Source (Optional)"
                  className="input"
                />
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-600" />
                  <strong className="text-slate-900 dark:text-white">Estimated Price:</strong>{" "}
                  <span className="text-brand-600 font-semibold">{fmt(estimatedPrice, priceCurrency)}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <strong className="text-slate-900 dark:text-white">Wallet Balance:</strong>{" "}
                  <span className="text-emerald-600 font-semibold">{fmt(wallet, walletCurrency)}</span>
                </p>
              </div>

              {insufficientFunds ? (
                <button
                  type="button"
                  onClick={() => navigate("/deposits")}
                  className="btn btn-lg w-full mt-4 bg-amber-500 text-white hover:bg-amber-600"
                >
                  Fund Wallet
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-lg btn-primary w-full mt-4"
                >
                  {loading ? "Processing..." : "Boost"}
                </button>
              )}
            </form>
          </div>
        )}

        {message && (
          <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-4">{message}</p>
        )}
        </div>
      </div>
    </div>
  );
}

export default Boost;
