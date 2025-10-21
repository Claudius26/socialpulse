import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Loader2 } from "lucide-react";

function DepositPending() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(120); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const depositId = params.get("deposit_id");
    const token = localStorage.getItem("access_token");

    if (!depositId) {
      navigate("/dashboard");
      return;
    }

    let intervalId;
    let timerId;

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/deposit/status/${depositId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to check deposit status");
        const data = await res.json();

        if (data.status === "paid") {
          clearInterval(intervalId);
          clearTimeout(timerId);
          navigate(`/deposit/success?deposit_id=${depositId}`);
        } else if (data.status === "failed") {
          clearInterval(intervalId);
          clearTimeout(timerId);
          navigate(`/deposit/failed?deposit_id=${depositId}`);
        }
      } catch (err) {
        console.error("Error checking deposit:", err);
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 2000);

  
    timerId = setTimeout(async () => {
      clearInterval(intervalId);
      try {
        await fetch(`http://localhost:8000/api/deposit/status/${depositId}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "failed" }),
        });
      } catch (err) {
        console.error("Timeout marking deposit failed:", err);
      }
      navigate(`/deposit/failed?deposit_id=${depositId}`);
    }, 120000); 
    const countdown = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timerId);
      clearInterval(countdown);
    };
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-blue-700 mb-4">
          Payment Pending
        </h2>
        <p className="text-gray-700 text-lg mb-4">
          Your payment is being processed. This may take a few moments.
        </p>
        <p className="text-gray-600 mb-6">
          If payment doesn’t complete within{" "}
          <span className="font-semibold text-blue-600">{timeLeft}s</span>, it
          will be marked as failed automatically.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default DepositPending;
