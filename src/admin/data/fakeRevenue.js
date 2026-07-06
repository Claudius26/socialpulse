/**
 * Reference-only fake revenue data for the admin view.
 *
 * ⚠️ This is NOT connected to any backend, wallet, or real money. It exists
 * purely so the admin dashboard can display an illustrative "Total Revenue"
 * figure and a browsable transaction history. Everything here is generated in
 * the browser — deleting this file (and the components importing it) removes the
 * feature with zero impact on the rest of the app.
 *
 * Transactions run once per-ish day from 2021-06-15 to today and sum EXACTLY to
 * the headline total, so the card and the list always reconcile.
 */

// Headline number (₦). A non-round value so it reads as real, and > 63M so the
// label "63 million and more" is literally true.
export const TOTAL_REVENUE = 63_247_900;

// 2021-06-15, anchored at UTC noon so ISO date slicing never drifts across a
// timezone/DST boundary. (month is 0-based: 5 = June)
const START = Date.UTC(2021, 5, 15, 12, 0, 0);
const DAY_MS = 86_400_000;

// Deterministic PRNG so the numbers are stable within a session/build.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SERVICES = ["Virtual Number", "Social Boost", "Giftcard", "Crypto Deposit", "Wallet Funding"];
const NAMES = [
  "Chinedu O.", "Aisha B.", "Emeka N.", "Ngozi A.", "Tunde F.", "Fatima S.",
  "Kelechi U.", "Blessing E.", "Ibrahim M.", "Chioma K.", "David A.", "Zainab Y.",
  "Segun L.", "Amara C.", "Yusuf T.", "Grace O.", "Musa D.", "Peace I.",
  "Obinna R.", "Halima W.", "Samuel P.", "Rukayat Q.", "Victor J.", "Esther H.",
];

function build() {
  const rng = mulberry32(20210615);
  const todayMs = Date.now();

  // 1–4 transactions per day, each with a relative "weight".
  const raw = [];
  for (let t = START; t <= todayMs; t += DAY_MS) {
    const date = new Date(t).toISOString().slice(0, 10);
    const count = 1 + Math.floor(rng() * 4);
    for (let i = 0; i < count; i++) {
      raw.push({
        date,
        weight: 0.2 + rng(),
        service: SERVICES[Math.floor(rng() * SERVICES.length)],
        user: NAMES[Math.floor(rng() * NAMES.length)],
      });
    }
  }

  // Distribute TOTAL_REVENUE across the weights → whole-naira amounts.
  const totalW = raw.reduce((a, r) => a + r.weight, 0) || 1;
  const txns = raw.map((r) => ({
    date: r.date,
    service: r.service,
    user: r.user,
    amount: Math.max(500, Math.round((r.weight / totalW) * TOTAL_REVENUE)),
  }));

  // Absorb the tiny rounding drift into the first (earliest) transaction so the
  // grand total is EXACTLY TOTAL_REVENUE.
  if (txns.length) {
    const drift = TOTAL_REVENUE - txns.reduce((a, t) => a + t.amount, 0);
    txns[0].amount = Math.max(500, txns[0].amount + drift);
  }

  // Newest first, with stable ids.
  return txns.map((t, i) => ({ id: txns.length - i, ...t })).reverse();
}

export const fakeTransactions = build();

// Always the true sum of the list, so the headline card and the table reconcile.
export const fakeTotalRevenue = fakeTransactions.reduce((a, t) => a + t.amount, 0);

export const fakeDateRange = {
  from: fakeTransactions.length ? fakeTransactions[fakeTransactions.length - 1].date : null,
  to: fakeTransactions.length ? fakeTransactions[0].date : null,
};

export const nairaFull = (v) => `₦${Number(v || 0).toLocaleString("en-NG")}`;

// Reference-only "all-time users" figure for its own dashboard card — NOT real
// accounts and NOT the live DB count the admin tracks. Just a display number.
export const FAKE_TOTAL_USERS = 17_965;
