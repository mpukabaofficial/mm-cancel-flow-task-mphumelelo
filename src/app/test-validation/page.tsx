'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function TestValidationPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const testValidation = async (testName: string, url: string, method: string, body?: Record<string, unknown>) => {
    setLoading(true)
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url, options)
      const data = await response.json()
      
      setResults(prev => [...prev, 
        `${testName}:`,
        `Status: ${response.status}`,
        `Response: ${JSON.stringify(data, null, 2)}`,
        '---'
      ])
    } catch (error) {
      setResults(prev => [...prev, 
        `${testName}:`,
        `Error: ${error}`,
        '---'
      ])
    } finally {
      setLoading(false)
    }
  }

  const runValidationTests = async () => {
    setResults([])

    // Test 1: Valid cancellation creation
    await testValidation(
      'Valid Cancellation Creation',
      '/api/cancellations',
      'POST',
      {
        subscription_id: '873d5e15-cbbc-4bf5-8b90-45c56c51ab43',
        downsell_variant: 'A',
        reason: 'Found a job',
        has_job: true
      }
    )

    // Test 2: Invalid downsell variant
    await testValidation(
      'Invalid Downsell Variant',
      '/api/cancellations',
      'POST',
      {
        subscription_id: '873d5e15-cbbc-4bf5-8b90-45c56c51ab43',
        downsell_variant: 'C', // Invalid
        reason: 'Test'
      }
    )

    // Test 3: Invalid UUID format
    await testValidation(
      'Invalid UUID Format',
      '/api/cancellations',
      'POST',
      {
        subscription_id: 'invalid-uuid',
        downsell_variant: 'A'
      }
    )

    // Test 4: Reason too long
    await testValidation(
      'Reason Too Long',
      '/api/cancellations',
      'POST',
      {
        subscription_id: '873d5e15-cbbc-4bf5-8b90-45c56c51ab43',
        downsell_variant: 'B',
        reason: 'A'.repeat(501) // Over 500 character limit
      }
    )

    // Test 5: Extra fields (should be rejected due to .strict())
    await testValidation(
      'Extra Fields',
      '/api/cancellations',
      'POST',
      {
        subscription_id: '873d5e15-cbbc-4bf5-8b90-45c56c51ab43',
        downsell_variant: 'A',
        extraField: 'should not be allowed'
      }
    )

    // Test 6: Valid subscription update
    await testValidation(
      'Valid Subscription Update',
      '/api/subscriptions',
      'PATCH',
      {
        id: '873d5e15-cbbc-4bf5-8b90-45c56c51ab43',
        status: 'pending_cancellation'
      }
    )

    // Test 7: Invalid subscription status
    await testValidation(
      'Invalid Subscription Status',
      '/api/subscriptions',
      'PATCH',
      {
        id: '873d5e15-cbbc-4bf5-8b90-45c56c51ab43',
        status: 'invalid_status'
      }
    )
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Zod Validation Testing</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={runValidationTests} disabled={loading}>
          Run Validation Tests
        </Button>
        
        <Button onClick={clearResults} disabled={loading}>
          Clear Results
        </Button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Testing validation...</p>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Validation Test Results:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap max-h-96">
            {results.join('\n')}
          </pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">What&apos;s being tested:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Valid cancellation creation with proper types</li>
          <li>❌ Invalid downsell variant (only A/B allowed)</li>
          <li>❌ Invalid UUID format validation</li>
          <li>❌ String length limits (reason max 500 chars)</li>
          <li>❌ Extra fields rejection (.strict() schema)</li>
          <li>✅ Valid subscription status updates</li>
          <li>❌ Invalid subscription status values</li>
        </ul>
      </div>
    </div>
  )
}