// app/components/CancelModal.tsx
"use client";

import { useCancellationFlow } from "@/hooks/useCancellationFlow";
import { cancellationService } from "@/lib/api";
import { DownsellVariant } from "@/lib/variant";
import { Step } from "@/types/step";
import { useCallback, useEffect, useRef, useState } from "react";
import AcceptedDownsell from "./AcceptedDownsell";
import CancelComplete from "./CancelComplete";
import CancelHow from "./CancelHow";
import CancelModalSkeleton from "./CancelModalSkeleton";
import CancelOffer from "./CancelOffer";
import CancelReasonStep from "./CancelReasonStep";
import CancelReasons from "./CancelReasons";
import CancellationVisa from "./CancellationVisa";
import FoundJobQuestionnaire from "./FoundJobQuestionnaire";
import NoJobQuestionnaire from "./NoJobQuestionnaire";
import CancellationCard from "./CancellationCard";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import Image from "next/image";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export default function CancelModal({ isOpen, onClose, id }: CancelModalProps) {
  const [step, setStep] = useState<Step>({
    num: 0,
    option: "A",
  });
  const [variant, setVariant] = useState<DownsellVariant | null>(null);
  const [cancellationId, setCancellationId] = useState<string | null>(null);
  const isNavigatingHome = useRef(false);

  const { getOrAssignVariant, loading, error, subscription } =
    useCancellationFlow();

  // Custom close handler that resets cancellation data
  const handleClose = useCallback(async () => {
    if (!isNavigatingHome.current && cancellationId) {
      try {
        await cancellationService.resetToBasic(cancellationId);
      } catch (error) {
        console.error("Error resetting cancellation:", error);
      }
    }

    // Reset local state
    isNavigatingHome.current = false;
    onClose();
  }, [cancellationId, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep({ num: 0, option: "A" });
      isNavigatingHome.current = false;
    } else {
      // Reset state when modal closes
      setVariant(null);
      setCancellationId(null);
    }
  }, [isOpen]);

  // Get or assign variant when modal opens
  useEffect(() => {
    if (isOpen && !variant) {
      getOrAssignVariant()
        .then((result) => {
          setVariant(result.variant);
          setCancellationId(result.id);
        })
        .catch((err) => {
          console.error("Failed to assign variant:", err);
          // Fallback to variant B if assignment fails
          setVariant("B");
          setCancellationId(id);
        });
    }
  }, [isOpen, variant, getOrAssignVariant, id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  // Show loading while variant is being assigned
  if (loading || !variant || !cancellationId) {
    return (
      <div className="bg-black/30 fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
        <CancelModalSkeleton />
      </div>
    );
  }

  // Calculate total steps based on variant
  const getTotalSteps = () => {
    if (variant === "A") {
      // Variant A: Step 0 (reason), skip downsell, Step 1 (final)
      return 2;
    } else {
      // Variant B: Step 0 (reason), Step 1 (downsell), Step 2 (final)
      return 3;
    }
  };

  const totalSteps = getTotalSteps();

  console.log("[CancelModal.tsx] this is the step");
  console.log(step);

  // Adjust step rendering based on variant
  const renderStep = () => {
    if (step.num === 0) {
      return (
        <CancelReasonStep
          step={step}
          setStep={setStep}
          onClose={handleClose}
          id={cancellationId}
          totalSteps={totalSteps}
        />
      );
    }
    // step 1 - has found job or not
    if (step.num === 1) {
      // has found job
      if (step.option === "job-found") {
        return (
          <FoundJobQuestionnaire
            step={step}
            setStep={setStep}
            onClose={handleClose}
            id={cancellationId}
            totalSteps={totalSteps}
          />
        );
      } else {
        // downsell
        if (variant === "B") {
          return (
            <CancelOffer
              step={step}
              setStep={setStep}
              onClose={handleClose}
              id={cancellationId}
              variant={variant}
              totalSteps={totalSteps}
            />
          );
        } else {
          // no downsell and questionnaire
          return (
            <NoJobQuestionnaire
              step={step}
              onSetStep={setStep}
              onClose={handleClose}
              totalSteps={totalSteps}
              id={id}
              variant={variant}
              subscriptionAmount={subscription?.monthly_price || 25}
            />
          );
        }
      }

      // downsell
    }
    // move to step 2,
    if (step.num === 2) {
      // how could we have
      if (step.option === "withMM") {
        return (
          <CancelHow
            step={step}
            setStep={setStep}
            onClose={handleClose}
            totalSteps={totalSteps}
            id={cancellationId}
          />
        );
      } else if (step.option === "withoutMM") {
        return (
          <CancelHow
            step={step}
            setStep={setStep}
            onClose={handleClose}
            totalSteps={totalSteps}
            id={cancellationId}
          />
        );
      }
      // has accepted downsell
      if (step.option === "A") {
        return (
          <AcceptedDownsell
            step={step}
            setStep={setStep}
            onClose={handleClose}
            totalSteps={totalSteps}
            subscription={subscription}
            setNavigatingHome={(value: boolean) => {
              isNavigatingHome.current = value;
            }}
          />
        );
      } else {
        if (variant === "A") {
          return (
            <CancelReasons
              step={step}
              setStep={setStep}
              onClose={handleClose}
              totalSteps={totalSteps}
              variant={variant}
              id={cancellationId}
              subscriptionAmount={subscription?.monthly_price || 25}
            />
          );
        } else {
          return (
            <NoJobQuestionnaire
              step={step}
              onSetStep={setStep}
              onClose={handleClose}
              totalSteps={totalSteps}
              id={id}
              variant={variant}
              subscriptionAmount={subscription?.monthly_price || 25}
            />
          );
        }
      }
    }
    if (step.num === 3) {
      if (step.option === "cancel-complete") {
        return (
          <CancelComplete
            step={step}
            onClose={handleClose}
            totalSteps={totalSteps}
            setStep={setStep}
            subscription={subscription}
            setNavigatingHome={(value: boolean) => {
              isNavigatingHome.current = value;
            }}
          />
        );
      } else if (step.option === "withMM") {
        return (
          <CancellationVisa
            onClose={handleClose}
            onSetStep={setStep}
            step={step}
            totalSteps={totalSteps}
            id={cancellationId}
          />
        );
      } else {
        return (
          <CancelReasons
            step={step}
            setStep={setStep}
            onClose={handleClose}
            totalSteps={totalSteps}
            variant={variant}
            id={cancellationId}
            subscriptionAmount={subscription?.monthly_price || 25}
          />
        );
      }
    }
    if (step.num === 4) {
      if (step.option === "job-cancel-complete") {
        return (
          <CancellationCard
            onClose={handleClose}
            onSetStep={setStep}
            step={step}
            totalSteps={totalSteps}
            completed
          >
            <div className="w-full space-y-5">
              <h1 className="text-large">
                All done, your cancellation’s been processed.
              </h1>
              <p className="tracking-[-1px] text-xl">
                We’re stoked to hear you’ve landed a job and sorted your visa.
                Big congrats from the team. 🙌
              </p>
              <HorizontalLine />
              <Button variant="primary">Finish</Button>
            </div>
          </CancellationCard>
        );
      } else if (step.option === "get-visa-help") {
        return (
          <CancellationCard
            onClose={handleClose}
            onSetStep={setStep}
            step={step}
            totalSteps={totalSteps}
            completed
          >
            <div className="w-full space-y-5">
              <h1 className="text-large">
                Your cancellation’s all sorted, mate, no more charges.
              </h1>
              <div className="p-4 space-y-2 bg-gray-warm-200 rounded-lg">
                <div className="flex gap-3">
                  <div className="size-12 relative rounded-full overflow-hidden">
                    <Image src="/mihailo-profile.jpeg" alt={""} fill />
                  </div>
                  <div>
                    <div className="space-y-1text-sm tracking-[-0.28px]">
                      <p>Mihailo Bozic</p>
                      <p className="font-normal">
                        &lt;mihailo@migratemate.co&gt;
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pl-15 space-y-5">
                  <p>
                    I’ll be reaching out soon to help with the visa side of
                    things.
                  </p>
                  <p className="font-normal">
                    We’ve got your back, whether it’s questions, paperwork, or
                    just figuring out your options.
                  </p>
                  <p className="font-medium">
                    Keep an eye on your inbox, I’ll be in touch shortly.
                  </p>
                </div>
              </div>
              <HorizontalLine />
              <Button variant="primary">Finish</Button>
            </div>
          </CancellationCard>
        );
      }
      return (
        <CancelComplete
          step={step}
          onClose={handleClose}
          totalSteps={totalSteps}
          setStep={setStep}
          subscription={subscription}
          setNavigatingHome={(value: boolean) => {
            isNavigatingHome.current = value;
          }}
        />
      );
    }
  };

  return (
    <div
      className="bg-black/30 fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {renderStep()}
    </div>
  );
}
