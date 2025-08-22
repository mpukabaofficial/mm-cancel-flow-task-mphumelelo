/**
 * Mock User Utility
 * 
 * Uses the first seeded user from the database as the mock logged-in user
 * for the cancellation flow demo.
 */

export interface MockUser {
  id: string;
  email: string;
}

/**
 * Returns the mock user data for the cancellation flow
 * Uses the first seeded user: user1@example.com
 */
export function getMockUser(): MockUser {
  return {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'user1@example.com'
  };
}

/**
 * Fetch the user's active subscription from the database
 * Returns the latest active subscription for the mock user
 */
export async function fetchMockUserSubscription() {
  try {
    const mockUser = getMockUser();
    const response = await fetch(`/api/subscriptions/${mockUser.id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
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
    console.error('Error fetching subscription:', error);
    // Fallback subscription data
    const fallbackDate = new Date().toISOString();
    return {
      id: 'fallback-subscription-id',
      user_id: getMockUser().id,
      monthly_price: 25,
      status: 'active' as const,
      created_at: fallbackDate,
      updated_at: fallbackDate
    };
  }
}

/**
 * Get mock subscription data for the user
 * Based on seed.sql: user1 has a $25 subscription
 * This is synchronous fallback data
 */
export function getMockSubscription() {
  const fallbackDate = new Date().toISOString();
  return {
    id: 'sync-fallback-id',
    user_id: getMockUser().id,
    monthly_price: 25, // $25 (stored as 2500 cents in DB)
    status: 'active' as const,
    created_at: fallbackDate,
    updated_at: fallbackDate
  };
}