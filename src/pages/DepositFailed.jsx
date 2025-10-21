import { useNavigate } from "react-router";

function DepositFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-100 to-red-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          Payment Failed
        </h2>
        <p className="text-gray-700 text-lg mb-6">
          Unfortunately, your payment could not be completed.
        </p>
        <p className="text-gray-600 mb-8">
          Please try again or contact support if the issue persists.
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

export default DepositFailed;
