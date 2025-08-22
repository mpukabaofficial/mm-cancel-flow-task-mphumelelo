import { cancellationService } from "@/lib/api";
import { useEffect, useState } from "react";

const useQuestionnaire = (id: string) => {

    const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track selected answers for each question
  const [answers, setAnswers] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await cancellationService.getById(id);

        // Prepopulate answers if they exist
        if (
          data.found_job_with_migratemate ||
          data.roles_applied_count ||
          data.companies_emailed_count ||
          data.companies_interviewed_count
        ) {
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

  const allAnswered = answers.every((a) => a !== null);

  const handleSubmit = async () => {
    if (!allAnswered) return;

    try {
      const updateData = {
        found_job_with_migratemate: answers[0] as "Yes" | "No",
        roles_applied_count: answers[1] as "0" | "1–5" | "6–20" | "20+",
        companies_emailed_count: answers[2] as "0" | "1–5" | "6–20" | "20+",
        companies_interviewed_count: answers[3] as "0" | "1–2" | "3–5" | "5+",
      };

      console.log("Submitting questionnaire data:", updateData);

      const result = await cancellationService.update(id, updateData);
      console.log("Questionnaire submitted successfully:", result);

      // Move to next step or close modal
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      // Handle error (could show toast notification)
    }
  };

  // Hook logic here

  return {loading, error, handleSubmit, allAnswered, answers, setAnswers};
};

export default useQuestionnaire;