import { useState, useEffect } from "react";
import { cancellationService } from "@/lib/api";
import { UpdateCancellationRequest } from "@/lib/types";
import { Step } from "@/types/step";
import { useUser } from "@/contexts/UserContext";

type VisaChoice = "Yes" | "No";

interface UseVisaFormProps {
  
  step: Step;
  setStep: (step: Step) => void;
}

export const useVisaForm = ({ step, setStep }: UseVisaFormProps) => {
  const [selectedOption, setSelectedOption] = useState<VisaChoice | null>(null);
  const [visaType, setVisaType] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [showFollowUpError, setShowFollowUpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const {cancellationId} = useUser()
  const id = cancellationId || ""
  

  // Load existing visa data on mount
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        setInitialLoading(true);
        const cancellation = await cancellationService.getById(id);

        if (cancellation.has_immigration_lawyer !== null && cancellation.has_immigration_lawyer !== undefined) {
          setSelectedOption(cancellation.has_immigration_lawyer ? "Yes" : "No");
        }
        if (cancellation.visa_type) {
          setVisaType(cancellation.visa_type);
        }
      } catch (err) {
        console.error("Failed to load existing visa data:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadExistingData();
    } else {
      setInitialLoading(false);
    }
  }, [id]);

  const handleOptionSelect = (option: VisaChoice) => {
    setSelectedOption(option);
    setShowError(false);
    setShowFollowUpError(false);
  };

  const isFormValid = () => {
    if (!selectedOption || !visaType.trim()) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      setShowError(true);
      return;
    }

    // Validate visa type is provided
    if (!visaType.trim()) {
      setShowFollowUpError(true);
      return;
    }

    setLoading(true);

    try {
      // Save visa information to the database
      const updateData: UpdateCancellationRequest = {
        has_immigration_lawyer: selectedOption === "Yes",
        visa_type: visaType.trim(),
      };

      console.log("Saving visa information:", updateData);
      await cancellationService.update(id, updateData);

      // Move to next step after successful save
      setStep({ option: selectedOption === "Yes" ? "job-cancel-complete" : "get-visa-help", num: step.num + 1 });
    } catch (error) {
      console.error("Error saving visa information:", error);
      // Could add error handling here
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedOption,
    setSelectedOption,
    visaType,
    setVisaType,
    showError,
    showFollowUpError,
    setShowFollowUpError,
    loading,
    initialLoading,
    handleOptionSelect,
    isFormValid,
    handleSubmit,
  };
};