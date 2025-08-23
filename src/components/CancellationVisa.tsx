import { Step } from "@/types/step";
import CancellationCard from "./CancellationCard";
import OptionItem from "./OptionItem";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import ErrorMessage from "./ErrorMessage";
import FollowUp from "./FollowUp";
import { useState, useEffect } from "react";
import { cancellationService } from "@/lib/api";
import { UpdateCancellationRequest } from "@/lib/types";

type VisaChoice = "Yes" | "No";

interface Props {
  onClose: () => void;
  step: Step;
  onSetStep: (step: Step) => void;
  totalSteps: number;
  id: string;
}

const CancellationVisa = ({
  onClose,
  onSetStep,
  totalSteps,
  step,
  id,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<VisaChoice | null>(null);
  const [visaType, setVisaType] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [showFollowUpError, setShowFollowUpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load existing visa data on mount
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        setInitialLoading(true);
        const cancellation = await cancellationService.getById(id);

        if (cancellation.has_immigration_lawyer !== undefined) {
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

      // Move to next step or complete cancellation
      onSetStep({
        num: step.num + 1,
        option:
          selectedOption === "Yes" ? "job-cancel-complete" : "get-visa-help",
      });
    } catch (error) {
      console.error("Error saving visa information:", error);
      // Could add error handling here
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <CancellationCard
        step={step}
        onClose={onClose}
        totalSteps={totalSteps}
        onSetStep={onSetStep}
      >
        <div className="w-full flex justify-center items-center h-80">
          <div className="text-normal">Loading...</div>
        </div>
      </CancellationCard>
    );
  }

  return (
    <CancellationCard
      step={step}
      onClose={onClose}
      totalSteps={totalSteps}
      onSetStep={onSetStep}
    >
      <div className="w-full space-y-5">
        <h1 className="text-large">
          We helped you land the job, now let&apos;s help you secure your visa.
        </h1>
        <p className="text-normal">
          Is your company providing an immigration lawyer to help with your
          visa?
        </p>

        <div className="space-y-4">
          {showError && (
            <ErrorMessage error="Please select an option to continue*" />
          )}

          {!selectedOption ? (
            // Show all options when none selected
            <>
              <OptionItem
                checked={false}
                text="Yes"
                onClick={() => handleOptionSelect("Yes")}
              />
              <OptionItem
                checked={false}
                text="No"
                onClick={() => handleOptionSelect("No")}
              />
            </>
          ) : (
            // Show only selected option with follow-up
            <div className="space-y-2">
              <OptionItem
                checked={true}
                text={selectedOption}
                onClick={() => setSelectedOption(null)}
              />

              {selectedOption === "Yes" && (
                <FollowUp question="What visa will you be applying for?">
                  {showFollowUpError && !visaType.trim() && (
                    <ErrorMessage error="Please specify the visa type." />
                  )}
                  <div className="w-full">
                    <input
                      type="text"
                      value={visaType}
                      onChange={(e) => {
                        setVisaType(e.target.value);
                        if (e.target.value.trim()) {
                          setShowFollowUpError(false);
                        }
                      }}
                      disabled={initialLoading}
                      className="rounded-lg w-full border p-3 outline-none font-normal tracking-[-0.6px] disabled:opacity-50"
                    />
                  </div>
                </FollowUp>
              )}

              {selectedOption === "No" && (
                <FollowUp question="We can connect you with one of our trusted partners. Which visa would you like to apply for?">
                  {showFollowUpError && !visaType.trim() && (
                    <ErrorMessage error="Please specify the visa type." />
                  )}
                  <div className="w-full">
                    <input
                      type="text"
                      value={visaType}
                      onChange={(e) => {
                        setVisaType(e.target.value);
                        if (e.target.value.trim()) {
                          setShowFollowUpError(false);
                        }
                      }}
                      disabled={initialLoading}
                      className="rounded-lg w-full border p-3 outline-none font-normal tracking-[-0.6px] disabled:opacity-50"
                    />
                  </div>
                </FollowUp>
              )}
            </div>
          )}
        </div>

        <HorizontalLine />
        <Button
          disabled={!isFormValid() || loading || initialLoading}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Complete cancellation"}
        </Button>
      </div>
    </CancellationCard>
  );
};

export default CancellationVisa;
