import React, { useEffect, useState } from "react";
import CancellationCard from "./CancellationCard";
import HorizontalLine from "./ui/HorizontalLine";
import Button from "./ui/Button";
import { Subscription } from "@/contexts/UserContext";
import { Step } from "@/types/step";
import { useNavigateApp } from "@/hooks/useNavigateApp";
import { subscriptionService } from "@/lib/api";

interface Props {
  onClose: () => void;
  step: Step;
  setStep: (step: Step) => void;
  totalSteps: number;
  subscription: Subscription | null;
  setNavigatingHome?: (value: boolean) => void;
}

const CancelComplete = ({
  onClose,
  setStep,
  step,
  totalSteps,
  subscription,
  setNavigatingHome,
}: Props) => {
  const [subscriptionCancelled, setSubscriptionCancelled] = useState(false);

  // Cancel the subscription when this component mounts (final completion)
  useEffect(() => {
    const cancelSubscription = async () => {
      if (subscription?.id && !subscriptionCancelled) {
        try {
          await subscriptionService.cancel(subscription.id);
          setSubscriptionCancelled(true);
          console.log('Subscription cancelled successfully');
        } catch (error) {
          console.error('Failed to cancel subscription:', error);
          // Still show completion UI even if API call fails
          setSubscriptionCancelled(true);
        }
      }
    };

    cancelSubscription();
  }, [subscription?.id, subscriptionCancelled]);
  // Calculate when subscription expires (next billing date)
  const calculateExpirationDate = () => {
    if (!subscription || !subscription.created_at) {
      // Fallback to 30 days from now if no subscription data
      const fallbackEnd = new Date();
      fallbackEnd.setDate(fallbackEnd.getDate() + 30);
      return fallbackEnd.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
    }

    const subscriptionStart = new Date(subscription.created_at);
    const today = new Date();

    // Calculate next billing date (monthly cycle from creation date)
    const nextBillingDate = new Date(subscriptionStart);

    // Find the next billing date by adding months until we're in the future
    while (nextBillingDate <= today) {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    return nextBillingDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  const expirationDate = calculateExpirationDate();
  const { handleGoHome } = useNavigateApp();

  return (
    <CancellationCard
      step={step}
      onClose={onClose}
      totalSteps={totalSteps}
      onSetStep={setStep}
      completed={true}
    >
      <div className="w-full space-y-5">
        <div className="space-y-2">
          <div>
            <p className="text-large mb-5">Sorry to see you go, mate.</p>
            <p className="text-3xl tracking-[-0.9px]">
              Thanks for being with us, and you’re always welcome back.
            </p>
          </div>
          <div>
            <p className="tracking-[-0.8px] mb-4">
              Your subscription is set to end on {expirationDate}. <br />
              You&apos;ll still have full access until then. No further charges
              after that.
            </p>
            <p className="text-normal tracking-[-0.8px]">
              Changed your mind? You can reactivate anytime before your end
              date.
            </p>
          </div>
        </div>
        <HorizontalLine />
        <Button onClick={() => handleGoHome(onClose, setNavigatingHome)} variant="primary">
          Back to Jobs
        </Button>{" "}
      </div>
    </CancellationCard>
  );
};

export default CancelComplete;
