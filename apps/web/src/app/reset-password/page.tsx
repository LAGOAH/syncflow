'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get the access token from the URL hash (Supabase sends it after email click)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    if (accessToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: '' })
    }
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated successfully! Redirecting...')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0B0B0B]">SyncFlow</h1>
          <p className="text-gray-500 mt-2">Set new password</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-[#0B0B0B] mb-2">Create new password</h2>
          <p className="text-gray-500 text-sm mb-6">Your new password must be different from previous ones.</p>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B0B0B] text-white py-2 rounded-lg hover:bg-black transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
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
        </div>
      </div>
    </div>
  )
}
