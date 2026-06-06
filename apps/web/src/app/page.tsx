'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, ArrowUpRight, CheckCircle2 } from 'lucide-react'

type Transaction = {
  id: string
  amount: number
  currency: string
  senderName: string
  reference: string
  receivedAt: string
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        await fetchTransactions()
      }
    }
    checkAuth()
  }, [router])

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions')
      if (!res.ok) throw new Error('Failed to fetch data')
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currencyCode = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalCount = transactions.length
  const currencyCode = transactions[0]?.currency || 'NGN'

  const stats = [
    {
      title: 'Total Revenue',
      value: loading ? null : formatCurrency(totalRevenue, currencyCode),
      change: '+14.2% from last month',
      icon: ArrowUpRight,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: 'Transactions',
      value: loading ? null : totalCount.toLocaleString(),
      change: '+8.4% volume',
      icon: CreditCard,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Active Devices',
      value: loading ? null : '0',
      change: 'No active sessions',
      icon: Smartphone,
      color: 'text-slate-600 bg-slate-50',
    },
    {
      title: 'Success Rate',
      value: loading ? null : '100%',
      change: 'Optimal performance',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your payment operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, ease: 'easeOut' }}
            >
              <Card className="overflow-hidden border-slate-200/80 transition-all hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading || stat.value === null ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-28" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.change}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Transactions */}
        <Card className="border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-lg font-bold text-slate-900">Recent Transactions</CardTitle>
              <p className="text-xs text-muted-foreground">The latest incoming business settlements</p>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3 py-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full text-center" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-xl bg-slate-50/50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">No transactions yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Connect an active terminal or integration to start receiving transaction streams.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-slate-100">
                <Table>
                  <TableHeader className="bg-slate-50/70">
                    <TableRow>
                      <TableHead className="w-[180px]">Date & Time</TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 10).map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-slate-50/40 transition-colors">
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                          {new Date(tx.receivedAt).toLocaleString('en-NG', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-800">{tx.senderName}</TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {formatCurrency(tx.amount, tx.currency)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-500 select-all">{tx.reference}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50">
                            Success
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
