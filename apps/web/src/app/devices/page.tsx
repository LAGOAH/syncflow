'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Smartphone, Plus, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'

type Device = { id: string; name: string; deviceKey: string; createdAt: string }

export default function DevicesPage() {
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deviceName, setDeviceName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else fetchDevices()
    })
  }, [router])

  const fetchDevices = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    const res = await fetch('/api/devices', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setDevices(await res.json())
    setLoading(false)
  }

  const registerDevice = async () => {
    if (!deviceName.trim()) return
    setSubmitting(true)
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    const res = await fetch('/api/devices/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ deviceName })
    })
    if (res.ok) {
      setDeviceName('')
      setShowForm(false)
      fetchDevices()
    } else alert('Failed to register device')
    setSubmitting(false)
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Devices</h1>
            <p className="text-sm text-muted-foreground">Manage phones and terminals forwarding payments</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-black hover:bg-slate-800">
            <Plus className="h-4 w-4 mr-2" /> Register Device
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader><CardTitle>New Device</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Device name (e.g., Samsung A14)" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />
                <div className="flex gap-2">
                  <Button onClick={registerDevice} disabled={submitting}>{submitting ? 'Creating...' : 'Create Device Key'}</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <Card><CardContent className="py-12 text-center">Loading devices...</CardContent></Card>
        ) : devices.length === 0 ? (
          <Card><CardContent className="py-12 text-center"><Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No devices registered yet.</p><p className="text-sm text-muted-foreground mt-1">Click "Register Device" to connect a phone.</p></CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {devices.map((device) => (
              <Card key={device.id}>
                <CardHeader><CardTitle className="flex items-center justify-between"><span>{device.name}</span><span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{device.deviceKey.slice(0, 8)}...</span></CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Device Key (use in your SMS forwarder):</p>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border">
                    <code className="flex-1 text-xs font-mono break-all">{device.deviceKey}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(device.deviceKey)}>{copiedKey === device.deviceKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Created: {new Date(device.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
