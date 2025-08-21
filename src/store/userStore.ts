import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { getMockUser, fetchMockUserSubscription } from '@/lib/mockUser'

export interface User {
  id: string
  email: string
}

export interface Subscription {
  id: string
  user_id: string
  monthly_price: number
  status: 'active' | 'pending_cancellation' | 'cancelled'
  created_at?: string
  updated_at?: string
}

export interface UserState {
  // State
  user: User | null
  subscription: Subscription | null
  isLoading: boolean
  error: string | null
  
  // Actions
  initializeUser: () => Promise<void>
  setUser: (user: User) => void
  setSubscription: (subscription: Subscription) => void
  updateSubscriptionStatus: (status: Subscription['status']) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        subscription: null,
        isLoading: false,
        error: null,

        // Actions
        initializeUser: async () => {
          set({ isLoading: true, error: null })
          
          try {
            // Get mock user
            const mockUser = getMockUser()
            set({ user: mockUser })
            
            // Fetch user's subscription
            const subscription = await fetchMockUserSubscription()
            set({ subscription, isLoading: false })
          } catch (error) {
            console.error('Failed to initialize user:', error)
            set({ 
              error: 'Failed to load user data', 
              isLoading: false 
            })
          }
        },

        setUser: (user) => set({ user }),

        setSubscription: (subscription) => set({ subscription }),

        updateSubscriptionStatus: (status) => {
          const { subscription } = get()
          if (subscription) {
            set({
              subscription: {
                ...subscription,
                status,
                updated_at: new Date().toISOString()
              }
            })
          }
        },

        clearUser: () => set({
          user: null,
          subscription: null,
          error: null
        }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error })
      }),
      {
        name: 'user-storage', // Key for localStorage
        partialize: (state) => ({ 
          user: state.user,
          subscription: state.subscription 
        }), // Only persist user and subscription data
        skipHydration: true, // Skip hydration to avoid SSR mismatch
      }
    ),
    {
      name: 'user-store', // DevTools name
    }
  )
)

// Selectors for easy component usage
export const useUser = () => useUserStore((state) => state.user)
export const useSubscription = () => useUserStore((state) => state.subscription)
export const useUserLoading = () => useUserStore((state) => state.isLoading)
export const useUserError = () => useUserStore((state) => state.error)

// Action selectors
export const useUserActions = () => useUserStore((state) => ({
  initializeUser: state.initializeUser,
  setUser: state.setUser,
  setSubscription: state.setSubscription,
  updateSubscriptionStatus: state.updateSubscriptionStatus,
  clearUser: state.clearUser,
  setLoading: state.setLoading,
  setError: state.setError
}))