// app/components/CancelModal.tsx
"use client";

import { useCancellationFlow } from "@/hooks/useCancellationFlow";
import { DownsellVariant } from "@/lib/variant";
import { Step } from "@/types/step";
import { useEffect, useState } from "react";
import AcceptedDownsell from "./AcceptedDownsell";
import CancelOffer from "./CancelOffer";
import CancelReasonStep from "./CancelReasonStep";
import CancelReasons from "./CancelReasons";
import FoundJobQuestionnaire from "./FoundJobQuestionnaire";
import NoJobQuestionnaireA from "./NoJobQuestionnaireA";
import CancellationCard from "./CancellationCard";
import HorizontalLine from "./ui/HorizontalLine";
import Button from "./ui/Button";

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

  const { getOrAssignVariant, loading, error, subscription } =
    useCancellationFlow();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep({ num: 0, option: "A" });
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
        onClose();
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
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Show loading while variant is being assigned
  if (loading || !variant || !cancellationId) {
    return (
      <div className="bg-black/30 fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
        <div className="bg-white rounded-lg p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
          <span className="ml-3">Loading...</span>
        </div>
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
          onClose={onClose}
          id={cancellationId}
          totalSteps={totalSteps}
        />
      );
    }
    // step 1 - has found job or not
    if (step.num === 1) {
      // has found job
      if (step.option === "A") {
        return (
          <FoundJobQuestionnaire
            step={step}
            setStep={setStep}
            onClose={onClose}
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
              onClose={onClose}
              id={cancellationId}
              variant={variant}
              totalSteps={totalSteps}
            />
          );
        } else {
          // no downsell and questionnaire
          return (
            <NoJobQuestionnaireA
              step={step}
              onSetStep={setStep}
              onClose={onClose}
              totalSteps={totalSteps}
              id={id}
            />
          );
        }
      }

      // downsell
    }
    // move to step 2,
    if (step.num === 2) {
      // has accepted downsell
      if (step.option === "A") {
        return (
          <AcceptedDownsell
            step={step}
            setStep={setStep}
            onClose={onClose}
            totalSteps={totalSteps}
            subscription={subscription}
          />
        );
      } else {
        return (
          <CancelReasons
            step={step}
            setStep={setStep}
            onClose={onClose}
            totalSteps={totalSteps}
            variant={variant}
            id={cancellationId}
          />
        );
      }
    }
    if (step.num === 3) {
      if (step.option === "cancel-complete") {
        return (
          <CancellationCard
            step={step}
            onClose={onClose}
            totalSteps={totalSteps}
            onSetStep={setStep}
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
                    Your subscription is set to end on XX date. <br />
                    You’ll still have full access until then. No further charges
                    after that.
                  </p>
                  <p className="text-normal tracking-[-0.8px]">
                    Changed your mind? You can reactivate anytime before your
                    end date.
                  </p>
                </div>
              </div>
              <HorizontalLine />
              <Button variant="primary">Back to Jobs</Button>{" "}
            </div>
          </CancellationCard>
        );
      }
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
