"use client";

import Button from "@/components/ui/Button";
import HorizontalLine from "@/components/ui/HorizontalLine";
import { useUser } from "@/contexts/UserContext";
import { cancellationService } from "@/lib/api";
import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CancellationCard from "./CancellationCard";
import { Step } from "@/types/step";

interface Props {
  onClose: () => void;
  id: string;
  step: Step;
  setStep: (step: Step) => void;
  totalSteps: number;
  canGoBack?: boolean;
  onBack?: () => void;
  resetNavigation?: (step?: Step) => void;
}

const CancelReasonStep = ({
  onClose,
  id,
  step,
  setStep,
  totalSteps,
  canGoBack,
  onBack,
  resetNavigation,
}: Props) => {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const [previousJobStatus, setPreviousJobStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, subscription, isLoading: userLoading } = useUser();

  const handleHasFoundJob = useCallback(
    async (hasFoundJob: boolean) => {
      if (!subscription?.id || submitting) return;

      setSubmitting(true);
      setError(null);

      try {
        // Check if user is changing their previous decision
        const isChangingDecision = previousJobStatus !== null && previousJobStatus !== hasFoundJob;
        
        if (isChangingDecision) {
          // Reset all form data if user is changing their job status decision
          await cancellationService.resetToBasic(id);
          // Reset navigation stack to start fresh
          if (resetNavigation) {
            resetNavigation({ num: 0, option: "A" });
          }
        }

        // Update with new job status
        await cancellationService.update(id, {
          has_job: hasFoundJob,
        });

        // Update the previous job status tracker
        setPreviousJobStatus(hasFoundJob);

        setStep({
          num: step.num + 1,
          option: hasFoundJob ? "job-found" : "job-notfound",
        });
      } catch (err) {
        console.error("Failed to update cancellation:", err);
        setError("Failed to save your response. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [id, subscription?.id, submitting, setStep, step, previousJobStatus, resetNavigation]
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

  return (
    <CancellationCard
      totalSteps={totalSteps}
      onSetStep={setStep}
      onClose={onClose}
      step={step}
      canGoBack={canGoBack}
      onBack={onBack}
    >
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
        <p className="text-gray-warm-700 text-base tracking-tighter w-full md:w-[469px]">
          Whatever your answer, we just want to help you take the next step.
          With visa support, or by hearing how we can do better.
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
    </CancellationCard>
  );
};

export default CancelReasonStep;
