'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import socketClient from '../lib/socket'

const queryClient = new QueryClient()

export function Providers({ children }) {
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      socketClient.initSocket(token)
    } else {
      socketClient.disconnectSocket()
    }

    return () => {
      socketClient.disconnectSocket()
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {children}
    </QueryClientProvider>
  )
}
