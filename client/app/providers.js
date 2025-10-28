'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      {children}
    </QueryClientProvider>
  )
}
