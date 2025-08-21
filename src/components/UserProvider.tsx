'use client'

import { useEffect, useState } from 'react'
import { useUserActions, useUserLoading, useUserStore } from '@/store/userStore'

interface UserProviderProps {
  children: React.ReactNode
}

export default function UserProvider({ children }: UserProviderProps) {
  const [isClient, setIsClient] = useState(false)
  const { initializeUser } = useUserActions()
  const isLoading = useUserLoading()

  // Ensure we're on the client before accessing the store
  useEffect(() => {
    setIsClient(true)
    // Manually trigger hydration from localStorage
    useUserStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (isClient) {
      // Initialize user data on app start
      initializeUser()
    }
  }, [initializeUser, isClient])

  // Don't render anything on the server to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}