/**
 * Custom hook managing all cancel modal state and behavior
 * Consolidates navigation, variant assignment, and lifecycle management
 */
import { useCallback, useEffect, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigationStack } from "@/hooks/useNavigationStack";
import useVariant from "@/hooks/useVariant";
import { cancellationService } from "@/lib/api";
import { Step } from "@/types/step";
import { getTotalSteps } from "@/utils/steps";

export function useCancelModal(isOpen: boolean, onClose: () => void) {
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

  const { setVariant, variant, loading, subscription } = useVariant(isOpen);

  // Wrap navigation functions for easier usage
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

  // Close modal and reset cancellation data if needed
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

  // Handle modal lifecycle - reset navigation and variant state
  useEffect(() => {
    if (isOpen) {
      resetNavigation({ num: 0, option: "A" });
      isNavigatingHome.current = false;
    } else {
      // Reset state when modal closes
      setVariant(null);
    }
  }, [isOpen, resetNavigation, setVariant]);

  // Handle escape key and body scroll lock
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

  const totalSteps = getTotalSteps(currentStep, variant || "A");

  // Determine if current step is a completion step
  const isCompleted =
    currentStep.option === "cancel-complete" ||
    currentStep.option === "job-cancel-complete" ||
    currentStep.option === "get-visa-help" ||
    currentStep.num > totalSteps;

  // Debug logging for development
  console.log("[useCancelModal] Navigation path:", getNavigationPath());
  console.log("[useCancelModal] Current step:", currentStep);
  console.log("[useCancelModal] Can go back:", canGoBack);
  console.log("[useCancelModal] Is completed:", isCompleted);

  return {
    // State
    currentStep,
    variant,
    loading,
    subscription,
    cancellationId,
    canGoBack,
    totalSteps,
    isCompleted,
    isNavigatingHome,
    
    // Actions
    navigateToStep,
    navigateBack,
    handleClose,
    resetNavigation,
    
    // Utilities
    getNavigationPath,
  };
}