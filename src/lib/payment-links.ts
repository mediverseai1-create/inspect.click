export type PlanId = "free" | "starter" | "pro" | "scale";

export const PLAN_PRICES: Record<PlanId, number> = {
  free: 0,
  starter: 47,
  pro: 57,
  scale: 97,
};

export function getPaymentLink(plan: PlanId): string | null {
  switch (plan) {
    case "starter":
      return process.env.STARTER_PAYMENT_LINK || null;
    case "pro":
      return process.env.PRO_PAYMENT_LINK || null;
    case "scale":
      return process.env.SCALE_PAYMENT_LINK || null;
    default:
      return null;
  }
}
