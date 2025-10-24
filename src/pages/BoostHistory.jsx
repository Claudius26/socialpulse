import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function BoostHistory() {
  const [boosts, setBoosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoosts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://127.0.0.1:8000/api/boost/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        setBoosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoosts();
    const interval = setInterval(fetchBoosts, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 text-sm sm:text-base">
        Loading your boost history...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-10 text-sm sm:text-base">
        Error: {error}
      </p>
    );

  if (boosts.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 sm:px-6">
        <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
          Nothing to see here.
        </p>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Boost your social platform to get more engagement 🚀
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Return to Dashboard
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
          Boost History
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="grid gap-4">
        {boosts.map((boost) => (
          <div
            key={boost.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition duration-300 p-4 sm:p-5 break-words"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <h2 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 sm:mb-0">
                {boost.platform} - {boost.service}
              </h2>
              <span
                className={`text-xs sm:text-sm px-3 py-1 rounded-full w-fit ${
                  boost.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : boost.status === "Failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {boost.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-1 break-all">
              Target:{" "}
              <a
                href={boost.target}
                className="text-blue-500 hover:underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {boost.target}
              </a>
            </p>
            <p className="text-sm text-gray-600">Quantity: {boost.quantity}</p>
            <p className="text-sm text-gray-600">
              Amount: ₦{parseFloat(boost.amount).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Ordered: {new Date(boost.created_at).toLocaleString()}
            </p>
            {boost.delivery_time && (
              <p className="text-sm text-gray-500">
                Estimated Delivery: {boost.delivery_time}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
