import ErrorMessage from "@/components/ui/ErrorMessage";
import FollowUp from "@/components/FollowUp";
import OptionItem from "@/components/OptionItem";
import { useVisaForm } from "@/hooks/useVisaForm";
import { Step } from "@/types/step";

interface Props {
  step: Step;
  onSetStep: (step: Step) => void;
}

const VisaQuestions = ({ onSetStep, step }: Props) => {
  const {
    selectedOption,
    setSelectedOption,
    visaType,
    setVisaType,
    showError,
    showFollowUpError,
    setShowFollowUpError,
    initialLoading,
    handleOptionSelect,
  } = useVisaForm({
    step,
    setStep: onSetStep,
  });
  return (
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
  );
};

export default VisaQuestions;
