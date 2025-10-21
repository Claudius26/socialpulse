import { useState } from "react";
import { useNavigate } from "react-router";

function Deposits() {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!amount || Number(amount) < 1000) {
      alert("Minimum deposit is ₦1000");
      return;
    }
    navigate(`/deposit/confirm?amount=${amount}&method=paystack`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Deposit Funds
        </h2>

        <input
          type="number"
          placeholder="Enter Amount (₦)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />

        <button
          onClick={handleNext}
          className="w-full text-white py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Deposits;
