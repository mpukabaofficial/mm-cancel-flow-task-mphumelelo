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
import CancellationVisaNoJob from "./CancellationVisaNoJob";
import JobCancelComplete from "./JobCancelComplete";
import CancelCompleteHelp from "./CancelCompleteHelp";

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

  // Calculate total steps based on current flow state
  const getTotalSteps = () => {
    // Step 0 is always the initial reason step

    // For job-found path: 0 → 1 (questionnaire) → 2 (how) → 3 (visa) → 4 (complete) = 5 steps
    if (
      step.option === "job-found" ||
      (step.num >= 1 &&
        (step.option === "withMM" || step.option === "withoutMM"))
    ) {
      return 5;
    }

    // For variant B downsell flow: 0 → 1 (downsell) → 2 (accepted/declined) → 3 (complete) = 4 steps
    if (variant === "B" && step.option !== "job-found") {
      return 4;
    }

    // For variant A direct flow: 0 → 1 (questionnaire) → 2 (reasons) → 3 (complete) = 4 steps
    if (variant === "A" && step.option !== "job-found") {
      return 4;
    }

    // Default fallback
    return 4;
  };

  const totalSteps = getTotalSteps();

  console.log("[CancelModal.tsx] this is the step");
  console.log(step);

  // Common props for all components
  const commonProps = {
    step,
    setStep,
    onClose: handleClose,
    totalSteps,
  };

  const subscriptionProps = {
    subscription,
    subscriptionAmount: subscription?.monthly_price || 25,
  };

  // Step-specific rendering functions
  const renderInitialStep = () => (
    <CancelReasonStep {...commonProps} id={cancellationId} />
  );

  const renderStep1 = () => {
    if (step.option === "job-found") {
      return <FoundJobQuestionnaire {...commonProps} id={cancellationId} />;
    }

    // Variant B: Show downsell offer
    if (variant === "B") {
      return (
        <CancelOffer {...commonProps} id={cancellationId} variant={variant} />
      );
    }

    // Variant A: Direct to questionnaire
    return (
      <NoJobQuestionnaire
        {...commonProps}
        onSetStep={setStep}
        id={id}
        variant={variant}
        {...subscriptionProps}
      />
    );
  };

  const renderStep2 = () => {
    // Job flow: How did we help
    if (step.option === "withMM" || step.option === "withoutMM") {
      return <CancelHow {...commonProps} id={cancellationId} />;
    }

    // Downsell accepted
    if (step.option === "A") {
      return (
        <AcceptedDownsell
          {...commonProps}
          subscription={subscription}
          setNavigatingHome={(value: boolean) => {
            isNavigatingHome.current = value;
          }}
        />
      );
    }

    // Variant-based flow
    if (variant === "A") {
      return (
        <CancelReasons
          {...commonProps}
          variant={variant}
          id={cancellationId}
          {...subscriptionProps}
        />
      );
    }

    // Variant B fallback
    return (
      <NoJobQuestionnaire
        {...commonProps}
        onSetStep={setStep}
        id={id}
        variant={variant}
        {...subscriptionProps}
      />
    );
  };

  const renderStep3 = () => {
    if (step.option === "cancel-complete") {
      return (
        <CancelComplete
          {...commonProps}
          subscription={subscription}
          setNavigatingHome={(value: boolean) => {
            isNavigatingHome.current = value;
          }}
        />
      );
    }

    if (step.option === "withMM") {
      return (
        <CancellationVisa
          onClose={handleClose}
          onSetStep={setStep}
          step={step}
          totalSteps={totalSteps}
          id={cancellationId}
        />
      );
    }

    if (step.option === "withoutMM") {
      return (
        <CancellationVisaNoJob
          onClose={handleClose}
          onSetStep={setStep}
          step={step}
          totalSteps={totalSteps}
          id={cancellationId}
        />
      );
    }

    // Default: CancelReasons
    return (
      <CancelReasons
        {...commonProps}
        variant={variant}
        id={cancellationId}
        {...subscriptionProps}
      />
    );
  };

  const renderVisaHelpComplete = () => (
    <CancelCompleteHelp
      onClose={handleClose}
      setStep={setStep}
      step={step}
      totalSteps={totalSteps}
    />
  );

  const renderStep4 = () => {
    if (step.option === "job-cancel-complete") {
      return (
        <JobCancelComplete
          onClose={handleClose}
          setStep={setStep}
          step={step}
          totalSteps={totalSteps}
        />
      );
    }

    if (step.option === "get-visa-help") {
      return renderVisaHelpComplete();
    }

    // Default: CancelComplete
    return (
      <CancelComplete
        {...commonProps}
        subscription={subscription}
        setNavigatingHome={(value: boolean) => {
          isNavigatingHome.current = value;
        }}
      />
    );
  };

  // Main step routing
  const renderStep = () => {
    switch (step.num) {
      case 0:
        return renderInitialStep();
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return (
          <CancelComplete
            {...commonProps}
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
