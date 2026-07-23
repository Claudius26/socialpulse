// Countries the platform serves. Each user's wallet currency is set from this.
// `iso2` is the ISO 3166-1 alpha-2 code (lowercase) — it drives the phone-number
// field's country/dial-code (e.g. Nigeria -> ng -> +234) so a number always
// matches the account's country. `dial` is the international calling code.
export const SUPPORTED_COUNTRIES = [
  { name: "Nigeria", currency: "NGN", flag: "🇳🇬", iso2: "ng", dial: "234" },
  { name: "Ghana", currency: "GHS", flag: "🇬🇭", iso2: "gh", dial: "233" },
  { name: "Kenya", currency: "KES", flag: "🇰🇪", iso2: "ke", dial: "254" },
  { name: "South Africa", currency: "ZAR", flag: "🇿🇦", iso2: "za", dial: "27" },
  { name: "Cameroon", currency: "XAF", flag: "🇨🇲", iso2: "cm", dial: "237" },
  { name: "Togo", currency: "XOF", flag: "🇹🇬", iso2: "tg", dial: "228" },
  { name: "Côte d'Ivoire", currency: "XOF", flag: "🇨🇮", iso2: "ci", dial: "225" },
  { name: "Senegal", currency: "XOF", flag: "🇸🇳", iso2: "sn", dial: "221" },
  { name: "Benin", currency: "XOF", flag: "🇧🇯", iso2: "bj", dial: "229" },
  { name: "Uganda", currency: "UGX", flag: "🇺🇬", iso2: "ug", dial: "256" },
];
