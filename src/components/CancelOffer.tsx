import React, { useCallback, useEffect, useState } from "react";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import { cancellationService, subscriptionService } from "@/lib/api";
import { useUser } from "@/contexts/UserContext";
import { DownsellVariant, calculateDownsellPrice } from "@/lib/variant";
import { Step } from "@/types/step";
import { Skeleton, SkeletonText, SkeletonButton } from "./ui/Skeleton";

interface Props {
  id: string;
  step: Step;
  setStep: (step: Step) => void;
  variant: DownsellVariant;
}
const CancelOffer = ({
  id,
  setStep,
  step,
  variant,
}: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVariantA, setIsVariantA] = useState(false);
  const [loading, setLoading] = useState(true);

  const { subscription, user, updateSubscriptionStatus, isLoading: userLoading } = useUser();

  // Check if this is variant A (skip downsell step)
  useEffect(() => {
    if (variant === "A") {
      setIsVariantA(true);
      // For variant A, automatically proceed to next step
      // This effect should only run once when variant is determined
      const timer = setTimeout(() => {
        setStep({ ...step, num: step.num + 1 });
      }, 0);
      return () => clearTimeout(timer);
    }
    setLoading(false);
  }, [variant, step, setStep]);

  // Set loading to false when user data is loaded
  useEffect(() => {
    if (!userLoading && subscription) {
      setLoading(false);
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
          // Calculate new price (typically 50% discount)
          const newPrice = Math.floor(subscription.monthly_price * 0.5);

          // Update subscription with new price and reset cancellation status
          await subscriptionService.acceptDownsell(subscription.id, newPrice);

          // Update local subscription state
          updateSubscriptionStatus("active");

          setStep({ option: "A", num: step.num + 1 });
        } else {
          // User declined the offer, cancel the subscription
          await subscriptionService.cancel(subscription.id);
          
          setStep({ option: "B", num: step.num + 1 });
        }
      } catch (err) {
        console.error("Failed to update cancellation:", err);
        setError("Failed to save your response. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [
      id,
      subscription,
      submitting,
      user?.id,
      setStep,
      step,
      updateSubscriptionStatus,
    ]
  );

  // Don't render anything for variant A (they skip this step)
  if (isVariantA || variant === "A") {
    return null;
  }

  // Show skeleton while loading
  if (loading || userLoading || !subscription) {
    return (
      <div className="w-full space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-8 w-4/5" />
          <SkeletonText lines={1} />
        </div>
        <div className="p-3 border border-gray-200 bg-gray-50 rounded-xl space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <div className="flex gap-[10px] items-end justify-center w-full">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <SkeletonButton className="bg-green-100" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>
        <div className="border-t border-gray-200" />
        <SkeletonButton />
      </div>
    );
  }

  // Calculate discounted price for display
  const originalPrice = subscription?.monthly_price || 25;
  const discountedPrice = calculateDownsellPrice(originalPrice);

  return (
    <div className="w-full space-y-5">
        <h1 className="text-large">
          We built this to help you land the job, this makes it a little easier.
        </h1>
        <p className="text-2xl tracking-[-1.2px] text-gray-warm-700">
          We've been there and we're here to help you.
        </p>
        <div className="p-3 border border-Brand-Migrate-Mate bg-Brand-Background rounded-xl">
          <h2 className="text-[28px] mb-2 tracking-[-1.2px] text-center">
            Here&apos;s ${originalPrice - discountedPrice} off until you find a
            job.
          </h2>
          <div className="flex gap-[10px] items-end justify-center w-full mb-4">
            <span className="text-Brand-Migrate-Mate text-2xl tracking-[-1.2px]">
              ${discountedPrice}/month
            </span>
            <span className="line-through text-normal">
              ${originalPrice} /month
            </span>
          </div>
          <Button
            variant="green"
            onClick={() => handleDownsellResponse(true)}
            disabled={submitting}
          >
            {submitting
              ? "Processing..."
              : `Get $${originalPrice - discountedPrice} off`}
          </Button>
          <p className="fine-print text-center w-full">
            You won&apos;t be charged until your next billing date.
          </p>
        </div>
        <HorizontalLine />
        <Button
          onClick={() => handleDownsellResponse(false)}
          disabled={submitting}
        >
          No thanks
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
  );
};

export default CancelOffer;
