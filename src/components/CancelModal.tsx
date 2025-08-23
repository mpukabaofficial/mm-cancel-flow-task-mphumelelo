// app/components/CancelModal.tsx
"use client";

import { useNavigationStack } from "@/hooks/useNavigationStack";
import useVariant from "@/hooks/useVariant";
import { cancellationService } from "@/lib/api";
import { Step } from "@/types/step";
import { getTotalSteps } from "@/utils/steps";
import { useCallback, useEffect, useRef } from "react";
import AcceptedDownsell from "./AcceptedDownsell";
import CancelComplete from "./CancelComplete";
import CancelCompleteHelp from "./CancelCompleteHelp";
import CancelHow from "./CancelHow";
import CancelModalSkeleton from "./CancelModalSkeleton";
import CancelOffer from "./CancelOffer";
import CancelReasonStep from "./CancelReasonStep";
import CancelReasons from "./CancelReasons";
import CancellationVisa from "./CancellationVisa";
import CancellationVisaNoJob from "./CancellationVisaNoJob";
import FoundJobQuestionnaire from "./FoundJobQuestionnaire";
import JobCancelComplete from "./JobCancelComplete";
import NoJobQuestionnaire from "./NoJobQuestionnaire";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export default function CancelModal({ isOpen, onClose, id }: CancelModalProps) {
  const isNavigatingHome = useRef(false);

  const {
    currentStep,
    canGoBack,
    pushStep,
    goBack,
    resetNavigation,
    getNavigationPath,
  } = useNavigationStack({ num: 0, option: "A" });

  const {
    cancellationId,
    setVariant,
    variant,
    error,
    loading,
    subscription,
    setCancellationId,
  } = useVariant(isOpen, id);

  // Navigation wrapper function
  const navigateToStep = useCallback(
    (newStep: Step) => {
      pushStep(newStep);
    },
    [pushStep]
  );

  const navigateBack = useCallback(() => {
    const previousStep = goBack();
    return previousStep;
  }, [goBack]);

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
      resetNavigation({ num: 0, option: "A" });
      isNavigatingHome.current = false;
    } else {
      // Reset state when modal closes
      setVariant(null);
      setCancellationId(null);
    }
  }, [isOpen, resetNavigation]);

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

  const totalSteps = getTotalSteps(currentStep, variant);

  console.log("[CancelModal.tsx] Navigation path:", getNavigationPath());
  console.log("[CancelModal.tsx] Current step:", currentStep);
  console.log("[CancelModal.tsx] Can go back:", canGoBack);

  // Common props for all components
  const commonProps = {
    step: currentStep,
    setStep: navigateToStep,
    onClose: handleClose,
    totalSteps,
    canGoBack,
    onBack: navigateBack,
    resetNavigation,
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
    if (currentStep.option === "job-found") {
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
        onSetStep={navigateToStep}
        id={id}
        variant={variant}
        {...subscriptionProps}
      />
    );
  };

  const renderStep2 = () => {
    // Job flow: How did we help
    if (currentStep.option === "withMM" || currentStep.option === "withoutMM") {
      return <CancelHow {...commonProps} id={cancellationId} />;
    }

    // Downsell accepted
    if (currentStep.option === "A") {
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
        onSetStep={navigateToStep}
        id={id}
        variant={variant}
        {...subscriptionProps}
      />
    );
  };

  const renderStep3 = () => {
    if (currentStep.option === "cancel-complete") {
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

    if (currentStep.option === "withMM") {
      return (
        <CancellationVisa
          onClose={handleClose}
          onSetStep={navigateToStep}
          step={currentStep}
          totalSteps={totalSteps}
          id={cancellationId}
        />
      );
    }

    if (currentStep.option === "withoutMM") {
      return (
        <CancellationVisaNoJob
          onClose={handleClose}
          onSetStep={navigateToStep}
          step={currentStep}
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
      setStep={navigateToStep}
      step={currentStep}
      totalSteps={totalSteps}
    />
  );

  const renderStep4 = () => {
    if (currentStep.option === "job-cancel-complete") {
      return (
        <JobCancelComplete
          onClose={handleClose}
          setStep={navigateToStep}
          step={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (currentStep.option === "get-visa-help") {
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
    switch (currentStep.num) {
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
