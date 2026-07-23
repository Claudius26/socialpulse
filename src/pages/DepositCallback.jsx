import { useEffect } from "react";
import { getUserAccess } from "../features/auth/token";
import { useNavigate, useLocation } from "react-router";

function DepositCallback() {
  const navigate = useNavigate();
  const location = useLocation();

   const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";  

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const depositId = params.get("deposit_id");

    if (!depositId) {
      navigate("/dashboard");
      return;
    }

    const checkDeposit = async () => {
      try {
        const token = getUserAccess();
        const res = await fetch(
          `${backendBase}/api/deposit/status/${depositId}/`,
          {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
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
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
      <div className="card p-8 text-center max-w-sm w-full">
        <div className="mb-5 animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-brand-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          Verifying your payment...
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Please wait a moment.
        </p>
      </div>
    </div>
  );
}

export default DepositCallback;
