'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { ThemeToggle } from '../../components/theme-toggle'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { getUserQuery } from '../../lib/utils/mutations'
import socketClient from '../../lib/socket'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { data: user, isLoading, isError } = useQuery(getUserQuery())
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      localStorage.removeItem('token')
      router.push('/')
    }
  }, [isLoading, isError, user, router])

  const handleLogout = () => {
    socketClient.disconnectSocket()
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    localStorage.removeItem('token')
    setIsLogoutDialogOpen(false)
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (isError || !user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <h2 className="text-lg font-semibold">KANBAN Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name || user.email}</span>
            <ThemeToggle />
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(true)}>
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {children}
    </div>
  )
}
