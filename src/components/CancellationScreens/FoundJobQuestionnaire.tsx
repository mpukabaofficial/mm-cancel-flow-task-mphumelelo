"use client";
import useQuestionnaire from "@/hooks/useQuestionnaire";
import { Step } from "@/types/step";
import ErrorMessage from "../ui/ErrorMessage";
import Questionnaire from "../Questionnaire";
import Button from "../ui/Button";
import HorizontalLine from "../ui/HorizontalLine";
import { Skeleton, SkeletonButton } from "../ui/Skeleton";
import { useUser } from "@/contexts/UserContext";

interface Props {
  step: Step;
  setStep: (step: Step) => void;
}
// TODO: Handle set step after submission.

const FoundJobQuestionnaire = ({ setStep, step }: Props) => {
  const { cancellationId } = useUser();
  const id = cancellationId || "";
  const { error, handleSubmit, loading, allAnswered, answers, setAnswers } =
    useQuestionnaire(id);

  if (loading) {
    return (
      <div className="w-full space-y-5">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-5/6" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200" />
        <SkeletonButton />
      </div>
    );
  }

  return (
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
  );
};

export default FoundJobQuestionnaire;
