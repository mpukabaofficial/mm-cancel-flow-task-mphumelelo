'use client'

import { useUser } from '@/contexts/UserContext'
import { useCancellationFlow } from '@/hooks/useCancellationFlow'
import Button from '@/components/ui/Button'

export default function TestStorePage() {
  const { user, subscription, isLoading, error, updateSubscriptionStatus } = useUser()
  
  const {
    variant,
    cancellationId,
    loading: flowLoading,
    getOrAssignVariant,
    updateCancellation,
    markSubscriptionForCancellation
  } = useCancellationFlow()

  const handleTestVariantAssignment = async () => {
    try {
      const result = await getOrAssignVariant()
      console.log('Variant assignment result:', result)
    } catch (error) {
      console.error('Variant assignment failed:', error)
    }
  }

  const handleTestCancellationUpdate = async () => {
    try {
      await updateCancellation({
        has_job: true,
        reason: 'Found a job through the platform'
      })
      console.log('Cancellation updated successfully')
    } catch (error) {
      console.error('Cancellation update failed:', error)
    }
  }

  const handleMarkForCancellation = async () => {
    try {
      await markSubscriptionForCancellation()
      console.log('Subscription marked for cancellation')
    } catch (error) {
      console.error('Failed to mark subscription for cancellation:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user store...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Context Testing</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Data */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">User Data</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ) : (
            <p className="text-gray-500">No user data</p>
          )}
        </div>

        {/* Subscription Data */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Subscription Data</h2>
          {subscription ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {subscription.id}</p>
              <p><strong>Price:</strong> ${subscription.monthly_price}/month</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                  subscription.status === 'pending_cancellation' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {subscription.status}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No subscription data</p>
          )}
        </div>
      </div>

      {/* Cancellation Flow Data */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Cancellation Flow State</h2>
        <div className="space-y-2">
          <p><strong>Variant:</strong> {variant || 'Not assigned'}</p>
          <p><strong>Cancellation ID:</strong> {cancellationId || 'None'}</p>
          <p><strong>Flow Loading:</strong> {flowLoading ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Store Actions */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Store Actions</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => window.location.reload()} disabled={isLoading}>
              Re-initialize User
            </Button>
            
            <Button 
              onClick={() => updateSubscriptionStatus('pending_cancellation')}
              disabled={!subscription}
            >
              Mark Pending Cancellation
            </Button>

            <Button 
              onClick={() => updateSubscriptionStatus('active')}
              disabled={!subscription}
            >
              Mark Active
            </Button>

            <Button onClick={() => console.log('Clear user functionality removed')}>
              Clear User (Demo)
            </Button>
          </div>
        </div>
      </div>

      {/* Cancellation Flow Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Cancellation Flow Actions</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleTestVariantAssignment}
              disabled={flowLoading || !user || !subscription}
            >
              Get/Assign Variant
            </Button>

            <Button 
              onClick={handleTestCancellationUpdate}
              disabled={flowLoading || !cancellationId}
            >
              Update Cancellation
            </Button>

            <Button 
              onClick={handleMarkForCancellation}
              disabled={flowLoading || !subscription}
            >
              Mark for Cancellation
            </Button>
          </div>

          {flowLoading && (
            <div className="text-center py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          )}
        </div>
      </div>

      {/* Developer Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Context Features:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Simple React Context</li>
          <li>✅ Type-safe hooks</li>
          <li>✅ Error handling</li>
          <li>✅ Loading states</li>
          <li>✅ Cancellation flow integration</li>
          <li>✅ No SSR hydration issues</li>
        </ul>
      </div>
    </div>
  )
}