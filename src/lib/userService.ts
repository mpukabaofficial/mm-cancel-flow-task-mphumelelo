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
      const response = await api.get("/users");
      console.log("User API response:", response.data);
      
      if (!response.data.success || !response.data.users || response.data.users.length === 0) {
        return null;
      }

      return response.data.users[0];
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
    if (!user?.id) {
      console.log("No user available for subscription fetch");
      return null;
    }

    try {
      const response = await api.get(`/subscriptions/user/${user.id}`);
      console.log("Subscription API response:", response.data);

      const subscription = response.data;

      return {
        id: subscription.id,
        user_id: subscription.user_id,
        monthly_price: subscription.monthly_price, // Keep price in cents
        status: subscription.status,
        created_at: subscription.created_at,
        updated_at: subscription.updated_at,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching subscription:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        
        // If it's a 404, that's expected for users without subscriptions
        if (error.response?.status === 404) {
          console.log("No active subscription found for user");
          return null;
        }
      } else {
        console.error("Unexpected error fetching subscription:", error);
      }
      throw new Error("Failed to fetch subscription. Please try again.");
    }
  },
};
