import { DownsellVariant } from "@/lib/variant";
import { Step } from "@/types/step";
import CancellationCard from "./CancellationCard";
import ErrorMessage from "./ErrorMessage";
import Button from "./ui/Button";
import CheckedIcon from "./ui/CheckedIcon";
import HorizontalLine from "./ui/HorizontalLine";
import { useState } from "react";
import FollowUp from "./FollowUp";
import { cancellationService } from "@/lib/api";

type ReasonChoices =
  | "Too expensive"
  | "Platform not helpful"
  | "Not enough relevant jobs"
  | "Decided not to move"
  | "Other";

const OptionItem = ({
  checked,
  text,
  onClick,
}: {
  checked: boolean;
  text: string;
  onClick?: () => void;
}) => (
  <div
    className={`flex gap-3 items-center ${onClick ? "cursor-pointer" : ""}`}
    onClick={onClick}
  >
    <CheckedIcon checked={checked} />
    <span className="text-normal">{text}</span>
  </div>
);

interface Props {
  totalSteps: number;
  step: Step;
  setStep: (step: Step) => void;
  onClose: () => void;
  variant: DownsellVariant;
  id: string;
}

const CancelReasons = ({
  totalSteps,
  step,
  onClose,
  setStep,
  variant,
  id,
}: Props) => {
  const [selectedReason, setSelectedReason] = useState<ReasonChoices | null>(
    null
  );
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [platformFeedback, setPlatformFeedback] = useState<string>("");
  const [jobsFeedback, setJobsFeedback] = useState<string>("");
  const [moveFeedback, setMoveFeedback] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [showFollowUpError, setShowFollowUpError] = useState(false);
  const [showPriceError, setShowPriceError] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleReasonSelect = (reason: ReasonChoices) => {
    setSelectedReason(reason);
    setShowError(false);
    setShowFollowUpError(false);
    setShowPriceError(false);
  };

  const getCurrentExplanation = () => {
    switch (selectedReason) {
      case "Platform not helpful":
        return platformFeedback;
      case "Not enough relevant jobs":
        return jobsFeedback;
      case "Decided not to move":
        return moveFeedback;
      case "Other":
        return otherReason;
      default:
        return "";
    }
  };

  const isValidPrice = (price: string) => {
    if (price.trim() === "") return false;
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
  };

  const isFormValid = () => {
    if (!selectedReason) return false;

    // For "Too expensive", check if price is valid
    if (selectedReason === "Too expensive") {
      return isValidPrice(maxPrice);
    }

    // For all other reasons, require minimum 25 characters
    const explanation = getCurrentExplanation();
    return explanation.length >= 25;
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      setShowError(true);
      return;
    }

    // Check if "Too expensive" price is valid
    if (selectedReason === "Too expensive" && !isValidPrice(maxPrice)) {
      setShowPriceError(true);
      return;
    }

    // Check if follow-up is required and valid
    if (
      selectedReason !== "Too expensive" &&
      getCurrentExplanation().length < 25
    ) {
      setShowFollowUpError(true);
      return;
    }

    setLoading(true);

    try {
      // Prepare update data with simplified structure
      const updateData: { reason: ReasonChoices; explanation?: string } = {
        reason: selectedReason,
      };

      // For "Too expensive", store the price as explanation
      if (selectedReason === "Too expensive" && maxPrice) {
        updateData.explanation = `$${maxPrice}`;
      }
      // For all other reasons, store the text explanation
      else if (selectedReason !== "Too expensive") {
        updateData.explanation = getCurrentExplanation();
      }

      console.log("Submitting cancel reasons data:", updateData);
      console.log("Cancellation ID:", id);

      // Update cancellation with simplified cancel reasons data
      const response = await cancellationService.update(id, updateData);

      console.log("Cancel reasons saved successfully:", response);

      // Close modal or proceed to next step
      setStep({
        num: 3,
        option: "cancel-complete",
      });
    } catch (error) {
      console.error("Error saving cancel reasons:", error);
      // Could add error toast notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <CancellationCard
      totalSteps={totalSteps}
      step={step}
      onSetStep={setStep}
      onClose={onClose}
    >
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
        <HorizontalLine />
        <div className="space-y-4">
          {variant === "B" && (
            <Button variant="green">
              Get $10 off | ${25 - 10}{" "}
              <span className="text-xs line-through">$25</span>
            </Button>
          )}
          <Button
            disabled={!isFormValid() || loading}
            variant="danger"
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : "Complete Cancellation"}
          </Button>
        </div>
      </div>
    </CancellationCard>
  );
};

export default CancelReasons;
