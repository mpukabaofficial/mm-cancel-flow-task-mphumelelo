import { useState } from 'react'
import { useUser, useSubscription, useUserActions } from '@/store/userStore'
import { cancellationService } from '@/lib/api'
import { DownsellVariant } from '@/lib/variant'

/**
 * Custom hook for managing the cancellation flow
 * Integrates with Zustand store for user and subscription state
 */
export function useCancellationFlow() {
  const user = useUser()
  const subscription = useSubscription()
  const { updateSubscriptionStatus } = useUserActions()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [variant, setVariant] = useState<DownsellVariant | null>(null)
  const [cancellationId, setCancellationId] = useState<string | null>(null)

  const getOrAssignVariant = async () => {
    if (!user || !subscription) {
      throw new Error('User or subscription not available')
    }

    setLoading(true)
    setError(null)

    try {
      const result = await cancellationService.getOrAssignVariant(user.id, subscription.id)
      setVariant(result.variant)
      
      // If a new cancellation was created, store its ID
      if (result.isNewAssignment) {
        const cancellations = await cancellationService.getAll(user.id)
        const latestCancellation = cancellations
          .filter(c => c.subscription_id === subscription.id)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        
        if (latestCancellation) {
          setCancellationId(latestCancellation.id)
        }
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign variant'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCancellation = async (updates: {
    reason?: string
    accepted_downsell?: boolean
    has_job?: boolean
  }) => {
    if (!cancellationId) {
      throw new Error('No cancellation record found')
    }

    setLoading(true)
    try {
      const updated = await cancellationService.update(cancellationId, updates)
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cancellation'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const markSubscriptionForCancellation = async () => {
    if (!subscription) {
      throw new Error('No subscription available')
    }

    setLoading(true)
    try {
      // Update local store immediately for optimistic UI
      updateSubscriptionStatus('pending_cancellation')
      
      // Then sync with backend (this would normally update via API)
      // For now, we'll just log the action
      console.log('Subscription marked for cancellation:', subscription.id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subscription'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    user,
    subscription,
    variant,
    cancellationId,
    loading,
    error,

    // Actions
    getOrAssignVariant,
    updateCancellation,
    markSubscriptionForCancellation,
    setError
  }
}