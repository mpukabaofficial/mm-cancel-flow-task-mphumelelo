import { useVisaForm } from "@/hooks/useVisaForm";
import { Step } from "@/types/step";
import Button from "../ui/Button";
import HorizontalLine from "../ui/HorizontalLine";
import VisaQuestions from "./CancellationVisa/VisaQuestions";

interface Props {
  step: Step;
  onSetStep: (step: Step) => void;
}

const CancellationVisaNoJob = ({ onSetStep, step }: Props) => {
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
      <div className="space-y-3">
        <h1 className="text-large">
          You landed the job! <br />
          <span className="italic">That&apos;s what we live for.</span>
        </h1>
        <p className="tracking-[-1px] text-xl">
          Even if it wasn&apos;t through Migrate Mate, <br />
          let us help get your visa sorted.
        </p>
      </div>
      <p className="tracking-[-0.8px]">
        Is your company providing an immigration lawyer to help with your visa?
      </p>
      <VisaQuestions step={step} onSetStep={onSetStep} />
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

export default CancellationVisaNoJob;
