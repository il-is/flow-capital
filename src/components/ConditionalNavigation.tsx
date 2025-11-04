'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()
  
  // Не показываем Navigation на страницах логина и дашборда
  const showNavigation = !pathname.startsWith('/login') && !pathname.startsWith('/dashboard')

  if (!showNavigation) {
    return null
  }

  return <Navigation />
}

