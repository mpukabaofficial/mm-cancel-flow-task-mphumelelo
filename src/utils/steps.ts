import { NavigationStep } from "@/hooks/useNavigationStack";
import { DownsellVariant } from "@/lib/variant";

export const getTotalSteps = (currentStep: NavigationStep, variant: DownsellVariant) => {
    // Step 0 is not counted - only steps 1, 2, 3, 4... are shown in the indicator
    // Return the number of steps excluding the initial step 0

    // For job-found path: 1 (questionnaire) → 2 (how) → 3 (visa) → 4 (complete) = 4 steps
    if (
      currentStep.option === "job-found" ||
      (currentStep.num >= 1 &&
        (currentStep.option === "withMM" || currentStep.option === "withoutMM"))
    ) {
      return 4;
    }

    // For variant B downsell flow: 1 (downsell) → 2 (accepted/declined) → 3 (complete) = 3 steps
    if (variant === "B" && currentStep.option !== "job-found") {
      return 3;
    }

    // For variant A direct flow: 1 (questionnaire) → 2 (reasons) → 3 (complete) = 3 steps
    if (variant === "A" && currentStep.option !== "job-found") {
      return 3;
    }

    // Default fallback
    return 3;
  };