import { DownsellVariant } from "@/lib/variant";
import { useEffect, useState } from "react";
import { useCancellationFlow } from "./useCancellationFlow";

const useVariant = (isOpen: boolean) => {
  const [variant, setVariant] = useState<DownsellVariant | null>(null);
  
    const { getOrAssignVariant, loading, subscription } =
    useCancellationFlow();

  // Get or assign variant when modal opens
    useEffect(() => {
      if (isOpen && !variant) {
        getOrAssignVariant()
          .then((result) => {
            setVariant(result.variant);
          })
          .catch((err) => {
            console.error("Failed to assign variant:", err);
            // Fallback to variant B if assignment fails
            setVariant("B");
          });
      }
    }, [isOpen, variant, getOrAssignVariant]);

  return {variant, setVariant, loading, subscription};
};

export default useVariant;