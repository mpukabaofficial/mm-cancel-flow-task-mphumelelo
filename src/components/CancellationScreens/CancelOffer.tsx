import useCancelOffer from "@/hooks/CancelOffer/useCancelOffer";
import { DownsellVariant } from "@/lib/variant";
import { Step } from "@/types/step";
import { useEffect } from "react";
import CancelOfferSkeleton from "../skeletons/CancelOfferSkeleton";
import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";
import HorizontalLine from "../ui/HorizontalLine";

interface Props {
  step: Step;
  setStep: (step: Step) => void;
  variant: DownsellVariant;
}

const CancelOffer = ({ setStep, step, variant }: Props) => {
  const {
    handleDownsellResponse,
    loading,
    setIsVariantA,
    setLoading,
    isVariantA,
    submitting,
    error,
    discountedPrice,
    originalPrice,
  } = useCancelOffer();

  // Check if this is variant A (skip downsell step)
  useEffect(() => {
    if (variant === "A") {
      setIsVariantA(true);
      // For variant A, automatically proceed to next step
      // This effect should only run once when variant is determined
      const timer = setTimeout(() => {
        setStep({ ...step, num: step.num + 1 });
      }, 0);
      return () => clearTimeout(timer);
    }
    setLoading(false);
  }, [variant, step, setStep, setLoading, setIsVariantA]);

  // Don't render anything for variant A (they skip this step)
  if (isVariantA || variant === "A") {
    return null;
  }

  // Show skeleton while loading
  if (loading) {
    return <CancelOfferSkeleton />;
  }

  return (
    <div className="w-full space-y-5">
      <h1 className="text-large">
        We built this to help you land the job, this makes it a little easier.
      </h1>
      <p className="text-2xl tracking-[-1.2px] text-gray-warm-700">
        We&apos;ve been there and we&apos;re here to help you.
      </p>
      <div className="p-3 border border-Brand-Migrate-Mate bg-Brand-Background rounded-xl">
        <h2 className="text-[28px] mb-2 tracking-[-1.2px] text-center">
          Here&apos;s ${originalPrice - discountedPrice} off until you find a
          job.
        </h2>
        <div className="flex gap-[10px] items-end justify-center w-full mb-4">
          <span className="text-Brand-Migrate-Mate text-2xl tracking-[-1.2px]">
            ${discountedPrice}/month
          </span>
          <span className="line-through text-normal">
            ${originalPrice} /month
          </span>
        </div>
        <Button
          variant="green"
          onClick={() => {
            handleDownsellResponse(true);
            setStep({ option: "A", num: step.num + 1 });
          }}
          disabled={submitting}
        >
          {submitting
            ? "Processing..."
            : `Get $${originalPrice - discountedPrice} off`}
        </Button>
        <p className="fine-print text-center w-full">
          You won&apos;t be charged until your next billing date.
        </p>
      </div>
      <HorizontalLine />
      <Button
        onClick={() => {
          handleDownsellResponse(false);
          setStep({ option: "B", num: step.num + 1 });
        }}
        disabled={submitting}
      >
        No thanks
      </Button>
      <ErrorMessage error={error} />
    </div>
  );
};

export default CancelOffer;
