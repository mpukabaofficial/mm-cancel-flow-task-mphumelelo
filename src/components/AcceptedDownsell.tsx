"use client";

import { Step } from "@/types/step";
import CancellationCard from "./CancellationCard";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import { useNavigateApp } from "@/hooks/useNavigateApp";
import { Subscription } from "@/contexts/UserContext";

interface Props {
  onClose: () => void;
  step: Step;
  setStep: (step: Step) => void;
  totalSteps: number;
  subscription?: Subscription | null;
  setNavigatingHome?: (value: boolean) => void;
}

const AcceptedDownsell = ({
  onClose,
  setStep,
  step,
  totalSteps,
  subscription,
  setNavigatingHome,
}: Props) => {
  const { handleGoHome } = useNavigateApp();

  // Calculate billing dates based on subscription created_at date
  const calculateBillingDates = () => {
    if (!subscription || !subscription.created_at) {
      // Fallback to 30 days from now if no subscription data or created_at
      const fallbackEnd = new Date();
      fallbackEnd.setDate(fallbackEnd.getDate() + 30);
      return {
        daysLeft: 30,
        nextBillingDate: fallbackEnd.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        }),
      };
    }

    const subscriptionStart = new Date(subscription.created_at);
    const today = new Date();

    // Calculate next billing date (monthly cycle from creation date)
    const nextBillingDate = new Date(subscriptionStart);

    // Find the next billing date by adding months until we're in the future
    while (nextBillingDate <= today) {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    // Calculate days left until next billing
    const timeDiff = nextBillingDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return {
      daysLeft: Math.max(0, daysLeft),
      nextBillingDate: nextBillingDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
    };
  };

  const { daysLeft, nextBillingDate } = calculateBillingDates();
  return (
    <CancellationCard
      totalSteps={totalSteps}
      step={step}
      onSetStep={setStep}
      onClose={onClose}
      hideNavigation={true}
    >
      <div className="w-full space-y-5 ">
        <div className="text-large ">
          <p className="mb-5">Great choice, mate!</p>
          <p className="tracking-[-2.9px] ">
            <span>You&apos;re still on the path to your dream role.</span>{" "}
            <span className="text-Brand-Migrate-Mate">
              Let’s make it happen together!
            </span>
          </p>
        </div>
        <div className="font-[var(--font-inter)] ">
          <p className="mb-4">
            You&apos;ve got {daysLeft} days left on your current plan. Starting
            from {nextBillingDate}, your monthly payment will be $
            {subscription?.monthly_price
              ? (subscription.monthly_price - 10).toFixed(2)
              : "15.00"}
            .
          </p>
          <p className="fine-print">You can cancel anytime before then.</p>
        </div>
        <HorizontalLine />
        <Button onClick={() => handleGoHome(onClose, setNavigatingHome)} variant="primary">
          Land your dream role
        </Button>
      </div>
    </CancellationCard>
  );
};

export default AcceptedDownsell;
