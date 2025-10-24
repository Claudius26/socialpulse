import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  MessageSquare,
  MailCheck,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";

export default function VirtualNumbers() {
  const [services, setServices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSMS, setCheckingSMS] = useState(false);
  const [autoCheck, setAutoCheck] = useState(false);
  const [message, setMessage] = useState("");
  const [purchaseData, setPurchaseData] = useState(null);
  const [smsData, setSmsData] = useState(null);
  const [countryPrices, setCountryPrices] = useState({});

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_BASE}/api/virtualnumbers/services/?country=110`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.services)) setServices(data.services);
        else setServices([]);
      })
      .catch(() => setMessage("Failed to load services"));
  }, []);

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setSelectedCountry("");
    setCountryPrices({});
    if (!token) {
      setMessage("Unauthorized — please log in again.");
      return;
    }
    if (service) {
      fetch(`${import.meta.env.VITE_BACKEND_BASE}/api/virtualnumbers/countries/?service=${service}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 401) throw new Error("Unauthorized — please log in again.");
          return res.json();
        })
        .then((data) => {
          if (data && data.countries) {
            setCountries(data.countries);
            const prices = {};
            data.countries.forEach((c) => {
              prices[c.country_name.eng] = {
                usd: c.price_with_profit_usd,
                local: c.price_with_profit_local,
                currency: c.local_currency,
              };
            });
            setCountryPrices(prices);
          } else setCountries([]);
        })
        .catch((err) => {
          setMessage(err.message);
          setCountries([]);
        });
    }
  };

  const handlePurchase = () => {
    if (!selectedService || !selectedCountry) {
      setMessage("Please select both service and country.");
      return;
    }
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_BASE}/api/virtualnumbers/purchase/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        service: selectedService,
        country: selectedCountry,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setMessage(data.error);
        else {
          setPurchaseData(data);
          setMessage(`✅ Number purchased: ${data.phone_number}`);
        }
      })
      .catch(() => setMessage("Failed to purchase number"))
      .finally(() => setLoading(false));
  };

  const handleCheckSMS = () => {
    if (!purchaseData || !purchaseData.activation_id) {
      setMessage("No active purchase found.");
      return;
    }
    setCheckingSMS(true);
    fetch(`${import.meta.env.VITE_BACKEND_BASE}/api/virtualnumbers/sms/${purchaseData.activation_id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setMessage(data.error);
        else {
          setSmsData(data);
          if (data.sms) {
            setMessage(`📩 Message received: ${data.sms}`);
            setAutoCheck(false);
          } else setMessage("⏳ Waiting for SMS...");
        }
      })
      .catch(() => setMessage("Failed to check SMS"))
      .finally(() => setCheckingSMS(false));
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Smartphone className="text-indigo-500" />
            Virtual Numbers
          </h1>
          <Link
            to="/deposits"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition text-center"
          >
            Recharge
          </Link>
        </div>

        <p className="text-gray-600 mb-6 text-sm sm:text-base text-center sm:text-left">
          Buy temporary phone numbers for SMS verifications on your favorite platforms.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
              <MessageSquare className="text-indigo-500" />
              Select Platform
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              value={selectedService}
              onChange={handleServiceChange}
            >
              <option value="">-- Choose Platform --</option>
              {services.length > 0 ? (
                services.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
          </div>

          {selectedService && (
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
                {countries.length > 0 ? (
                  countries.map((c) => (
                    <option key={c.country_name.eng} value={c.country_name.eng}>
                      {c.country_name.eng} - {countryPrices[c.country_name.eng]?.local} {countryPrices[c.country_name.eng]?.currency}
                    </option>
                  ))
                ) : (
                  <option disabled>No countries available</option>
                )}
              </select>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePurchase}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            }`}
          >
            {loading ? "Processing..." : "Get Number"}
          </motion.button>

          {purchaseData && (
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAutoCheck(true);
                  handleCheckSMS();
                }}
                disabled={checkingSMS || autoCheck}
                className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base ${
                  checkingSMS || autoCheck
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-md"
                }`}
              >
                <MailCheck className="w-5 h-5" />
                {autoCheck ? "Auto Checking..." : "Check SMS"}
              </motion.button>

              {autoCheck && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAutoCheck(false)}
                  className="flex-1 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
                >
                  <XCircle className="w-5 h-5" />
                  Stop Checking
                </motion.button>
              )}
            </div>
          )}
        </div>

        {message && (
          <div className="mt-4 text-center font-medium text-gray-700 bg-indigo-50 p-3 rounded-lg shadow-inner text-sm sm:text-base">
            {message}
          </div>
        )}

        {smsData && smsData.sms && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-center text-sm sm:text-base">
            <strong>Latest SMS:</strong> {smsData.sms}
          </div>
        )}
      </motion.div>
    </div>
  );
}
