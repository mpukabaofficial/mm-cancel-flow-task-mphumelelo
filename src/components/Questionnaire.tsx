"use client";
import QuestionComponent from "./QuestionComponent";

interface Props {
  onSetAnswers: (answers: (string | null)[]) => void;
  answers: (string | null)[];
}

export default function Questionnaire({ onSetAnswers, answers }: Props) {
  const handleSelect = (qIndex: number, option: string) => {
    const next = [...answers]; // copy current answers
    next[qIndex] = option; // update index
    onSetAnswers(next); // send back to parent
  };

  // Show loading state

  return (
    <div className="space-y-9">
      <QuestionComponent
        question={<>Did you find this job with MigrateMate?*</>}
        options={["Yes", "No"]}
        selected={answers[0]}
        onSelect={(opt) => handleSelect(0, opt)}
      />

      <QuestionComponent
        question={
          <>
            How many roles did you{" "}
            <span className="underline underline-offset-2">apply</span> for
            through Migrate Mate?*
          </>
        }
        options={["0", "1–5", "6–20", "20+"]}
        selected={answers[1]}
        onSelect={(opt) => handleSelect(1, opt)}
      />

      <QuestionComponent
        question={
          <>
            How many companies did you{" "}
            <span className="underline underline-offset-2">email</span>{" "}
            directly?*
          </>
        }
        options={["0", "1–5", "6–20", "20+"]}
        selected={answers[2]}
        onSelect={(opt) => handleSelect(2, opt)}
      />

      <QuestionComponent
        question={
          <>
            How many different companies did you{" "}
            <span className="underline underline-offset-2">interview</span>{" "}
            with?*
          </>
        }
        options={["0", "1–2", "3–5", "5+"]}
        selected={answers[3]}
        onSelect={(opt) => handleSelect(3, opt)}
      />
    </div>
  );
}
