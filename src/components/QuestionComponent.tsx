"use client";
import { ReactNode } from "react";

interface QuestionComponentProps {
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
}: QuestionComponentProps) => (
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

export default QuestionComponent;