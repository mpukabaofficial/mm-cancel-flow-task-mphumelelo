import { Step } from "@/types/step";
import CancellationCard from "./CancellationCard";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import Questionnaire from "./Questionnaire";
import useQuestionnaire from "@/hooks/useQuestionnaire";
import ErrorMessage from "./ErrorMessage";
import QuestionnaireSkeleton from "./QuestionnaireSkeleton";

interface Props {
  onClose: () => void;
  step: Step;
  onSetStep: (step: Step) => void;
  totalSteps: number;
  id: string;
}

const NoJobQuestionnaireA = ({
  onClose,
  onSetStep,
  step,
  totalSteps,
  id,
}: Props) => {
  const { allAnswered, answers, error, handleSubmit, loading, setAnswers } =
    useQuestionnaire(id);
  
  console.log("questions no job questionnaire a: ");
  console.log(step);

  if (loading) {
    return (
      <QuestionnaireSkeleton
        totalSteps={totalSteps}
        step={step}
        onSetStep={onSetStep}
        onClose={onClose}
      />
    );
  }

  return (
    <CancellationCard
      totalSteps={totalSteps}
      step={step}
      onSetStep={onSetStep}
      onClose={onClose}
    >
      <div className="w-full space-y-5">
        <h1 className="text-large">
          Help us understand how you were using Migrate Mate.
        </h1>
        <ErrorMessage error={error} />
        <Questionnaire answers={answers} onSetAnswers={setAnswers} />
        <HorizontalLine />
        <Button
          disabled={!allAnswered}
          variant="danger"
          onClick={() => {
            handleSubmit();
            onSetStep({
              num: step.num + 1,
              option: "reasons",
            });
          }}
        >
          Continue
        </Button>
      </div>
    </CancellationCard>
  );
};

export default NoJobQuestionnaireA;
