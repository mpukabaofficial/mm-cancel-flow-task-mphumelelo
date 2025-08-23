import { Step } from "@/types/step";
import Button from "./ui/Button";
import HorizontalLine from "./ui/HorizontalLine";
import { useState, useEffect } from "react";
import { cancellationService } from "@/lib/api";

interface Props {
  setStep: (step: Step) => void;
  step: Step;
  id: string;
}

const CancelHow = ({ setStep, step, id }: Props) => {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load existing explanation on mount
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        setLoading(true);
        const cancellation = await cancellationService.getById(id);
        if (cancellation.explanation) {
          setText(cancellation.explanation);
        }
      } catch (err) {
        console.error("Failed to load existing data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadExistingData();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function handleSubmit() {
    if (text.length < 25 || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await cancellationService.update(id, {
        explanation: text,
      });

      // Move to next step after successful save
      setStep({ ...step, num: step.num + 1 });
    } catch (err) {
      console.error("Failed to save feedback:", err);
      setError("Failed to save your feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full space-y-5">
        <h1 className="text-large">
          What’s one thing you wish we could’ve helped you with?
        </h1>
        <p className="max-w-[395px] text-normal">
          We’re always looking to improve, your thoughts can help us make
          Migrate Mate more useful for others.*{" "}
        </p>
        <div className="relative w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            className="rounded-lg w-full border p-3 outline-none font-normal tracking-[-0.6px] min-h-[150px] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="absolute bottom-2 right-3 text-xs font-normal text-gray-warm-700 tracking-[-0.6px]">
            Min 25 characters ({text.length}/25)
          </span>
        </div>
        <HorizontalLine />
        <Button
          disabled={text.length < 25 || submitting || loading}
          onClick={handleSubmit}
        >
          {submitting ? "Saving..." : "Continue"}
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
  );
};

export default CancelHow;
