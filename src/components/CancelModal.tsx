// app/components/CancelModal.tsx
"use client";

import { useEffect, useState } from "react";
import CancelReasonStep from "./CancelReasonStep";
import { cancellationService } from "@/lib/api";
import { DownsellVariant, VARIANT_CONFIG } from "@/lib/variant";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHasFoundJob: (hasFoundJob: boolean) => void;
  userId: string;
  subscriptionId: string;
}

export default function CancelModal({ isOpen, onClose, userId, subscriptionId }: CancelModalProps) {
  const [variant, setVariant] = useState<DownsellVariant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Handle variant assignment when modal opens
  useEffect(() => {
    if (isOpen && !variant) {
      const assignVariant = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await cancellationService.getOrAssignVariant(userId, subscriptionId);
          setVariant(result.variant);
          console.log(`Assigned variant ${result.variant} (${result.isNewAssignment ? 'new' : 'existing'})`);
        } catch (err) {
          setError('Failed to assign variant');
          console.error('Variant assignment error:', err);
        } finally {
          setIsLoading(false);
        }
      };

      assignVariant();
    }
  }, [isOpen, userId, subscriptionId, variant]);

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
      {isLoading ? (
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing your cancellation flow...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      ) : variant ? (
        <div className="bg-white rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-bold mb-4">Cancellation Flow</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Variant: <strong>{variant}</strong> - {VARIANT_CONFIG[variant].description}
            </p>
            {variant === 'B' && (
              <p className="text-sm text-green-600 mt-2">
                🎯 You'll see a special $10 discount offer!
              </p>
            )}
          </div>
          <CancelReasonStep />
        </div>
      ) : null}
    </div>
  );
}
