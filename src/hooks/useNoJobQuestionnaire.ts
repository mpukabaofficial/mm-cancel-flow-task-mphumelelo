import { useState, useEffect } from "react";
import { cancellationService } from "@/lib/api";

const useNoJobQuestionnaire = (id: string) => {
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null]); // 3 questions for no job
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if all required questions are answered
  const allAnswered = answers.every((answer) => answer !== null);

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await cancellationService.getById(id);
        
        // Set existing answers if they exist
        setAnswers([
          data.roles_applied_count || null,
          data.companies_emailed_count || null, 
          data.companies_interviewed_count || null,
        ]);
      } catch (err) {
        console.error("Error fetching questionnaire data:", err);
        setError("Failed to load questionnaire data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!allAnswered) {
      setError("Please answer all questions");
      return;
    }

    setError(null);

    try {
      const updateData = {
        roles_applied_count: answers[0] as "0" | "1–5" | "6–20" | "20+",
        companies_emailed_count: answers[1] as "0" | "1–5" | "6–20" | "20+",
        companies_interviewed_count: answers[2] as "0" | "1–2" | "3–5" | "5+",
        // Note: found_job_with_migratemate is NOT included since they don't have a job
      };

      console.log("Submitting no-job questionnaire data:", updateData);

      const result = await cancellationService.update(id, updateData);
      console.log("No-job questionnaire submitted successfully:", result);

      // Move to next step
      return result;
    } catch (err) {
      console.error("Error submitting questionnaire:", err);
      setError("Failed to submit questionnaire");
      throw err;
    }
  };

  return {
    answers,
    setAnswers,
    loading,
    error,
    allAnswered,
    handleSubmit,
  };
};

export default useNoJobQuestionnaire;