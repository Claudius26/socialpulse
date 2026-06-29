import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  MessageSquare,
  MailCheck,
  XCircle,
  Search,
  Banknote,
  Copy,
  Check,
} from "lucide-react";
import { Link } from "react-router";

import COUNTRIES from "../data/countries";
import PLATFORMS from "../data/platforms";
import { filterByAlphabet } from "../utils/filterByAlphabet";

/* -----------------------------
   Inline SearchableSelect (Option 2)
   - Search input appears INSIDE dropdown when opened
   - Uses your existing styling style (p-3 border rounded-lg, focus ring)
-------------------------------- */
function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder = "-- Choose --",
  getLabel = (opt) => opt?.label ?? "",
  getValue = (opt) => opt?.value ?? "",
  queryPlaceholder = "Search (A-Z)...",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // reset query whenever dropdown opens
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => String(getValue(o)) === String(value));
    return found ? getLabel(found) : "";
  }, [options, value, getLabel, getValue]);

  const filteredOptions = useMemo(() => {
    return filterByAlphabet(options, query, (o) => getLabel(o));
  }, [options, query, getLabel]);

  const pick = (opt) => {
    onChange(String(getValue(opt)));
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Trigger (styled like your select) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={`input text-left ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        <span className={selectedLabel ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}>
          {selectedLabel || placeholder}
        </span>
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
          {/* Search input INSIDE dropdown */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 input px-3 py-2">
              <Search className="w-4 h-4 text-brand-500 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={queryPlaceholder}
                className="w-full outline-none text-sm sm:text-base bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-56 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-slate-500 dark:text-slate-400">No results.</div>
            ) : (
              filteredOptions.map((opt) => {
                const optVal = String(getValue(opt));
                const active = String(value) === optVal;

                return (
                  <button
                    type="button"
                    key={optVal}
                    onClick={() => pick(opt)}
                    className={`w-full text-left px-4 py-3 text-sm sm:text-base hover:bg-brand-50 dark:hover:bg-slate-800 transition ${
                      active
                        ? "bg-brand-50 dark:bg-slate-800 font-semibold text-brand-700 dark:text-brand-300"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {getLabel(opt)}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

  const [copied, setCopied] = useState("");
  const resultRef = useRef(null);
  const smsRef = useRef(null);

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  };

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

    const poolId = pool?.pool_id ?? pool?.pool ?? null;
    if (!poolId) {
      setMessage("Invalid package selected (missing pool_id).");
      return;
    }

    setMessage("");
    setPurchasingId(String(poolId));

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
            pool_id: poolId,
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
        { headers: { Authorization: `Bearer ${token}` } }
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

  // Auto-scroll to the purchased number as soon as it arrives.
  useEffect(() => {
    if (purchaseData) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [purchaseData]);

  // Auto-scroll to the SMS the moment it is received.
  useEffect(() => {
    if (smsData?.sms) {
      smsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [smsData]);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Virtual Numbers
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                Global <span className="heading-gradient">Numbers</span>
              </h1>
            </div>

            <Link to="/deposits" className="btn btn-sm btn-outline shrink-0">
              <Banknote className="w-4 h-4" />
              Not enough funds? Deposit.
            </Link>
          </div>

          {/* Selection form */}
          <div className="card p-5 sm:p-6">
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm sm:text-base">
              Select your country and platform, search pools, then purchase a number
              to receive SMS codes.
            </p>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-500" />
                    Select Country
                  </label>

                  <SearchableSelect
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    options={countries}
                    placeholder="-- Choose Country --"
                    queryPlaceholder="Search country (A-Z)..."
                    getLabel={(c) => c.name}
                    getValue={(c) => c.code}
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-500" />
                    Select Platform
                  </label>

                  <SearchableSelect
                    value={selectedService}
                    onChange={setSelectedService}
                    options={services}
                    placeholder="-- Choose Platform --"
                    queryPlaceholder="Search platform (A-Z)..."
                    getLabel={(s) => s.name}
                    getValue={(s) => s.id}
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSearch}
                disabled={searching}
                className="btn btn-lg btn-primary w-full"
              >
                <Search className="w-5 h-5" />
                {searching ? "Searching..." : "Search"}
              </motion.button>
            </div>
          </div>

          {selectedCountry && selectedService && pools.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Available numbers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pools.map((pool, idx) => {
                  const poolId = pool?.pool_id ?? pool?.pool ?? `idx-${idx}`;
                  const isBuying = purchasingId === String(poolId);

                  return (
                    <div
                      key={String(poolId)}
                      className="card card-hover p-5 flex flex-col gap-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 shrink-0">
                              <Globe className="w-5 h-5" />
                            </span>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                              {selectedCountryName}
                            </p>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                            {selectedServiceName}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Success Rate:{" "}
                            <strong className="text-emerald-600 dark:text-emerald-400">
                              {pool.success_rate ?? 0}%
                            </strong>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-slate-900 dark:text-white font-bold text-base sm:text-lg flex items-center justify-end gap-1">
                            <Banknote className="w-4 h-4 text-brand-500" />
                            {pool.price_with_profit} {pool.currency || "NGN"}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          handlePurchase(pool)}}
                        disabled={isBuying}
                        className="btn btn-md btn-primary w-full"
                      >
                        <Smartphone className="w-4 h-4" />
                        {isBuying ? "Purchasing..." : "Buy number"}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {purchaseData && (
            <div ref={resultRef} className="mt-8 scroll-mt-24">
              <div className="card p-4 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40">
                <p className="text-xs uppercase tracking-wide text-emerald-700/70 dark:text-emerald-400/70 mb-1 text-center">
                  Purchased Number
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg sm:text-xl font-bold text-emerald-800 dark:text-emerald-300 tabular-nums">
                    {purchaseData.phone_number}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(purchaseData.phone_number, "number")}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                  >
                    {copied === "number" ? (
                      <><Check className="w-3.5 h-3.5" /> Copied</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy</>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setAutoCheck(true);
                    handleCheckSMS();
                  }}
                  disabled={checkingSMS || autoCheck}
                  className="btn btn-lg btn-primary flex-1"
                >
                  <MailCheck className="w-5 h-5" />
                  {autoCheck ? "Auto Checking..." : "Check SMS"}
                </motion.button>

                {autoCheck && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setAutoCheck(false)}
                    className="btn btn-lg flex-1 text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20"
                  >
                    <XCircle className="w-5 h-5" />
                    Stop Checking
                  </motion.button>
                )}
              </div>
            </div>
          )}

          {message && (
            <div className="mt-5 text-center font-medium text-slate-700 dark:text-slate-300 bg-brand-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-sm sm:text-base">
              {message}
            </div>
          )}

          {smsData && smsData.sms && (
            <div
              ref={smsRef}
              className="mt-4 scroll-mt-24 card p-4 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40"
            >
              <p className="text-xs uppercase tracking-wide text-emerald-700/70 dark:text-emerald-400/70 mb-1 text-center">
                Received SMS / Code
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg sm:text-xl font-bold text-emerald-800 dark:text-emerald-300 break-all">
                  {smsData.sms}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(smsData.sms, "sms")}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                >
                  {copied === "sms" ? (
                    <><Check className="w-3.5 h-3.5" /> Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy</>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
