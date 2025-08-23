import React, { useEffect, useState } from "react";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import { Step } from "@/types/step";
import { subscriptionService } from "@/lib/api";
import { useUser } from "@/contexts/UserContext";

interface Props {}

const JobCancelComplete = ({}: Props) => {
  const [subscriptionCancelled, setSubscriptionCancelled] = useState(false);
  const { subscription } = useUser();

  // Cancel the subscription when this component mounts (user found job and completed visa process)
  useEffect(() => {
    const cancelSubscription = async () => {
      if (subscription?.id && !subscriptionCancelled) {
        try {
          await subscriptionService.cancel(subscription.id);
          setSubscriptionCancelled(true);
          console.log('Subscription cancelled successfully for job completion');
        } catch (error) {
          console.error('Failed to cancel subscription:', error);
          // Still show completion UI even if API call fails
          setSubscriptionCancelled(true);
        }
      }
    };

    cancelSubscription();
  }, [subscription?.id, subscriptionCancelled]);
  return (
    <div className="w-full space-y-5">
        <h1 className="text-large">
          All done, your cancellation’s been processed.
        </h1>
        <p className="tracking-[-1px] text-xl">
          We’re stoked to hear you’ve landed a job and sorted your visa. Big
          congrats from the team. 🙌
        </p>
        <HorizontalLine />
        <Button variant="primary">Finish</Button>
    </div>
  );
};

export default JobCancelComplete;
