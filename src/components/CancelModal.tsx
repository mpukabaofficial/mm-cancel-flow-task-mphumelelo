// app/components/CancelModal.tsx
"use client";

import { useEffect, useState } from "react";
import CancelOffer from "./CancelOffer";
import CancelReasonStep from "./CancelReasonStep";
import CancellationCard from "./CancellationCard";
import { useCancellationFlow } from "@/hooks/useCancellationFlow";
import { DownsellVariant } from "@/lib/variant";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export default function CancelModal({ isOpen, onClose, id }: CancelModalProps) {
  const [step, setStep] = useState(0);
  const [variant, setVariant] = useState<DownsellVariant | null>(null);
  const [cancellationId, setCancellationId] = useState<string | null>(null);

  const { getOrAssignVariant, loading, error } = useCancellationFlow();

  // Get or assign variant when modal opens
  useEffect(() => {
    if (isOpen && !variant) {
      getOrAssignVariant()
        .then((result) => {
          setVariant(result.variant);
          setCancellationId(result.id);
        })
        .catch((err) => {
          console.error("Failed to assign variant:", err);
          // Fallback to variant B if assignment fails
          setVariant("B");
          setCancellationId(id);
        });
    }
  }, [isOpen, variant, getOrAssignVariant, id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Show loading while variant is being assigned
  if (loading || !variant || !cancellationId) {
    return (
      <div className="bg-black/30 fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
        <div className="bg-white rounded-lg p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
          <span className="ml-3">Loading...</span>
        </div>
      </div>
    );
  }

  // // Calculate total steps based on variant
  // const getTotalSteps = () => {
  //   if (variant === 'A') {
  //     // Variant A: Step 0 (reason), skip downsell, Step 1 (final)
  //     return 2;
  //   } else {
  //     // Variant B: Step 0 (reason), Step 1 (downsell), Step 2 (final)
  //     return 3;
  //   }
  // };

  // Adjust step rendering based on variant
  const renderStep = () => {
    if (variant === "A") {
      // Variant A flow: reason -> final (skip downsell)
      if (step === 0) {
        return (
          <CancelReasonStep
            step={step}
            setStep={setStep}
            onClose={onClose}
            id={cancellationId}
          />
        );
      } else if (step === 1) {
        return (
          <CancellationCard step={step} onSetStep={setStep} onClose={onClose}>
            <div className="h-80 w-full flex justify-center items-center">
              Final Step (Variant A)
            </div>
          </CancellationCard>
        );
      }
    } else {
      // Variant B flow: reason -> downsell -> final
      if (step === 0) {
        return (
          <CancelReasonStep
            step={step}
            setStep={setStep}
            onClose={onClose}
            id={cancellationId}
          />
        );
      } else if (step === 1) {
        return (
          <CancelOffer
            step={step}
            setStep={setStep}
            onClose={onClose}
            id={cancellationId}
            variant={variant}
          />
        );
      } else if (step === 2) {
        return (
          <CancellationCard step={step} onSetStep={setStep} onClose={onClose}>
            <div className="h-80 w-full flex justify-center items-center">
              Final Step (Variant B)
            </div>
          </CancellationCard>
        );
      }
    }
    return null;
  };

  return (
    <div
      className="bg-black/30 fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {renderStep()}
    </div>
  );
}
