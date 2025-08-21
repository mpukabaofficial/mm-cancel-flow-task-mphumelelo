import { useState, useEffect } from 'react'
import { cancellationService, subscriptionService } from './api'
import { Cancellation, Subscription } from './types'

export const useCancellations = (userId?: string) => {
  const [cancellations, setCancellations] = useState<Cancellation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCancellations = async () => {
      try {
        setLoading(true)
        const data = await cancellationService.getAll(userId)
        setCancellations(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch cancellations')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCancellations()
  }, [userId])

  const createCancellation = async (data: any) => {
    try {
      const newCancellation = await cancellationService.create(data)
      setCancellations(prev => [...prev, newCancellation])
      return newCancellation
    } catch (err) {
      setError('Failed to create cancellation')
      throw err
    }
  }

  const updateCancellation = async (id: string, data: any) => {
    try {
      const updated = await cancellationService.update(id, data)
      setCancellations(prev => 
        prev.map(item => item.id === id ? updated : item)
      )
      return updated
    } catch (err) {
      setError('Failed to update cancellation')
      throw err
    }
  }

  return {
    cancellations,
    loading,
    error,
    createCancellation,
    updateCancellation
  }
}

export const useSubscriptions = (userId?: string) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true)
        const data = await subscriptionService.getAll(userId)
        setSubscriptions(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch subscriptions')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [userId])

  const updateSubscriptionStatus = async (id: string, status: 'active' | 'pending_cancellation' | 'cancelled') => {
    try {
      const updated = await subscriptionService.updateStatus(id, status)
      setSubscriptions(prev => 
        prev.map(item => item.id === id ? updated : item)
      )
      return updated
    } catch (err) {
      setError('Failed to update subscription')
      throw err
    }
  }

  return {
    subscriptions,
    loading,
    error,
    updateSubscriptionStatus
  }
}