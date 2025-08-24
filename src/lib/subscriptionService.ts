import { Subscription } from "../types/types";
import api from "./api";

// =====================
// SUBSCRIPTION SERVICE
// =====================

// Frontend HTTP-based operations
export const subscriptionService = {
  getAll: async (userId?: string): Promise<Subscription[]> => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get("/subscriptions", { params });
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: "active" | "pending_cancellation" | "cancelled"
  ): Promise<Subscription> => {
    const response = await api.patch("/subscriptions", { id, status });
    return response.data;
  },

  cancel: async (id: string): Promise<Subscription> => {
    const response = await api.patch(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  acceptDownsell: async (
    id: string,
    newPrice: number
  ): Promise<Subscription> => {
    const response = await api.patch(`/subscriptions/${id}/downsell`, {
      newPrice,
    });
    return response.data;
  },
};
