import { Step } from "@/types/step";
import CancellationCard from "./CancellationCard";
import OptionItem from "./OptionItem";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import ErrorMessage from "./ErrorMessage";
import FollowUp from "./FollowUp";
import { useVisaForm } from "@/hooks/useVisaForm";

interface Props {
  onClose: () => void;
  step: Step;
  onSetStep: (step: Step) => void;
  totalSteps: number;
  id: string;
  onBack?: () => void;
}

const CancellationVisa = ({
  onClose,
  onSetStep,
  totalSteps,
  step,
  id,
  onBack,
}: Props) => {
  const {
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
  } = useVisaForm({
    id,
    step,
    setStep: onSetStep,
  });

  if (initialLoading) {
    return (
      <CancellationCard
        step={step}
        onClose={onClose}
        totalSteps={totalSteps}
        onSetStep={onSetStep}
        onBack={onBack}
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
      onBack={onBack}
    >
      <div className="w-full space-y-5">
        <div>
          <h1 className="text-large">
            We helped you land the job, now let&apos;s help you secure your
            visa.
          </h1>
          <p className="text-normal">
            Is your company providing an immigration lawyer to help with your
            visa?
          </p>
        </div>

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