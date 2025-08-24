import { Step } from "@/types/step";

export type SkeletonVariant = 'loading' | 'questionnaire' | 'form' | 'completion';

export interface SkeletonConfig {
  variant: SkeletonVariant;
  showStepIndicator: boolean;
  showBackButton: boolean;
}

/**
 * Determines the appropriate skeleton variant based on current step and modal state
 */
export function getSkeletonConfig(
  currentStep: Step,
  canGoBack: boolean
): SkeletonConfig {
  let skeletonVariant: SkeletonVariant = 'loading';
  
  if (currentStep.num === 0) {
    skeletonVariant = 'form'; // Initial job decision step
  } else if (
    currentStep.option === 'job-found' || 
    currentStep.option === 'reasons' || 
    currentStep.num === 1
  ) {
    skeletonVariant = 'questionnaire';
  } else if (
    currentStep.option === 'cancel-complete' || 
    currentStep.option === 'job-cancel-complete' || 
    currentStep.option === 'get-visa-help'
  ) {
    skeletonVariant = 'completion';
  } else if (currentStep.num >= 2) {
    skeletonVariant = 'form';
  }

  return {
    variant: skeletonVariant,
    showStepIndicator: currentStep.num > 0,
    showBackButton: canGoBack && currentStep.num > 0,
  };
}