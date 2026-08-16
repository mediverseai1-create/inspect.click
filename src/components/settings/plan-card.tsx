import { Card, Badge } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { PLAN_PRICES, getPaymentLink, type PlanId } from "@/lib/payment-links";

const PLAN_ORDER: PlanId[] = ["free", "starter", "pro", "scale"];

export function PlanCard({ currentPlan }: { currentPlan: PlanId }) {
  const currentIndex = PLAN_ORDER.indexOf(currentPlan);
  const nextPlan = PLAN_ORDER[currentIndex + 1];
  const nextPlanLink = nextPlan ? getPaymentLink(nextPlan) : null;

  return (
    <Card className="p-6.5">
      <h3 className="text-[17px] mb-4.5">Plan & billing</h3>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[13px] text-ink-55">Current plan</div>
          <div className="text-[22px] font-serif mt-0.5">
            {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            {PLAN_PRICES[currentPlan] > 0 && <span className="text-[14px] font-sans text-ink-55"> — ${PLAN_PRICES[currentPlan]}/mo</span>}
          </div>
        </div>
        <Badge tone="amber">{currentPlan.toUpperCase()}</Badge>
      </div>

      {nextPlan && (
        <div className="pt-4 border-t border-line flex items-center justify-between flex-wrap gap-3">
          <p className="text-[13.5px] text-ink-70 max-w-[320px]">
            Upgrade to {nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)} (${PLAN_PRICES[nextPlan]}/mo) for more locations and higher-tier features.
          </p>
          {nextPlanLink ? (
            <ButtonLink href={nextPlanLink} variant="amber" className="px-5 py-2.5 text-sm">Upgrade</ButtonLink>
          ) : (
            <span className="mono text-[11px] text-ink-55 px-3 py-2 border border-line rounded-full">PAYMENT LINK NOT CONFIGURED</span>
          )}
        </div>
      )}
    </Card>
  );
}
