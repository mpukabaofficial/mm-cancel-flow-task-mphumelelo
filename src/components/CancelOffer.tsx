import React, { useCallback, useEffect, useState } from "react";
import CancellationCard from "./CancellationCard";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import { cancellationService, subscriptionService } from "@/lib/api";
import { useUser } from "@/contexts/UserContext";
import { DownsellVariant, calculateDownsellPrice } from "@/lib/variant";

interface Props {
  onClose: () => void;
  id: string;
  step: number;
  setStep: (step: number) => void;
  variant: DownsellVariant;
}
const CancelOffer = ({ onClose, id, setStep, step, variant }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVariantA, setIsVariantA] = useState(false);

  const { subscription, user, updateSubscriptionStatus } = useUser();

  // Check if this is variant A (skip downsell step)
  useEffect(() => {
    if (variant === "A") {
      setIsVariantA(true);
      // For variant A, automatically proceed to next step
      // This effect should only run once when variant is determined
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [variant]); // Remove step and setStep from dependencies to prevent infinite loops

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
          // Calculate new price and update subscription
          //   const newPrice = calculateDownsellPrice(subscription.monthly_price);

          // Update subscription status to active with new price
          await subscriptionService.updateStatus(subscription.id, "active");

          // Update local subscription state
          updateSubscriptionStatus("active");

          setStep(step + 1);
        } else {
          // User declined the offer, continue with cancellation flow
          setStep(step + 1);
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

  // Calculate discounted price for display
  const originalPrice = subscription?.monthly_price || 25;
  const discountedPrice = calculateDownsellPrice(originalPrice);

  return (
    <CancellationCard onSetStep={setStep} onClose={onClose} step={step}>
      {/* handle error globally */}
      <div className="w-full space-y-5">
        <h1 className="text-large">
          We built this to help you land the job, this makes it a little easier.
        </h1>
        <p className="text-2xl tracking-[-1.2px] text-gray-warm-700">
          We’ve been there and we’re here to help you.
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
            <span className="line-through tracking-[-0.8px] font-normal">
              ${originalPrice} /month
            </span>
          </div>
          <Button
            isSelected
            onClick={() => handleDownsellResponse(true)}
            disabled={submitting}
          >
            {submitting
              ? "Processing..."
              : `Get $${originalPrice - discountedPrice} off`}
          </Button>
          <p className="text-xs italic font-normal text-center w-full">
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
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </CancellationCard>
  );
};

export default CancelOffer;
