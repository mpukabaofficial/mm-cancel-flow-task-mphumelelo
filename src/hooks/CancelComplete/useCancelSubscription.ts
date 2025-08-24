import { useUser } from "@/contexts/UserContext";
import { subscriptionService } from "@/lib/api";
import { useEffect, useState } from "react";
const useCancelSubscription = () => {
    const {subscription} = useUser()
  // Hook logic here
    const [subscriptionCancelled, setSubscriptionCancelled] = useState(false);

    useEffect(() => {
    const cancelSubscription = async () => {
      if (subscription?.id && !subscriptionCancelled) {
        try {
          await subscriptionService.cancel(subscription.id);
          setSubscriptionCancelled(true);
          console.log("Subscription cancelled successfully");
        } catch (error) {
          console.error("Failed to cancel subscription:", error);
          // Still show completion UI even if API call fails
          setSubscriptionCancelled(true);
        }
      }
    };

    cancelSubscription();
  }, [subscription?.id, subscriptionCancelled])

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

  return  expirationDate;
};

export default useCancelSubscription;