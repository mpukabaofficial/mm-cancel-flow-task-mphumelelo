// app/components/CancelModal.tsx
"use client";

import { useUser } from "@/contexts/UserContext";
import { useNavigationStack } from "@/hooks/useNavigationStack";
import useVariant from "@/hooks/useVariant";
import { cancellationService } from "@/lib/api";
import { Step } from "@/types/step";
import { getTotalSteps } from "@/utils/steps";
import { useCallback, useEffect, useRef } from "react";
import CancelModalSkeleton from "./CancelModalSkeleton";
import CancellationCard from "./CancellationCard";
import { StepRenderer } from "./CancelModal/steps/StepRenderer";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CancelModal({ isOpen, onClose }: CancelModalProps) {
  const isNavigatingHome = useRef(false);
  const { cancellationId } = useUser();

  const {
    currentStep,
    canGoBack,
    pushStep,
    goBack,
    resetNavigation,
    getNavigationPath,
  } = useNavigationStack({ num: 0, option: "A" });

  const {
    // cancellationId,
    setVariant,
    variant,
    loading,
    subscription,
  } = useVariant(isOpen);

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
    }
  }, [isOpen, resetNavigation, setVariant]);

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
    // Determine skeleton variant based on current step
    let skeletonVariant: "loading" | "questionnaire" | "form" | "completion" =
      "loading";

    if (currentStep.num === 0) {
      skeletonVariant = "form"; // Initial job decision step
    } else if (
      currentStep.option === "job-found" ||
      currentStep.option === "reasons" ||
      currentStep.num === 1
    ) {
      skeletonVariant = "questionnaire";
    } else if (
      currentStep.option === "cancel-complete" ||
      currentStep.option === "job-cancel-complete" ||
      currentStep.option === "get-visa-help"
    ) {
      skeletonVariant = "completion";
    } else if (currentStep.num >= 2) {
      skeletonVariant = "form";
    }

    return (
      <div className="bg-black/30 fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
        <CancelModalSkeleton
          variant={skeletonVariant}
          showStepIndicator={currentStep.num > 0}
          showBackButton={canGoBack && currentStep.num > 0}
        />
      </div>
    );
  }

  const totalSteps = getTotalSteps(currentStep, variant);

  // Check if we're on a completion step
  const isCompleted =
    currentStep.option === "cancel-complete" ||
    currentStep.option === "job-cancel-complete" ||
    currentStep.option === "get-visa-help" ||
    currentStep.num > totalSteps;

  console.log("[CancelModal.tsx] Navigation path:", getNavigationPath());
  console.log("[CancelModal.tsx] Current step:", currentStep);
  console.log("[CancelModal.tsx] Can go back:", canGoBack);
  console.log("[CancelModal.tsx] Is completed:", isCompleted);

  // Common props for all components
  const commonProps = {
    step: currentStep,
    setStep: navigateToStep,
    onClose: handleClose,
    totalSteps,
    canGoBack,
    onBack: navigateBack,
    resetNavigation,
    completed: isCompleted,
  };

  // Main step routing using StepRenderer
  const renderStep = () => {
    const stepRendererProps = {
      currentStep,
      variant,
      subscription,
      navigateToStep,
      navigateBack,
      resetNavigation,
      handleClose,
      isNavigatingHome,
    };

    return StepRenderer.renderStep(currentStep.num, stepRendererProps);
  };

  return (
    <div
      className="bg-black/30 fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      <CancellationCard {...commonProps}>{renderStep()}</CancellationCard>
    </div>
  );
}
