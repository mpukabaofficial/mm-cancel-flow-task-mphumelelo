export interface User {
  id: string
  email: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  monthly_price: number
  status: 'active' | 'pending_cancellation' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Cancellation {
  id: string
  user_id: string
  subscription_id: string
  downsell_variant: 'A' | 'B'
  reason?: string
  accepted_downsell: boolean
  has_job?: boolean
  created_at: string
}

export interface CreateCancellationRequest {
  subscription_id: string
  downsell_variant: 'A' | 'B'
  reason?: string
  has_job?: boolean
}

export interface UpdateCancellationRequest {
  accepted_downsell?: boolean
  reason?: string
  has_job?: boolean
}