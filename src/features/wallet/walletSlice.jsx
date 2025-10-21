import { createSlice } from "@reduxjs/toolkit";

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
});

export const { setBalance, addDeposit, setLoading, setError, resetWallet } =
  walletSlice.actions;

export default walletSlice.reducer;
