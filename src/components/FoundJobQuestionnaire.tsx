"use client";
import { ReactNode, useState, useEffect } from "react";
import CancellationCard from "./CancellationCard";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import { Step } from "@/types/step";

interface QuestionnaireProps {
  options: string[];
  question: ReactNode;
  selected: string | null;
  onSelect: (option: string) => void;
}

const Questionnaire = ({
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
  onClose: () => void;
  id: string;
  step: Step;
  setStep: (step: Step) => void;
  totalSteps: number;
}

const FoundJobQuestionnaire = ({
  id,
  onClose,
  setStep,
  step,
  totalSteps,
}: Props) => {
  // Track selected answers for each question
  const [answers, setAnswers] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing questionnaire data on component mount
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/cancellations/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        
        // Prepopulate answers if they exist
        if (data.found_job_with_migratemate || 
            data.roles_applied_count || 
            data.companies_emailed_count || 
            data.companies_interviewed_count) {
          
          setAnswers([
            data.found_job_with_migratemate || null,
            data.roles_applied_count || null,
            data.companies_emailed_count || null,
            data.companies_interviewed_count || null,
          ]);
        }
      } catch (err) {
        console.error("Error fetching questionnaire data:", err);
        setError("Failed to load existing data");
      } finally {
        setLoading(false);
      }
    };

    fetchExistingData();
  }, [id]);

  const handleSelect = (qIndex: number, option: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = option;
      return next;
    });
  };

  const allAnswered = answers.every((a) => a !== null);

  const handleSubmit = async () => {
    if (!allAnswered) return;

    try {
      console.log("Submitting questionnaire data:", {
        found_job_with_migratemate: answers[0],
        roles_applied_count: answers[1],
        companies_emailed_count: answers[2],
        companies_interviewed_count: answers[3],
      });

      const response = await fetch(`/api/cancellations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          found_job_with_migratemate: answers[0],
          roles_applied_count: answers[1],
          companies_emailed_count: answers[2],
          companies_interviewed_count: answers[3],
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Response error:", response.status, errorData);
        throw new Error(`Failed to submit questionnaire: ${response.status}`);
      }

      const result = await response.json();
      console.log("Questionnaire submitted successfully:", result);

      // Move to next step or close modal
      setStep({ num: step.num + 1, option: "A" });
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      // Handle error (could show toast notification)
    }
  };

  // Show loading state
  if (loading) {
    return (
      <CancellationCard
        totalSteps={totalSteps}
        step={step}
        onSetStep={setStep}
        onClose={onClose}
      >
        <div className="w-full flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading questionnaire...</span>
        </div>
      </CancellationCard>
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

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}

        {/* questionnaire */}
        <div className="space-y-9">
          <Questionnaire
            question={<>Did you find this job with MigrateMate?*</>}
            options={["Yes", "No"]}
            selected={answers[0]}
            onSelect={(opt) => handleSelect(0, opt)}
          />

          <Questionnaire
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

          <Questionnaire
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

          <Questionnaire
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

        <HorizontalLine />

        <Button disabled={!allAnswered} onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </CancellationCard>
  );
};

export default FoundJobQuestionnaire;
