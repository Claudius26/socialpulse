import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

function DepositCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const depositId = params.get("deposit_id");

    if (!depositId) {
      navigate("/dashboard");
      return;
    }

    const checkDeposit = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
          `http://localhost:8000/api/deposit/status/${depositId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch deposit status");
        }

        const data = await res.json();

        if (data.status === "paid") {
          navigate(`/deposit/success?deposit_id=${depositId}`);
        } else if (data.status === "failed") {
          navigate(`/deposit/failed?deposit_id=${depositId}`);
        } else {
          navigate(`/deposit/pending?deposit_id=${depositId}`);
        }
      } catch (err) {
        console.error("Error verifying deposit:", err);
        navigate("/deposit/failed");
      }
    };

    checkDeposit();
  }, [location.search, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <p className="text-lg text-gray-600">Verifying your payment...</p>
        <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}

export default DepositCallback;
