'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    let result
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password })
      if (!result.error) setMessage('Check your email to confirm your account.')
    } else {
      result = await supabase.auth.signInWithPassword({ email, password })
      if (!result.error) router.push('/')
    }

    if (result.error) setMessage(result.error.message)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0B0B0B]">SyncFlow</h1>
          <p className="text-gray-500 mt-2">Payment Operations Dashboard</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-[#0B0B0B] mb-6">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-[#D4AF37] hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0B0B0B] text-white py-2 rounded-lg hover:bg-black transition-colors font-medium"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-1 text-[#D4AF37] hover:underline font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          {message && (
            <div className="mt-4 p-3 rounded-lg text-sm text-center bg-gray-50 text-gray-700">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
