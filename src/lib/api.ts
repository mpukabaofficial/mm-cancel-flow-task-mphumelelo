import axios from 'axios'
import { 
  Cancellation, 
  CreateCancellationRequest, 
  UpdateCancellationRequest,
  Subscription 
} from './types'

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