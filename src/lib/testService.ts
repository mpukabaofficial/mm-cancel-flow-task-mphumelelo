import axios from 'axios'

// HTTP Client for frontend API calls
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// =====================
// TEST SERVICE
// =====================
export const testService = {
  checkConnection: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.get('/test')
    return response.data
  }
}