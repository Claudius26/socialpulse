// A user's spendable balance is their main balance minus whatever is currently
// held (reserved) for pending orders — e.g. a virtual number waiting on its SMS.
// The held amount is returned to `balance` if the order is cancelled, or spent
// for good once the service is delivered.
export const availableBalance = (wallet) =>
  Number(wallet?.balance || 0) - Number(wallet?.reserved_balance || 0);

export const heldBalance = (wallet) => Number(wallet?.reserved_balance || 0);
