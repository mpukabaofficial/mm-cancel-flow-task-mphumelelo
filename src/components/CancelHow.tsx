import { Step } from "@/types/step";
import CancellationCard from "./CancellationCard";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import { useState } from "react";

interface Props {
  onClose: () => void;
  setStep: (step: Step) => void;
  step: Step;
  totalSteps: number;
}

const CancelHow = ({ onClose, setStep, step, totalSteps }: Props) => {
  const [text, setText] = useState("");

  function handleSubmit() {
    console.log("submitted");
  }

  return (
    <CancellationCard
      onClose={onClose}
      onSetStep={setStep}
      step={step}
      totalSteps={totalSteps}
    >
      <div className="w-full space-y-5">
        <h1 className="text-large">
          What’s one thing you wish we could’ve helped you with?
        </h1>
        <p className="max-w-[395px] text-normal">
          We’re always looking to improve, your thoughts can help us make
          Migrate Mate more useful for others.*{" "}
        </p>
        <div className="relative w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-lg w-full border p-3 outline-none font-normal tracking-[-0.6px] min-h-[150px] resize-none"
          />
          <span className="absolute bottom-2 right-3 text-xs font-normal text-gray-warm-700 tracking-[-0.6px]">
            Min 25 characters ({text.length}/25)
          </span>
        </div>
        <HorizontalLine />
        <Button disabled={text.length < 25} onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </CancellationCard>
  );
};

export default CancelHow;
