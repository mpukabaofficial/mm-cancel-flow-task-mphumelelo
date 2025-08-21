import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'

/**
 * Hook to safely access Zustand store on client-side only
 * Prevents hydration mismatches in SSR environments
 */
export function useClientStore() {
  const [isClient, setIsClient] = useState(false)
  
  // Always call hooks - React hooks must be called in the same order
  const user = useUserStore((state) => state.user)
  const subscription = useUserStore((state) => state.subscription)
  const isLoading = useUserStore((state) => state.isLoading)
  const error = useUserStore((state) => state.error)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Return null values during SSR, actual values on client
  return {
    user: isClient ? user : null,
    subscription: isClient ? subscription : null,
    isLoading: isClient ? isLoading : false,
    error: isClient ? error : null,
    isClient
  }
}