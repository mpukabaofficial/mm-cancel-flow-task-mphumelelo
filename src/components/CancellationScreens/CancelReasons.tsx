import useCancelReasons from "@/hooks/CancelReasons/useCancelReasons";
import { DownsellVariant } from "@/lib/variant";
import { Step } from "@/types/step";
import Button from "../ui/Button";
import HorizontalLine from "../ui/HorizontalLine";
import ReasonsQuestions from "./CancelReason/ReasonsQuestions";

interface Props {
  setStep: (step: Step) => void;
  variant: DownsellVariant;

  subscriptionAmount: number;
}

const CancelReasons = ({ setStep, variant, subscriptionAmount }: Props) => {
  const { 
    handleDownsellAccept, 
    loading, 
    handleSubmit, 
    isFormValid,
    setShowFollowUpError,
    setShowPriceError,
    showFollowUpError,
    showPriceError,
    isValidPrice,
    maxPrice,
    setMaxPrice,
    platformFeedback,
    setPlatformFeedback,
    jobsFeedback,
    setJobsFeedback,
    moveFeedback,
    setMoveFeedback,
    otherReason,
    setOtherReason,
    handleReasonSelect,
    showError,
    selectedReason,
    setSelectedReason,
  } = useCancelReasons();

  return (
    <div className="w-full space-y-5">
      <div>
        <h1 className="text-large">
          What’s the main <br />
          reason for cancelling?
        </h1>
        <p className="tracking-[-0.8px]">
          Please take a minute to let us know why:
        </p>
      </div>
      <ReasonsQuestions 
        setShowFollowUpError={setShowFollowUpError}
        setShowPriceError={setShowPriceError}
        showFollowUpError={showFollowUpError}
        showPriceError={showPriceError}
        isValidPrice={isValidPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        platformFeedback={platformFeedback}
        setPlatformFeedback={setPlatformFeedback}
        jobsFeedback={jobsFeedback}
        setJobsFeedback={setJobsFeedback}
        moveFeedback={moveFeedback}
        setMoveFeedback={setMoveFeedback}
        otherReason={otherReason}
        setOtherReason={setOtherReason}
        handleReasonSelect={handleReasonSelect}
        showError={showError}
        selectedReason={selectedReason}
        setSelectedReason={setSelectedReason}
      />
      <HorizontalLine />
      <div className="space-y-4">
        {variant === "B" && (
          <Button
            variant="green"
            onClick={() => {
              handleDownsellAccept();
              setStep({
                num: 2,
                option: "A",
              });
            }}
            disabled={loading}
          >
            Get $10 off | ${subscriptionAmount - 10}{" "}
            <span className="text-xs line-through">${subscriptionAmount}</span>
          </Button>
        )}
        <Button
          disabled={!isFormValid() || loading}
          variant="danger"
          onClick={() => {
            handleSubmit();
            setStep({
              num: 3,
              option: "cancel-complete",
            });
          }}
        >
          {loading ? "Saving..." : "Complete Cancellation"}
        </Button>
      </div>
    </div>
  );
};

export default CancelReasons;
