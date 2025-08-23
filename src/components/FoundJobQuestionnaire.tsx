"use client";
import useQuestionnaire from "@/hooks/useQuestionnaire";
import { Step } from "@/types/step";
import CancellationCard from "./CancellationCard";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import Questionnaire from "./Questionnaire";
import ErrorMessage from "./ErrorMessage";
import QuestionnaireSkeleton from "./QuestionnaireSkeleton";

interface Props {
  onClose: () => void;
  id: string;
  step: Step;
  setStep: (step: Step) => void;
  totalSteps: number;
}
// TODO: Handle set step after submission.

const FoundJobQuestionnaire = ({
  id,
  onClose,
  setStep,
  step,
  totalSteps,
}: Props) => {
  const { error, handleSubmit, loading, allAnswered, answers, setAnswers } =
    useQuestionnaire(id);

  if (loading) {
    return (
      <QuestionnaireSkeleton
        totalSteps={totalSteps}
        step={step}
        onSetStep={setStep}
        onClose={onClose}
      />
    );
  }

  return (
    <CancellationCard
      totalSteps={totalSteps}
      step={step}
      onSetStep={setStep}
      onClose={onClose}
    >
      <div className="w-full space-y-5">
        <h1 className="text-large">Congrats on the new role! 🎉</h1>
        <ErrorMessage error={error} />

        <Questionnaire answers={answers} onSetAnswers={setAnswers} />

        <HorizontalLine />

        <Button
          disabled={!allAnswered}
          onClick={() => {
            handleSubmit();
            setStep({
              num: step.num + 1,
              option:
                answers[0]?.toLowerCase() === "yes" ? "withMM" : "withoutMM",
            });
          }}
        >
          Continue
        </Button>
      </div>
    </CancellationCard>
  );
};

export default FoundJobQuestionnaire;
