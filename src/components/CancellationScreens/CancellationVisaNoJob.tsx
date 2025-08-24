import { Step } from "@/types/step";
import OptionItem from "../OptionItem";
import Button from "../ui/Button";
import HorizontalLine from "../ui/HorizontalLine";
import ErrorMessage from "../ErrorMessage";
import FollowUp from "../FollowUp";
import { useVisaForm } from "@/hooks/useVisaForm";

interface Props {
  step: Step;
  onSetStep: (step: Step) => void;
}

const CancellationVisaNoJob = ({ onSetStep, step }: Props) => {
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
    step,
    setStep: onSetStep,
  });

  if (initialLoading) {
    return (
      <div className="w-full flex justify-center items-center h-80">
        <div className="text-normal">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <div className="space-y-3">
        <h1 className="text-large">
          You landed the job! <br />
          <span className="italic">That&apos;s what we live for.</span>
        </h1>
        <p className="tracking-[-1px] text-xl">
          Even if it wasn&apos;t through Migrate Mate, <br />
          let us help get your visa sorted.
        </p>
      </div>
      <p className="tracking-[-0.8px]">
        Is your company providing an immigration lawyer to help with your visa?
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
  );
};

export default CancellationVisaNoJob;
