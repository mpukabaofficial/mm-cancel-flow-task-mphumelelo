'use client'

import { useState } from 'react'
import { testService, cancellationService } from '@/lib/api'
import Button from '@/components/ui/Button'

export default function TestApiPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await testService.checkConnection()
      setResult(JSON.stringify(response, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testCreateCancellation = async () => {
    setLoading(true)
    try {
      const response = await cancellationService.create({
        subscription_id: '123e4567-e89b-12d3-a456-426614174000',
        downsell_variant: 'A',
        reason: 'Test cancellation',
        has_job: true
      })
      setResult(JSON.stringify(response, null, 2))
    } catch (error: any) {
      setResult(`Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={testConnection} disabled={loading}>
          Test Database Connection
        </Button>
        
        <Button onClick={testCreateCancellation} disabled={loading}>
          Test Create Cancellation
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      
      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}