/**
 * User Utility
 * 
 * Uses the first seeded user from the database as the logged-in user
 * for the cancellation flow.
 */

export interface User {
  id: string;
  email: string;
}

/**
 * Returns the user data for the cancellation flow
 * Uses the first seeded user: user1@example.com
 */
export function getUser(): User {
  return {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'user1@example.com'
  };
}

/**
 * Fetch the user's active subscription from the database
 * Returns the latest active subscription for the user
 */
export async function fetchUserSubscription() {
  const user = getUser();
  
  try {
    const response = await fetch(`/api/subscriptions/user/${user.id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Subscription API failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to fetch subscription: ${response.status} ${response.statusText}`);
    }
    
    const subscription = await response.json();
    
    return {
      id: subscription.id,
      user_id: subscription.user_id,
      monthly_price: subscription.monthly_price / 100, // Convert cents to dollars
      status: subscription.status,
      created_at: subscription.created_at,
      updated_at: subscription.updated_at
    };
  } catch (error) {
    console.error('Error in fetchUserSubscription:', error);
    throw error;
  }
}