'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for a password reset link.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0B0B0B]">SyncFlow</h1>
          <p className="text-gray-500 mt-2">Reset your password</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-[#0B0B0B] mb-2">Forgot password?</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a link to reset it.</p>

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B0B0B] text-white py-2 rounded-lg hover:bg-black transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 rounded-lg text-sm text-center bg-green-50 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg text-sm text-center bg-red-50 text-red-600">
              {error}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link href="/login" className="text-[#D4AF37] hover:underline">
              ← Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
