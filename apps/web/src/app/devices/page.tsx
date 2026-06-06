'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Smartphone, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DevicesPage() {
  const router = useRouter()
  const [devices, setDevices] = useState([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else fetchDevices()
    })
  }, [router])

  const fetchDevices = async () => {
    // Placeholder – you'll implement device registration later
    setDevices([])
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Devices</h1>
            <p className="text-sm text-muted-foreground">Manage phones and terminals forwarding payments</p>
          </div>
          <Button className="bg-[#0B0B0B] hover:bg-black">
            <Plus className="h-4 w-4 mr-2" />
            Register Device
          </Button>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No devices registered yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Register Device" to connect a phone.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
