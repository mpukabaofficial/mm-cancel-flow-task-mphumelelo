import { AxiosError } from "axios";
import api from "./api";

// User interface
export interface User {
  id: string;
  email: string;
}

// =====================
// USER SERVICE
// =====================
export const userService = {
  /**
   * Returns the user data for the cancellation flow
   * Uses the first seeded user: user1@example.com
   */
  getUser: async () => {
    try {
      const response = await api.get<User[]>("/users");
      console.log(response);
      const users = response.data;
      if (users.length === 0) return null;

      return response.data[0];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching user:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error("Unexpected error fetching user:", error);
      }
      throw new Error("Failed to fetch user. Please try again.");
    }
  },

  /**
   * Fetch the user's active subscription from the database
   * Returns the latest active subscription for the user
   */
  fetchUserSubscription: async () => {
    const user = await userService.getUser();
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/subscriptions/user/${user.id}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Subscription API failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(
          `Failed to fetch subscription: ${response.status} ${response.statusText}`
        );
      }

      const subscription = await response.json();

      return {
        id: subscription.id,
        user_id: subscription.user_id,
        monthly_price: subscription.monthly_price / 100, // Convert cents to dollars
        status: subscription.status,
        created_at: subscription.created_at,
        updated_at: subscription.updated_at,
      };
    } catch (error) {
      console.error("Error in fetchUserSubscription:", error);
      throw error;
    }
  },
};
