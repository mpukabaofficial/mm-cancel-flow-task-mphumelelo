import {
  Cancellation,
  CreateCancellationRequest,
  UpdateCancellationRequest,
} from "../types/types";
import api from "./api";
import { DownsellVariant, assignVariant } from "./variant";

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
    const response = await api.patch(`/cancellations/${id}`, data);
    return response.data;
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
          reason: undefined,
          has_job: undefined,
        });

        return {
          variant: newCancellation.downsell_variant,
          isNewAssignment: true,
          id: newCancellation.id,
        };
      } catch (createError) {
        console.warn(
          "Failed to create cancellation record, using fallback:",
          createError
        );
        // Return variant with a fallback ID that won't break the flow
        return {
          variant: variant,
          isNewAssignment: true,
          id: `fallback-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        };
      }
    } catch (error) {
      console.warn(
        "Error getting existing cancellations, using fallback variant:",
        error
      );
      // Fallback to assigning variant without persistence
      return {
        variant: assignVariant(),
        isNewAssignment: true,
        id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
    }
  },
};
