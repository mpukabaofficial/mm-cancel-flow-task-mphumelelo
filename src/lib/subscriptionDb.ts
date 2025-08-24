import { Subscription } from "../types/types";
import { supabaseAdmin } from "./supabase";

// =====================
// SUBSCRIPTION DATABASE OPERATIONS (SERVER-SIDE ONLY)
// =====================

export const subscriptionDb = {
  /**
   * Cancel subscription - keeps active until expiry but marks as cancelled
   */
  cancelSubscription: async (subscriptionId: string): Promise<Subscription> => {
    // Calculate expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        has_cancelled: true,
        cancelled_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        status: "pending_cancellation", // Still active until expiry
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    return data;
  },

  /**
   * Accept downsell offer - updates price and keeps subscription active
   */
  acceptDownsellOffer: async (
    subscriptionId: string,
    newPrice: number
  ): Promise<Subscription> => {
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        monthly_price: newPrice,
        status: "active",
        has_cancelled: false, // Reset cancelled status since they accepted offer
        cancelled_at: null,
        expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to accept downsell offer: ${error.message}`);
    }

    return data;
  },

  /**
   * Get subscription by ID
   */
  getById: async (subscriptionId: string): Promise<Subscription> => {
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .single();

    if (error) {
      throw new Error(`Failed to get subscription: ${error.message}`);
    }

    return data;
  },

  /**
   * Check if subscription has expired and update status if needed
   */
  checkAndUpdateExpiredSubscriptions: async (): Promise<void> => {
    const now = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: now,
      })
      .lt("expires_at", now)
      .eq("status", "pending_cancellation");

    if (error) {
      throw new Error(
        `Failed to update expired subscriptions: ${error.message}`
      );
    }
  },
};