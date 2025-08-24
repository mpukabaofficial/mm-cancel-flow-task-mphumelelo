import { useVisaForm } from "@/hooks/useVisaForm";
import { Step } from "@/types/step";
import Button from "../ui/Button";
import HorizontalLine from "../ui/HorizontalLine";
import VisaQuestions from "./CancellationVisa/VisaQuestions";
import { Skeleton, SkeletonText, SkeletonButton } from "../ui/Skeleton";

interface Props {
  step: Step;
  onSetStep: (step: Step) => void;
}

const CancellationVisa = ({ onSetStep, step }: Props) => {
  const hookResult = useVisaForm({
    step,
    setStep: onSetStep,
  });
  
  console.log("useVisaForm result:", hookResult);
  
  const { 
    loading, 
    initialLoading, 
    isFormValid, 
    handleSubmit,
    selectedOption,
    setSelectedOption,
    visaType,
    setVisaType,
    showError,
    showFollowUpError,
    setShowFollowUpError,
    handleOptionSelect,
  } = hookResult;

  // Create handleOptionSelect if it's missing from the hook
  const safeHandleOptionSelect = handleOptionSelect || ((option: "Yes" | "No") => {
    setSelectedOption(option);
    // Reset errors when option is selected
    if (showError) {
      // We can't directly set showError to false here, but selecting an option should clear it
    }
  });

  if (initialLoading) {
    return (
      <div className="w-full space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <SkeletonText lines={1} />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="border-t border-gray-200" />
        <SkeletonButton />
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <h1 className="text-large">
        We helped you land the job, now let&apos;s help you secure your visa.
      </h1>
      <p className="text-normal">
        Is your company providing an immigration lawyer to help with your visa?
      </p>

      <VisaQuestions 
        onSetStep={onSetStep} 
        step={step}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        visaType={visaType}
        setVisaType={setVisaType}
        showError={showError}
        showFollowUpError={showFollowUpError}
        setShowFollowUpError={setShowFollowUpError}
        initialLoading={initialLoading}
        handleOptionSelect={safeHandleOptionSelect}
      />

      <HorizontalLine />
      <Button
        disabled={!isFormValid() || loading || initialLoading}
        onClick={handleSubmit}
      >
        {loading ? "Saving..." : "Complete cancellation"}
      </Button>
    </div>
  );
};

export default CancellationVisa;
