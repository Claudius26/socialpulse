import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  MessageSquare,
  MailCheck,
  XCircle,
  Search,
  BadgeCheck,
  Banknote,
} from "lucide-react";
import { Link } from "react-router";

import COUNTRIES from "../data/countries";
import PLATFORMS from "../data/platforms";

export default function VirtualNumbers() {
  const [services, setServices] = useState([]);
  const [countries, setCountries] = useState([]);

  const [selectedService, setSelectedService] = useState(""); 
  const [selectedCountry, setSelectedCountry] = useState(""); 

  const [searching, setSearching] = useState(false);
  const [purchasingId, setPurchasingId] = useState(""); 
  const [pools, setPools] = useState([]);

  const [message, setMessage] = useState("");

  const [purchaseData, setPurchaseData] = useState(null);
  const [smsData, setSmsData] = useState(null);

  const [checkingSMS, setCheckingSMS] = useState(false);
  const [autoCheck, setAutoCheck] = useState(false);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    setServices(PLATFORMS);
    setCountries(COUNTRIES);
  }, []);

  const selectedCountryName = useMemo(() => {
    const found = countries.find((c) => c.code === selectedCountry);
    return found?.name || selectedCountry;
  }, [countries, selectedCountry]);

  const selectedServiceName = useMemo(() => {
    const found = services.find((s) => s.id === selectedService);
    return found?.name || selectedService;
  }, [services, selectedService]);

  const handleSearch = async () => {
    if (!selectedCountry || !selectedService) {
      setMessage("Please select both country and service.");
      return;
    }

    setMessage("");
    setPools([]);
    setPurchaseData(null);
    setSmsData(null);
    setAutoCheck(false);

    setSearching(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_BASE}/api/virtualnumbers/services/?service=${encodeURIComponent(
        selectedService
      )}&country=${encodeURIComponent(selectedCountry)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setMessage(
          data?.error
            ? typeof data.error === "string"
              ? data.error
              : JSON.stringify(data.error)
            : "Failed to fetch packages."
        );
        return;
      }

      const list = Array.isArray(data?.services) ? data.services : [];
      setPools(list);

      if (list.length === 0) {
        setMessage("No packages available for this service & country right now.");
      }
    } catch {
      setMessage("Failed to fetch packages. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handlePurchase = async (pool) => {
    if (!token) {
      setMessage("Unauthorized — please log in again.");
      return;
    }
    if (!selectedCountry || !selectedService) {
      setMessage("Please select both country and service.");
      return;
    }
    if (!pool?.duration) {
      setMessage("Invalid package selected.");
      return;
    }

    setMessage("");
    setPurchasingId(`${pool.name}-${pool.duration}`);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE}/api/virtualnumbers/purchase/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service: selectedService,
            country: selectedCountry,
            duration: pool.duration,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data?.error) {
        setMessage(
          data?.error
            ? typeof data.error === "string"
              ? data.error
              : JSON.stringify(data.error)
            : "Purchase failed."
        );
        return;
      }

      setPurchaseData(data);
      setMessage(`✅ Number purchased: ${data.phone_number}`);
    } catch {
      setMessage("Failed to purchase number.");
    } finally {
      setPurchasingId("");
    }
  };

  const handleCheckSMS = async () => {
    if (!purchaseData?.activation_id) {
      setMessage("No active purchase found.");
      return;
    }
    if (!token) {
      setMessage("Unauthorized — please log in again.");
      return;
    }

    setCheckingSMS(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE}/api/virtualnumbers/sms/${purchaseData.activation_id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok || data?.error) {
        setMessage(
          data?.error
            ? typeof data.error === "string"
              ? data.error
              : JSON.stringify(data.error)
            : "Failed to check SMS."
        );
        return;
      }

      setSmsData(data);

      if (data.sms) {
        setMessage(`📩 Message received: ${data.sms}`);
        setAutoCheck(false);
      } else {
        setMessage("⏳ Waiting for SMS...");
      }
    } catch {
      setMessage("Failed to check SMS.");
    } finally {
      setCheckingSMS(false);
    }
  };

  useEffect(() => {
    if (autoCheck && purchaseData?.activation_id) {
      const interval = setInterval(() => handleCheckSMS(), 2000);
      return () => clearInterval(interval);
    }
  }, [autoCheck, purchaseData]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white p-4 sm:p-6">
      <motion.div
        className="w-full max-w-2xl sm:max-w-3xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 mt-4 sm:mt-10 border border-indigo-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Smartphone className="text-indigo-500" />
            Virtual Numbers (Global)
          </h1>

          <Link
            to="/deposits"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition text-center"
          >
            Recharge
          </Link>
        </div>

        <p className="text-gray-600 mb-6 text-sm sm:text-base text-center sm:text-left">
          Select your country and platform, search available pools, then purchase a number to receive SMS codes.
        </p>

        {/* Filters */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <Globe className="text-indigo-500" />
                Select Country
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">-- Choose Country --</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <MessageSquare className="text-indigo-500" />
                Select Platform
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">-- Choose Platform --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            disabled={searching}
            className={`w-full py-3 rounded-lg font-semibold transition text-sm sm:text-base flex items-center justify-center gap-2 ${
              searching
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            }`}
          >
            <Search className="w-5 h-5" />
            {searching ? "Searching..." : "Search"}
          </motion.button>
        </div>

        {/* Results */}
        {selectedCountry && selectedService && pools.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Country:</strong> {selectedCountryName}{" "}
                <span className="text-gray-400">({selectedCountry})</span>
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Service:</strong> {selectedServiceName}{" "}
                <span className="text-gray-400">({selectedService})</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pools.map((pool, idx) => {
                const buyKey = `${pool.name}-${pool.duration}-${idx}`;
                const isBuying = purchasingId === `${pool.name}-${pool.duration}`;

                return (
                  <div
                    key={buyKey}
                    className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          {pool.name || "Package"}{" "}
                          {pool.duration ? (
                            <span className="text-gray-500 font-medium">
                              ({pool.duration})
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Availability: <strong>{pool.available ?? 0}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-gray-800 font-bold text-base sm:text-lg flex items-center justify-end gap-1">
                          <Banknote className="w-4 h-4 text-indigo-500" />
                          {pool.price_with_profit} {pool.currency || "USD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <BadgeCheck className="w-4 h-4 text-green-600" />
                        Success Rate:{" "}
                        <strong className="text-gray-800">
                          {pool.success_rate ?? 0}%
                        </strong>
                      </div>

                      <div className="text-gray-600">
                        Base:{" "}
                        <strong className="text-gray-800">
                          {pool.base_price ?? 0}
                        </strong>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePurchase(pool)}
                      disabled={isBuying || pool.available === 0}
                      className={`w-full py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                        pool.available === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : isBuying
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-green-600 hover:bg-green-700 text-white shadow-md"
                      }`}
                    >
                      {pool.available === 0
                        ? "Not Available"
                        : isBuying
                        ? "Purchasing..."
                        : "Purchase"}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SMS Buttons */}
        {purchaseData && (
          <div className="mt-6">
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-center text-sm sm:text-base">
              <strong>Purchased Number:</strong> {purchaseData.phone_number}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setAutoCheck(true);
                  handleCheckSMS();
                }}
                disabled={checkingSMS || autoCheck}
                className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base ${
                  checkingSMS || autoCheck
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                }`}
              >
                <MailCheck className="w-5 h-5" />
                {autoCheck ? "Auto Checking..." : "Check SMS"}
              </motion.button>

              {autoCheck && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAutoCheck(false)}
                  className="flex-1 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
                >
                  <XCircle className="w-5 h-5" />
                  Stop Checking
                </motion.button>
              )}
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="mt-4 text-center font-medium text-gray-700 bg-indigo-50 p-3 rounded-lg shadow-inner text-sm sm:text-base">
            {message}
          </div>
        )}

        {/* Latest SMS */}
        {smsData && smsData.sms && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-center text-sm sm:text-base">
            <strong>Latest SMS:</strong> {smsData.sms}
          </div>
        )}
      </motion.div>
    </div>
  );
}
