'use client'

import { useState } from 'react'
import { cancellationService } from '@/lib/cancellationService'
import { assignVariant, VARIANT_CONFIG } from '@/lib/variant'
import Button from '@/components/ui/Button'

export default function TestVariantPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const testSecureRNG = () => {
    const variants = []
    for (let i = 0; i < 100; i++) {
      variants.push(assignVariant())
    }
    
    const aCount = variants.filter(v => v === 'A').length
    const bCount = variants.filter(v => v === 'B').length
    
    setResults(prev => [...prev, 
      `Secure RNG Test (100 iterations):`,
      `Variant A: ${aCount}% | Variant B: ${bCount}%`,
      `Distribution: ${Math.abs(50 - aCount) <= 10 ? 'GOOD' : 'POOR'} (should be ~50/50)`
    ])
  }

  const testPersistence = async () => {
    setLoading(true)
    const testUserId = 'test-user-' + Date.now()
    const testSubscriptionId = 'test-sub-' + Date.now()
    
    try {
      // First assignment
      const result1 = await cancellationService.getOrAssignVariant(testUserId, testSubscriptionId)
      
      // Second call - should return same variant
      const result2 = await cancellationService.getOrAssignVariant(testUserId, testSubscriptionId)
      
      setResults(prev => [...prev,
        `Persistence Test:`,
        `First call: Variant ${result1.variant} (new: ${result1.isNewAssignment})`,
        `Second call: Variant ${result2.variant} (new: ${result2.isNewAssignment})`,
        `Persistence: ${result1.variant === result2.variant && !result2.isNewAssignment ? 'PASS ✅' : 'FAIL ❌'}`
      ])
    } catch (error) {
      setResults(prev => [...prev, `Error: ${error}`])
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">A/B Variant Testing</h1>
      
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">Variant A</h3>
            <p className="text-sm text-blue-600">{VARIANT_CONFIG.A.description}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800">Variant B</h3>
            <p className="text-sm text-green-600">{VARIANT_CONFIG.B.description}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button onClick={testSecureRNG} disabled={loading}>
            Test Secure RNG Distribution
          </Button>
          
          <Button onClick={testPersistence} disabled={loading}>
            Test Variant Persistence
          </Button>
          
          <Button onClick={clearResults} disabled={loading}>
            Clear Results
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Testing...</p>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Test Results:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
            {results.join('\n')}
          </pre>
        </div>
      )}
    </div>
  )
}