'use client'

import { UserProvider } from '@/contexts/UserContext'

interface UserProviderWrapperProps {
  children: React.ReactNode
}

export default function UserProviderWrapper({ children }: UserProviderWrapperProps) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  )
}