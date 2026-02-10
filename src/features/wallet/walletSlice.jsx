import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const Backend_URL = import.meta.env.VITE_BACKEND_BASE;

export const fetchTransactions = createAsyncThunk(
  "wallet/fetchTransactions",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${Backend_URL}/api/deposit/transactions/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: 0,
    deposits: [],
    loading: false,
    error: null,
  },
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    addDeposit: (state, action) => {
      state.deposits.push(action.payload);
      state.balance += action.payload.amount;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetWallet: (state) => {
      state.balance = 0;
      state.deposits = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.deposits = action.payload;

        const paidDeposits = action.payload.filter((d) => d.status === "paid");
        state.balance = paidDeposits.reduce((sum, d) => sum + d.amount, 0);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setBalance,
  addDeposit,
  setLoading,
  setError,
  resetWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
