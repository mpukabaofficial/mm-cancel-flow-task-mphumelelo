'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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

interface UserContextType {
  user: User | null
  subscription: Subscription | null
  isLoading: boolean
  error: string | null
  updateSubscriptionStatus: (status: Subscription['status']) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Get mock user
        const mockUser = getMockUser()
        setUser(mockUser)
        
        // Fetch user's subscription
        const userSubscription = await fetchMockUserSubscription()
        setSubscription(userSubscription)
      } catch (err) {
        console.error('Failed to initialize user:', err)
        setError('Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [])

  const updateSubscriptionStatus = (status: Subscription['status']) => {
    if (subscription) {
      setSubscription({
        ...subscription,
        status,
        updated_at: new Date().toISOString()
      })
    }
  }

  const value: UserContextType = {
    user,
    subscription,
    isLoading,
    error,
    updateSubscriptionStatus
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}