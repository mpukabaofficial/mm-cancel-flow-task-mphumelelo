"use client";
import { ReactNode } from "react";

interface QuestionnaireProps {
  options: string[];
  question: ReactNode;
  selected: string | null;
  onSelect: (option: string) => void;
}

const QuestionComponent = ({
  options,
  question,
  selected,
  onSelect,
}: QuestionnaireProps) => (
  <div className="space-y-4">
    <div className="text-gray-warm-700 font-medium">{question}</div>
    <div className="flex gap-2 mb-4">
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`flex-1 px-6 py-3 rounded leading-0 text-sm font-medium tracking-[-0.28px] transition-colors
              ${
                isActive
                  ? "bg-Brand-Migrate-Mate text-white border border-Brand-Migrate-Mate"
                  : "bg-gray-warm-200 text-gray-warm-700 border border-gray-warm-300 hover:border-gray-warm-400"
              }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  </div>
);

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
