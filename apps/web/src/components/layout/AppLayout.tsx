'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Receipt,
  Smartphone,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Devices', href: '/devices', icon: Smartphone },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data: { user } }) => {
        setUser(user)
      })
      .finally(() => {
        setLoadingUser(false)
      })
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Brand Header */}
      <div className="px-6 py-6 border-b border-slate-50">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900">SyncFlow</span>
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-[#D4AF37] ring-1 ring-inset ring-amber-600/10">
            LIVE
          </span>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-amber-50/70 text-[#D4AF37]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {/* Premium subtle left edge tracker highlight */}
              {active && (
                <motion.div
                  layoutId="activeTracker"
                  className="absolute left-0 w-1 h-5 rounded-r-full bg-[#D4AF37]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-102", active ? "text-[#D4AF37]" : "text-slate-400 group-hover:text-slate-600")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Identity Tray & Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-white border border-slate-200/60 shadow-xs">
          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/40">
            <User className="h-4 w-4 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            {loadingUser ? (
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.email?.split('@')[0] || 'Merchant'}
                </p>
                <p className="text-xs text-slate-400 truncate font-medium">
                  {user?.email || 'no-session@syncflow.com'}
                </p>
              </>
            )}
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 w-full transition-all duration-150 cursor-pointer group"
        >
          <LogOut className="h-4.5 w-4.5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* Desktop Sidebar Layout Container */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block border-r border-slate-200/80 shadow-xs">
        <NavContent />
      </aside>

      {/* Mobile Sticky Navbar Header */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-slate-200/60 bg-white">
                <Menu className="h-5 w-5 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r border-slate-200">
              <NavContent />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">SyncFlow</span>
            <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-[#D4AF37] ring-1 ring-inset ring-amber-600/10">
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Application Main Layout Stream */}
      <main className="lg:pl-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
