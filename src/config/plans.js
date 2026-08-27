// Shared subscription plan definitions, used by onboarding plan selection and the Billing page.

export const FREE_UPLOAD_LIMIT = 3;
export const PAID_UPLOAD_LIMIT = 20;

export const SUBSCRIPTION_PLANS = [
  {
    id: "monthly",
    name: "1 Month",
    price: 9.99,
    priceLabel: "$9.99",
    period: "/month",
    months: 1,
    billingNote: "Billed monthly",
    tagline: "Try it out, cancel anytime",
  },
  {
    id: "6month",
    name: "6 Months",
    price: 50,
    priceLabel: "$50",
    period: "/6 months",
    months: 6,
    billingNote: "Billed every 6 months",
    tagline: "A little planning, real savings",
  },
  {
    id: "1year",
    name: "1 Year",
    price: 99,
    priceLabel: "$99",
    period: "/year",
    months: 12,
    billingNote: "Billed annually",
    tagline: "Best price per month",
    recommended: true,
  },
];

const BASE_MONTHLY_PRICE = SUBSCRIPTION_PLANS.find((plan) => plan.months === 1)?.price ?? 0;

export function getPlanById(planId) {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) ?? null;
}

// What this plan works out to per month, so a $50/6-months price is easy to compare to $9.99/month.
export function getMonthlyEquivalent(plan) {
  return plan.price / plan.months;
}

// % cheaper per month than paying monthly, e.g. the 1-year plan vs. 12x the monthly price.
export function getSavingsPercent(plan) {
  if (plan.months <= 1 || !BASE_MONTHLY_PRICE) return 0;
  const payingMonthly = BASE_MONTHLY_PRICE * plan.months;
  return Math.round(((payingMonthly - plan.price) / payingMonthly) * 100);
}
