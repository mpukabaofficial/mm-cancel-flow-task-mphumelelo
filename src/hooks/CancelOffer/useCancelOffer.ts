import { useUser } from "@/contexts/UserContext";
import { cancellationService, subscriptionService } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

const useCancelOffer = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVariantA, setIsVariantA] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    subscription,
    user,
    updateSubscriptionStatus,
    isLoading: userLoading,
    cancellationId,
  } = useUser();

  const id = cancellationId || "";

  // Set loading to false when user data is loaded
  useEffect(() => {
    if (!userLoading && subscription) {
      setIsLoading(false);
    }
  }, [userLoading, subscription]);

  const handleDownsellResponse = useCallback(
    async (accepted: boolean) => {
      if (!subscription?.id || submitting || !user?.id) return;

      setSubmitting(true);
      setError(null);

      try {
        // Update cancellation record
        await cancellationService.update(id, {
          accepted_downsell: accepted,
        });

        if (accepted) {
          // User accepted the downsell offer
          const newPrice = Math.floor(subscription.monthly_price * 0.5);

          await subscriptionService.acceptDownsell(subscription.id, newPrice);

          updateSubscriptionStatus("active");
        } else {
          // User declined the offer, cancel the subscription
          await subscriptionService.cancel(subscription.id);
        }
      } catch (err) {
        console.error("Failed to update cancellation:", err);
        setError("Failed to save your response. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [
      subscription?.id,
      subscription?.monthly_price,
      submitting,
      user?.id,
      id,
      updateSubscriptionStatus,
    ]
  );

  return {
    handleDownsellResponse,
    setIsVariantA,
    loading: userLoading || isLoading,
    setLoading: setIsLoading,
    isVariantA,
    submitting,
    error,
  };
};

export default useCancelOffer;
