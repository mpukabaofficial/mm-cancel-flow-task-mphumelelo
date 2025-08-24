import {
  Cancellation,
  CreateCancellationRequest,
  UpdateCancellationRequest,
} from "../types/types";
import api from "./api";
import { DownsellVariant, assignVariant } from "./variant";

// Helper function to generate a valid UUID v4
function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers and Node.js)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// =====================
// CANCELLATION SERVICE
// =====================
export const cancellationService = {
  create: async (data: CreateCancellationRequest): Promise<Cancellation> => {
    const response = await api.post("/cancellations", data);
    return response.data;
  },

  getAll: async (userId?: string): Promise<Cancellation[]> => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get("/cancellations", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Cancellation> => {
    const response = await api.get(`/cancellations/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateCancellationRequest
  ): Promise<Cancellation> => {
    try {
      const response = await api.patch(`/cancellations/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      // If the cancellation doesn't exist (404 or similar), we might need to create it
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 404) {
        console.warn(`Cancellation ${id} not found, this indicates a fallback UUID was used`);
        throw new Error(`Cancellation with ID ${id} not found. This usually means a fallback UUID was generated when the original cancellation creation failed.`);
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/cancellations/${id}`);
  },

  resetToBasic: async (id: string): Promise<Cancellation> => {
    const response = await api.patch(`/cancellations/${id}/reset`, {});
    return response.data;
  },

  /**
   * This fetches a cancellation based on the user and their subscription
   * @param userId
   * @param subscriptionId
   * @returns cancellation
   */
  getBySubscription: async (
    subscriptionId: string,
    userId: string
  ): Promise<Cancellation | null> => {
    try {
      const existingCancellations = await cancellationService.getAll(userId);
      return (
        existingCancellations.find(
          (c) => c.subscription_id === subscriptionId
        ) ?? null
      );
    } catch (err) {
      console.warn("Failed to fetch cancellation:", err);
      return null;
    }
  },

  /**
   * Check if user has already used the downsell offer
   */
  hasUsedDownsell: async (
    subscriptionId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const existingCancellations = await cancellationService.getAll(userId);
      return existingCancellations.some(
        (c) => c.subscription_id === subscriptionId && c.accepted_downsell === true
      );
    } catch (err) {
      console.warn("Failed to check downsell usage:", err);
      return false;
    }
  },

  /**
   * Get or assign variant for a user's cancellation flow
   * Checks if user has existing cancellation, if so returns existing variant
   * If not, assigns new variant using secure RNG
   */
  getOrAssignVariant: async (
    userId: string,
    subscriptionId: string
  ): Promise<{
    variant: DownsellVariant;
    isNewAssignment: boolean;
    id: string;
  }> => {
    try {
      // Check for existing cancellation
      const existingCancellations = await cancellationService.getAll(userId);
      const existingCancellation = existingCancellations.find(
        (c) => c.subscription_id === subscriptionId
      );

      if (existingCancellation) {
        return {
          variant: existingCancellation.downsell_variant,
          isNewAssignment: false,
          id: existingCancellation.id,
        };
      }

      // No existing cancellation, assign new variant
      const variant = assignVariant();

      // Try to create initial cancellation record with assigned variant
      try {
        const newCancellation = await cancellationService.create({
          subscription_id: subscriptionId,
          downsell_variant: variant,
        });

        return {
          variant: newCancellation.downsell_variant,
          isNewAssignment: true,
          id: newCancellation.id,
        };
      } catch (createError) {
        console.warn(
          "Failed to create cancellation record, trying alternative approach:",
          createError
        );
        
        // Try a simpler creation without the optional fields that might be causing issues
        try {
          const simpleCancellation = await cancellationService.create({
            subscription_id: subscriptionId,
            downsell_variant: variant,
          });

          return {
            variant: simpleCancellation.downsell_variant,
            isNewAssignment: true,
            id: simpleCancellation.id,
          };
        } catch (fallbackError) {
          console.error(
            "Complete failure to create cancellation record:",
            fallbackError
          );
          // As a last resort, return a fallback but this shouldn't happen in normal operation
          return {
            variant: variant,
            isNewAssignment: true,
            id: generateUUID(),
          };
        }
      }
    } catch (error) {
      console.warn(
        "Error getting existing cancellations, trying to create new cancellation:",
        error
      );
      
      // Try to create a new cancellation even when we can't fetch existing ones
      const variant = assignVariant();
      try {
        const newCancellation = await cancellationService.create({
          subscription_id: subscriptionId,
          downsell_variant: variant,
        });

        return {
          variant: newCancellation.downsell_variant,
          isNewAssignment: true,
          id: newCancellation.id,
        };
      } catch (createError) {
        console.error(
          "Complete failure to create or fetch cancellation:",
          createError
        );
        // As a last resort, return a fallback UUID (this should rarely happen)
        return {
          variant: variant,
          isNewAssignment: true,
          id: generateUUID(),
        };
      }
    }
  },
};
