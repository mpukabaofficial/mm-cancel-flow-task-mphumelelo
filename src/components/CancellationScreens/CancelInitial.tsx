"use client";

import Button from "@/components/ui/Button";
import HorizontalLine from "@/components/ui/HorizontalLine";
import { useUser } from "@/contexts/UserContext";
import { cancellationService } from "@/lib/cancellationService";
import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Step } from "@/types/step";

interface Props {
  setStep: (step: Step) => void;
  resetNavigation?: (step?: Step) => void;
}

const CancelReasonStep = ({ setStep, resetNavigation }: Props) => {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const [previousJobStatus, setPreviousJobStatus] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    user,
    subscription,
    isLoading: userLoading,
    cancellationId,
  } = useUser();
  const id = cancellationId || "";

  const handleHasFoundJob = useCallback(
    async (hasFoundJob: boolean) => {
      if (!subscription?.id || submitting) return;

      setSubmitting(true);
      setError(null);

      try {
        // Check if user is changing their previous decision
        const isChangingDecision =
          previousJobStatus !== null && previousJobStatus !== hasFoundJob;

        if (isChangingDecision) {
          // Reset all form data if user is changing their job status decision
          await cancellationService.resetToBasic(id);
          // Reset navigation stack to start fresh
          if (resetNavigation) {
            resetNavigation({ num: 0, option: "A" });
          }
        }

        // Check if user has previously accepted a downsell offer
        const updateData: { has_job: boolean; downsell_variant?: 'A' | 'B' } = { has_job: hasFoundJob };
        
        if (!hasFoundJob && user?.id && subscription?.id) {
          // User selected "no job" - check if they've used downsell before
          const hasUsedDownsell = await cancellationService.hasUsedDownsell(
            subscription.id,
            user.id
          );
          
          if (hasUsedDownsell) {
            // User has previously accepted downsell, set them to variant A
            updateData.downsell_variant = 'A';
          }
        }

        // Update with new job status and potentially new variant
        try {
          await cancellationService.update(id, updateData);
        } catch (updateError: unknown) {
          // If update fails because cancellation doesn't exist (fallback UUID case),
          // try to get or create a proper cancellation and then update it
          if (updateError instanceof Error && updateError.message?.includes('not found') && user?.id && subscription?.id) {
            console.log('Fallback UUID detected, creating proper cancellation record');
            const variantResult = await cancellationService.getOrAssignVariant(
              user.id,
              subscription.id
            );
            // Now try the update with the properly created cancellation
            await cancellationService.update(variantResult.id, updateData);
          } else {
            throw updateError;
          }
        }

        // Update the previous job status tracker
        setPreviousJobStatus(hasFoundJob);

        setStep({
          num: 1,
          option: hasFoundJob ? "job-found" : "job-notfound",
        });
      } catch (err) {
        console.error("Failed to update cancellation:", err);
        setError("Failed to save your response. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [
      subscription?.id,
      submitting,
      previousJobStatus,
      id,
      setStep,
      resetNavigation,
      user?.id,
    ]
  );

  useEffect(() => {
    if (!user?.id || !subscription?.id || userLoading) return;

    const loadCancellation = async () => {
      setLoading(true);
      setError(null);

      try {
        const cancellation = await cancellationService.getBySubscription(
          subscription.id,
          user.id
        );

        if (cancellation?.has_job === true) {
          setSelected("yes");
          setPreviousJobStatus(true);
        } else if (cancellation?.has_job === false) {
          setSelected("no");
          setPreviousJobStatus(false);
        } else {
          setSelected(null);
          setPreviousJobStatus(null);
        }
      } catch (err) {
        console.error("Failed to load cancellation:", err);
        setError("Failed to load cancellation data.");
      } finally {
        setLoading(false);
      }
    };

    loadCancellation();
  }, [user?.id, subscription?.id, userLoading]);

  // Remove component-level skeleton - CancellationCard handles all loading states
  // This prevents double skeletons

  return (
    <div className="order-2 md:order-1 space-y-5 w-full">
      <div className="font-semibold space-y-4">
        <p className="text-large md:text-large text-2xl flex flex-col">
          <span>Hey mate,</span>
          <span>Quick one before you go.</span>
        </p>
        <p className="text-large md:text-large text-2xl italic">
          Have you found a job yet?
        </p>
      </div>
      <p className="text-gray-warm-700 text-sm md:text-base tracking-tighter w-full md:w-[469px]">
        Whatever your answer, we just want to help you take the next step. With
        visa support, or by hearing how we can do better.
      </p>
      <HorizontalLine />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="w-full space-y-4">
        <Button
          onClick={() => handleHasFoundJob(true)}
          variant={selected === "yes" ? "green" : "outline"}
          disabled={loading || submitting || userLoading}
        >
          {submitting && selected !== "no" && (
            <Loader2Icon className="animate-spin" />
          )}
          Yes, I&apos;ve found a job
        </Button>

        <Button
          onClick={() => handleHasFoundJob(false)}
          variant={selected === "no" ? "green" : "outline"}
          disabled={loading || submitting || userLoading}
        >
          {submitting && selected !== "no" && (
            <Loader2Icon className="animate-spin" />
          )}
          Not yet – I&apos;m still looking
        </Button>
      </div>
    </div>
  );
};

export default CancelReasonStep;
