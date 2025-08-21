"use client";

import { fetchMockUserSubscription } from "@/lib/mockUser";
import { useEffect, useState } from "react";
import CancelModal from "./CancelModal";

interface CancelModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CancelModalWrapper({
  isOpen,
  onClose,
}: CancelModalWrapperProps) {
  const [subscription, setSubscription] = useState<{
    id: string;
    monthly_price: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !subscription) {
      setLoading(true);
      fetchMockUserSubscription()
        .then(setSubscription)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, subscription]);

  if (!isOpen) return null;

  if (loading || !subscription) {
    return (
      <div className="bg-black/30 fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscription data...</p>
          </div>
        </div>
      </div>
    );
  }

  return <CancelModal isOpen={isOpen} onClose={onClose} />;
}
