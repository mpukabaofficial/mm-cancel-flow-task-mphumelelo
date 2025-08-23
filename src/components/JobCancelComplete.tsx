import React from "react";
import CancellationCard from "./CancellationCard";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import { Step } from "@/types/step";

interface Props {
  onClose: () => void;
  step: Step;
  setStep: (step: Step) => void;
  totalSteps: number;
}

const JobCancelComplete = ({ onClose, setStep, step, totalSteps }: Props) => {
  return (
    <CancellationCard
      onClose={onClose}
      onSetStep={setStep}
      step={step}
      totalSteps={totalSteps}
      completed
    >
      <div className="w-full space-y-5">
        <h1 className="text-large">
          All done, your cancellation’s been processed.
        </h1>
        <p className="tracking-[-1px] text-xl">
          We’re stoked to hear you’ve landed a job and sorted your visa. Big
          congrats from the team. 🙌
        </p>
        <HorizontalLine />
        <Button variant="primary">Finish</Button>
      </div>
    </CancellationCard>
  );
};

export default JobCancelComplete;
