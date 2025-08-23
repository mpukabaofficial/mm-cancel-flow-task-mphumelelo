import { Step } from "@/types/step";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import QuestionComponent from "./QuestionComponent";
import useNoJobQuestionnaire from "@/hooks/useNoJobQuestionnaire";
import ErrorMessage from "./ErrorMessage";
import QuestionnaireSkeleton from "./QuestionnaireSkeleton";
import { DownsellVariant } from "@/lib/variant";
import { cancellationService } from "@/lib/api";
import { useState } from "react";

interface Props {
  step: Step;
  onSetStep: (step: Step) => void;
  id: string;
  variant: DownsellVariant;
  subscriptionAmount: number;
}

const NoJobQuestionnaire = ({
  onSetStep,
  step,
  id,
  variant,
  subscriptionAmount,
}: Props) => {
  const { allAnswered, answers, error, handleSubmit, loading, setAnswers } =
    useNoJobQuestionnaire(id);
  const [downsellLoading, setDownsellLoading] = useState(false);

  const handleDownsellAccept = async () => {
    setDownsellLoading(true);

    try {
      // Accept the downsell offer
      const response = await cancellationService.update(id, {
        accepted_downsell: true,
      });

      console.log("Downsell accepted successfully:", response);

      // Navigate to downsell acceptance step
      onSetStep({
        num: 2,
        option: "A",
      });
    } catch (error) {
      console.error("Error accepting downsell:", error);
    } finally {
      setDownsellLoading(false);
    }
  };

  console.log("questions no job questionnaire a: ");
  console.log(step);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
                <span className="underline underline-offset-2">email</span>{" "}
                through MigrateMate?*
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
                <span className="underline underline-offset-2">
                  interviewed
                </span>{" "}
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
        <div className="space-y-4">
          {variant === "B" && (
            <Button 
              variant="green" 
              onClick={handleDownsellAccept}
              disabled={downsellLoading || loading}
            >
              Get $10 off | ${subscriptionAmount - 10}{" "}
              <span className="text-xs line-through">
                ${subscriptionAmount}
              </span>
            </Button>
          )}
          <Button
            disabled={!allAnswered || downsellLoading}
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
      </div>
  );
};

export default NoJobQuestionnaire;
