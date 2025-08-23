import { Step } from "@/types/step";
import CancellationCard from "./CancellationCard";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import QuestionComponent from "./QuestionComponent";
import useNoJobQuestionnaire from "@/hooks/useNoJobQuestionnaire";
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
    useNoJobQuestionnaire(id);
  
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
        <div className="space-y-9">
          <QuestionComponent
            question={
              <>
                How many roles did you{" "}
                <span className="underline underline-offset-2">apply</span> for
                through MigrateMate?*
              </>
            }
            options={["0", "1–5", "6–20", "20+"]}
            selected={answers[0]}
            onSelect={(opt: string) => {
              const next = [...answers];
              next[0] = opt;
              setAnswers(next);
            }}
          />

          <QuestionComponent
            question={
              <>
                How many companies did you{" "}
                <span className="underline underline-offset-2">email</span> through
                MigrateMate?*
              </>
            }
            options={["0", "1–5", "6–20", "20+"]}
            selected={answers[1]}
            onSelect={(opt: string) => {
              const next = [...answers];
              next[1] = opt;
              setAnswers(next);
            }}
          />

          <QuestionComponent
            question={
              <>
                How many companies{" "}
                <span className="underline underline-offset-2">interviewed</span>{" "}
                you through MigrateMate leads?*
              </>
            }
            options={["0", "1–2", "3–5", "5+"]}
            selected={answers[2]}
            onSelect={(opt: string) => {
              const next = [...answers];
              next[2] = opt;
              setAnswers(next);
            }}
          />
        </div>
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
