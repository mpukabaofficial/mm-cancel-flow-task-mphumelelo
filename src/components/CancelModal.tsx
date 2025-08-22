// app/components/CancelModal.tsx
"use client";

import { useEffect, useState } from "react";
import CancelReasonStep from "./CancelReasonStep";
import CancellationCard from "./CancellationCard";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export default function CancelModal({ isOpen, onClose, id }: CancelModalProps) {
  const [step, setStep] = useState(0);

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

  return (
    <div
      className="bg-black/30 fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      {step === 0 && (
        <CancelReasonStep
          step={step}
          setStep={setStep}
          onClose={onClose}
          id={id}
        />
      )}
      {step === 1 && (
        <CancellationCard onSetStep={setStep} onClose={onClose} step={step}>
          <div className="w-full h-64"></div>
        </CancellationCard>
      )}
    </div>
  );
}
