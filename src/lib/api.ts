import axios from 'axios'
import { 
  Cancellation, 
  CreateCancellationRequest, 
  UpdateCancellationRequest,
  Subscription 
} from './types'
import { DownsellVariant, assignVariant } from './variant'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const cancellationService = {
  create: async (data: CreateCancellationRequest): Promise<Cancellation> => {
    const response = await api.post('/cancellations', data)
    return response.data
  },

  getAll: async (userId?: string): Promise<Cancellation[]> => {
    const params = userId ? { user_id: userId } : {}
    const response = await api.get('/cancellations', { params })
    return response.data
  },

  getById: async (id: string): Promise<Cancellation> => {
    const response = await api.get(`/cancellations/${id}`)
    return response.data
  },

  update: async (id: string, data: UpdateCancellationRequest): Promise<Cancellation> => {
    const response = await api.patch(`/cancellations/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/cancellations/${id}`)
  },

  resetToBasic: async (id: string): Promise<Cancellation> => {
    const response = await api.patch(`/cancellations/${id}/reset`, {})
    return response.data
  },


  /**
   * This fetches a cancellation based on the user and their subscription
   * @param userId
   * @param subscriptionId 
   * @returns cancellation
   */

getBySubscription: async (
  subscriptionId: string,
  userId: string
): Promise<Cancellation | null> => {
  try {
    const existingCancellations = await cancellationService.getAll(userId);
    return existingCancellations.find(c => c.subscription_id === subscriptionId) ?? null;
  } catch (err) {
    console.error("Failed to fetch cancellation:", err);
    return null;
  }
},


  /**
   * Get or assign variant for a user's cancellation flow
   * Checks if user has existing cancellation, if so returns existing variant
   * If not, assigns new variant using secure RNG
   */
  getOrAssignVariant: async (userId: string, subscriptionId: string): Promise<{ variant: DownsellVariant; isNewAssignment: boolean, id: string }> => {
    try {
      // Check for existing cancellation
      const existingCancellations = await cancellationService.getAll(userId)
      const existingCancellation = existingCancellations.find(c => c.subscription_id === subscriptionId)
      
      if (existingCancellation) {
        return {
          variant: existingCancellation.downsell_variant,
          isNewAssignment: false, id: existingCancellation.id
        }
      }

      // No existing cancellation, assign new variant
      const variant = assignVariant()
      
      // Create initial cancellation record with assigned variant
      const newCancellation = await cancellationService.create({
        subscription_id: subscriptionId,
        downsell_variant: variant,
        reason: undefined,
        has_job: undefined
      })

      return {
        variant: newCancellation.downsell_variant,
        isNewAssignment: true, id: newCancellation.id
      }
    } catch (error) {
      console.error('Error getting or assigning variant:', error)
      // Fallback to assigning variant without persistence for now
      return {
        variant: assignVariant(),
        isNewAssignment: true, 
        id: ""
      }
    }
  }
}

export const subscriptionService = {
  getAll: async (userId?: string): Promise<Subscription[]> => {
    const params = userId ? { user_id: userId } : {}
    const response = await api.get('/subscriptions', { params })
    return response.data
  },

  updateStatus: async (id: string, status: 'active' | 'pending_cancellation' | 'cancelled'): Promise<Subscription> => {
    const response = await api.patch('/subscriptions', { id, status })
    return response.data
  }
}

export const testService = {
  checkConnection: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.get('/test')
    return response.data
  }
}