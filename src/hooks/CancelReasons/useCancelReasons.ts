import { useUser } from "@/contexts/UserContext";
import { cancellationService } from "@/lib/cancellationService";
import { ReasonChoices } from "@/types/reasons";
import { useEffect, useState } from "react";

const useCancelReasons = () => {
  const { cancellationId } = useUser();
  const id = cancellationId || "";

  const [showFollowUpError, setShowFollowUpError] = useState(false);
  const [showPriceError, setShowPriceError] = useState(false);
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [platformFeedback, setPlatformFeedback] = useState<string>("");
  const [jobsFeedback, setJobsFeedback] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<ReasonChoices | null>(
    null
  );
  const [moveFeedback, setMoveFeedback] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch existing cancellation data on component mount
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

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const cancellation = await cancellationService.getById(id);
        if (cancellation.reason) {
          setSelectedReason(cancellation.reason);

          // Populate existing explanation data
          if (cancellation.explanation) {
            switch (cancellation.reason) {
              case "Too expensive":
                // Extract price from explanation (format: "$25")
                const price = cancellation.explanation.replace("$", "");
                setMaxPrice(price);
                break;
              case "Platform not helpful":
                setPlatformFeedback(cancellation.explanation);
                break;
              case "Not enough relevant jobs":
                setJobsFeedback(cancellation.explanation);
                break;
              case "Decided not to move":
                setMoveFeedback(cancellation.explanation);
                break;
              case "Other":
                setOtherReason(cancellation.explanation);
                break;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching existing cancellation data:", error);
        // Continue with empty form if fetch fails
      }
    };

    if (id) {
      fetchExistingData();
    }
  }, [id, setMaxPrice]);

  const handleDownsellAccept = async () => {
    setLoading(true);

    try {
      // Accept the downsell offer
      const response = await cancellationService.update(id, {
        accepted_downsell: true,
      });

      console.log("Downsell accepted successfully:", response);
    } catch (error) {
      console.error("Error accepting downsell:", error);
    } finally {
      setLoading(false);
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
      console.log("Cancellation ID:");

      // Update cancellation with simplified cancel reasons data
      const response = await cancellationService.update(id, updateData);

      console.log("Cancel reasons saved successfully:", response);

      // Close modal or proceed to next step
    } catch (error) {
      console.error("Error saving cancel reasons:", error);
      // Could add error toast notification here
    } finally {
      setLoading(false);
    }
  };

  return {
    // errors
    showFollowUpError,
    setShowFollowUpError,
    showPriceError,
    setShowPriceError,
    showError,
    setShowError,

    // validation
    isValidPrice,
    isFormValid,

    // price
    maxPrice,
    setMaxPrice,

    // feedback
    platformFeedback,
    setPlatformFeedback,
    jobsFeedback,
    setJobsFeedback,
    moveFeedback,
    setMoveFeedback,
    otherReason,
    setOtherReason,

    // reason
    selectedReason,
    setSelectedReason,
    handleReasonSelect,
    getCurrentExplanation,

    // flow / actions
    loading,
    setLoading,
    handleDownsellAccept,
    handleSubmit,
  };
};

export default useCancelReasons;
