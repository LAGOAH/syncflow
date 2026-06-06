'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Transaction = {
  id: string
  amount: number
  currency: string
  senderName: string
  reference: string
  receivedAt: string
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchTransactions()
      }
    })
  }, [router])

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalCount = transactions.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#0B0B0B]">SyncFlow</span>
              <span className="text-[#D4AF37] text-xs font-medium">LIVE</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-[#0B0B0B] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Today's Revenue</p>
            <p className="text-3xl font-bold text-[#0B0B0B] mt-1">₦{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-3xl font-bold text-[#0B0B0B] mt-1">{totalCount}</p>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#0B0B0B]">Recent Payments</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No transactions yet.</p>
              <p className="text-sm mt-2">Payments will appear here when your webhook receives SMS.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="px-6 py-3 text-left">Time</th>
                    <th className="px-6 py-3 text-left">Sender</th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {new Date(tx.receivedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-[#0B0B0B]">
                        {tx.senderName}
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-[#0B0B0B]">
                        ₦{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500 font-mono">
                        {tx.reference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
