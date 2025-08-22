"use client";

import Button from "@/components/ui/Button";
import HorizontalLine from "@/components/ui/HorizontalLine";
import { useUser } from "@/contexts/UserContext";
import { cancellationService } from "@/lib/api";
import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CancellationCard from "./CancellationCard";

interface Props {
  onClose: () => void;
  id: string;
  step: number;
  setStep: (step: number) => void;
}

const CancelReasonStep = ({ onClose, id, step, setStep }: Props) => {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
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
        await cancellationService.update(id, {
          has_job: hasFoundJob,
        });
        setSelected(hasFoundJob ? "yes" : "no");
        setStep(step + 1);
      } catch (err) {
        console.error("Failed to update cancellation:", err);
        setError("Failed to save your response. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [id, subscription?.id, submitting, setStep, step]
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
        } else if (cancellation?.has_job === false) {
          setSelected("no");
        } else {
          setSelected(null);
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
    <CancellationCard onSetStep={setStep} onClose={onClose} step={step}>
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
            isSelected={selected === "yes"}
            disabled={loading || submitting || userLoading}
          >
            {submitting && selected !== "no" && (
              <Loader2Icon className="animate-spin" />
            )}
            Yes, I&apos;ve found a job
          </Button>

          <Button
            onClick={() => handleHasFoundJob(false)}
            isSelected={selected === "no"}
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
