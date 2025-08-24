// app/components/CancelModal.tsx
"use client";

import { useUser } from "@/contexts/UserContext";
import { useNavigationStack } from "@/hooks/useNavigationStack";
import useVariant from "@/hooks/useVariant";
import { cancellationService } from "@/lib/cancellationService";
import { Step } from "@/types/step";
import { getTotalSteps } from "@/utils/steps";
import { useCallback, useEffect, useRef } from "react";
import CancellationCard from "./CancelModal/CancellationCard";
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
    loading: variantLoading,
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

  // Determine loading state and skeleton variant to pass to CancellationCard
  const isModalLoading = variantLoading || !variant || !cancellationId;

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

  const totalSteps = getTotalSteps(currentStep, variant || "B");

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

  // Determine which screens should show the image
  const shouldShowImage = (): boolean | "mobile-hidden" => {
    // Always show image on larger screens, conditional on smaller screens
    // The conditional logic will be handled in the component with responsive classes
    
    // Hide for completion screens on mobile only
    if (currentStep.option === "get-visa-help") return "mobile-hidden";
    
    // Hide image for CancelOffer screen (variant B, step 1, job-notfound) on mobile only
    if (currentStep.num === 1 && currentStep.option === "job-notfound" && variant === "B") return "mobile-hidden";
    
    // Hide image for questionnaire screens on mobile only
    if (currentStep.option === "job-found") return "mobile-hidden"; // FoundJobQuestionnaire
    if (currentStep.option === "job-notfound" && variant === "A") return "mobile-hidden"; // NoJobQuestionnaire variant A
    if (currentStep.num === 2 && (variant === "A" || variant === "B")) return "mobile-hidden"; // NoJobQuestionnaire step 2
    
    // Hide image for CancelReasons screen on mobile only
    if (currentStep.option === "reasons") return "mobile-hidden"; // CancelReasons
    if (currentStep.num === 3 && currentStep.option === "reasons") return "mobile-hidden"; // CancelReasons (step 3)
    
    // Show image by default
    return true;
  };

  console.log("[CancelModal.tsx] Should show image:", shouldShowImage());
  console.log("[CancelModal.tsx] Current step option:", currentStep.option);

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
    isLoading: isModalLoading,
    skeletonVariant,
    showImage: shouldShowImage(),
  };

  // Main step routing using StepRenderer
  const renderStep = () => {
    // Don't render steps if we're loading
    if (isModalLoading) {
      return null;
    }

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
      className="bg-black/30 fixed inset-0 z-50 sm:flex sm:items-center sm:justify-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <CancellationCard {...commonProps}>{renderStep()}</CancellationCard>
    </div>
  );
}
