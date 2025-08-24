import { useVisaForm } from "@/hooks/useVisaForm";
import { Step } from "@/types/step";
import Button from "../ui/Button";
import HorizontalLine from "../ui/HorizontalLine";
import VisaQuestions from "./CancellationVisa/VisaQuestions";

interface Props {
  step: Step;
  onSetStep: (step: Step) => void;
}

const CancellationVisa = ({ onSetStep, step }: Props) => {
  const { loading, initialLoading, isFormValid, handleSubmit } = useVisaForm({
    step,
    setStep: onSetStep,
  });

  if (initialLoading) {
    return (
      <div className="w-full flex justify-center items-center h-80">
        <div className="text-normal">Loading...</div>
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

      <VisaQuestions onSetStep={onSetStep} step={step} />

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
