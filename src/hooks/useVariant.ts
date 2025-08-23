import { DownsellVariant } from "@/lib/variant";
import { useEffect, useState } from "react";
import { useCancellationFlow } from "./useCancellationFlow";

const useVariant = (isOpen: boolean, id:string) => {
  const [variant, setVariant] = useState<DownsellVariant | null>(null);
    const [cancellationId, setCancellationId] = useState<string | null>(null);
  

    const { getOrAssignVariant, loading, error, subscription } =
    useCancellationFlow();

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

  return {cancellationId, variant, setVariant, loading, error, subscription, setCancellationId};
};

export default useVariant;