import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { cancellationService } from '@/lib/cancellationService'
import { DownsellVariant } from '@/lib/variant'

/**
 * Custom hook for managing the cancellation flow
 * Integrates with React Context for user and subscription state
 */
export function useCancellationFlow() {
  const { user, subscription, updateSubscriptionStatus } = useUser()
  
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
      
      // Store the cancellation ID directly from the result
      if (result.id) {
        setCancellationId(result.id)
      }

      return result
    } catch (err) {
      console.warn('Error in getOrAssignVariant:', err)
      // Set fallback values to keep the app working
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign variant'
      setError(errorMessage)
      
      // Don't throw the error - return fallback values instead
      const fallbackResult = {
        variant: 'A' as DownsellVariant,
        isNewAssignment: true,
        id: `fallback-${Date.now()}`
      }
      
      setVariant(fallbackResult.variant)
      setCancellationId(fallbackResult.id)
      
      return fallbackResult
    } finally {
      setLoading(false)
    }
  }

  const updateCancellation = async (updates: {
    reason?: 'Too expensive' | 'Platform not helpful' | 'Not enough relevant jobs' | 'Decided not to move' | 'Other'
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