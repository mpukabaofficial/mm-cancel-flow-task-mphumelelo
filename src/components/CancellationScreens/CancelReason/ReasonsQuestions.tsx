import FollowUp from "@/components/FollowUp";
import OptionItem from "@/components/OptionItem";
import ErrorMessage from "@/components/ui/ErrorMessage";
import useCancelReasons from "@/hooks/CancelReasons/useCancelReasons";

const ReasonsQuestions = () => {
  const {
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
    otherReason,
    setMoveFeedback,
    setOtherReason,
    handleReasonSelect,
    showError,
    selectedReason,
    setSelectedReason,
  } = useCancelReasons();

  return (
    <div className="space-y-4">
      {showError && (
        <ErrorMessage
          error="To help us understand your experience, please select a reason for
              cancelling*"
        />
      )}

      {!selectedReason ? (
        // Show all options when none selected
        <>
          <OptionItem
            checked={false}
            text="Too expensive"
            onClick={() => handleReasonSelect("Too expensive")}
          />
          <OptionItem
            checked={false}
            text="Platform not helpful"
            onClick={() => handleReasonSelect("Platform not helpful")}
          />
          <OptionItem
            checked={false}
            text="Not enough relevant jobs"
            onClick={() => handleReasonSelect("Not enough relevant jobs")}
          />
          <OptionItem
            checked={false}
            text="Decided not to move"
            onClick={() => handleReasonSelect("Decided not to move")}
          />
          <OptionItem
            checked={false}
            text="Other"
            onClick={() => handleReasonSelect("Other")}
          />
        </>
      ) : (
        // Show only selected option with follow-up
        <div className="space-y-2">
          <OptionItem
            checked={true}
            text={selectedReason}
            onClick={() => setSelectedReason(null)}
          />

          {selectedReason === "Too expensive" && (
            <FollowUp question="What would be the maximum you would be willing to pay?">
              {showPriceError && !isValidPrice(maxPrice) && (
                <ErrorMessage error="Please enter a valid number greater than 0." />
              )}
              <div className="rounded-lg w-full border p-3 flex items-center tracking-[-0.6px]">
                <span className="text-gray-warm-700 font-normal text-xs">
                  $
                </span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    if (isValidPrice(e.target.value)) {
                      setShowPriceError(false);
                    }
                  }}
                  className="w-full pl-3 flex-1 outline-none font-normal"
                  placeholder="0"
                />
              </div>
            </FollowUp>
          )}

          {selectedReason === "Platform not helpful" && (
            <FollowUp question="What can we change to make the platform more helpful?">
              {showFollowUpError && platformFeedback.length < 25 && (
                <ErrorMessage error="Please enter at least 25 characters so we can understand your feedback*" />
              )}

              <div className="relative w-full">
                <textarea
                  value={platformFeedback}
                  onChange={(e) => {
                    setPlatformFeedback(e.target.value);
                    if (e.target.value.length >= 25) {
                      setShowFollowUpError(false);
                    }
                  }}
                  className="rounded-lg w-full border p-3 outline-none font-normal tracking-[-0.6px] min-h-[150px] resize-none"
                />
                <span className="absolute bottom-2 right-3 text-xs font-normal text-gray-warm-700 tracking-[-0.6px]">
                  Min 25 characters ({platformFeedback.length}/25)
                </span>
              </div>
            </FollowUp>
          )}

          {selectedReason === "Not enough relevant jobs" && (
            <FollowUp question="In which way can we make the jobs more relevant?">
              {showFollowUpError && jobsFeedback.length < 25 && (
                <ErrorMessage error="Please provide at least 25 characters to help us understand your experience." />
              )}
              <div className="relative w-full">
                <textarea
                  value={jobsFeedback}
                  onChange={(e) => {
                    setJobsFeedback(e.target.value);
                    if (e.target.value.length >= 25) {
                      setShowFollowUpError(false);
                    }
                  }}
                  className="rounded-lg w-full border p-3 outline-none font-normal tracking-[-0.6px] min-h-[150px] resize-none"
                />
                <span className="absolute bottom-2 right-3 text-xs font-normal text-gray-warm-700 tracking-[-0.6px]">
                  Min 25 characters ({jobsFeedback.length}/25)
                </span>
              </div>
            </FollowUp>
          )}

          {selectedReason === "Decided not to move" && (
            <FollowUp question="What changed for you to decide to not move?">
              {showFollowUpError && moveFeedback.length < 25 && (
                <ErrorMessage error="Please provide at least 25 characters to help us understand your experience." />
              )}
              <div className="relative w-full">
                <textarea
                  value={moveFeedback}
                  onChange={(e) => {
                    setMoveFeedback(e.target.value);
                    if (e.target.value.length >= 25) {
                      setShowFollowUpError(false);
                    }
                  }}
                  className="rounded-lg w-full border p-3 outline-none font-normal tracking-[-0.6px] min-h-[150px] resize-none"
                />
                <span className="absolute bottom-2 right-3 text-xs font-normal text-gray-warm-700 tracking-[-0.6px]">
                  Min 25 characters ({moveFeedback.length}/25)
                </span>
              </div>
            </FollowUp>
          )}

          {selectedReason === "Other" && (
            <FollowUp question="What would have helped you the most?">
              {showFollowUpError && otherReason.length < 25 && (
                <ErrorMessage error="Please provide at least 25 characters to help us understand your experience." />
              )}
              <div className="relative w-full">
                <textarea
                  value={otherReason}
                  onChange={(e) => {
                    setOtherReason(e.target.value);
                    if (e.target.value.length >= 25) {
                      setShowFollowUpError(false);
                    }
                  }}
                  className="rounded-lg w-full border p-3 outline-none font-normal tracking-[-0.6px] min-h-[150px] resize-none"
                />
                <span className="absolute bottom-2 right-3 text-xs font-normal text-gray-warm-700 tracking-[-0.6px]">
                  Min 25 characters ({otherReason.length}/25)
                </span>
              </div>
            </FollowUp>
          )}
        </div>
      )}
    </div>
  );
};

export default ReasonsQuestions;
