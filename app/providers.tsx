'use client'

import { DesktopProvider } from '../src/context/DesktopContext'
import { ThemeProvider } from '../src/context/ThemeContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DesktopProvider>{children}</DesktopProvider>
    </ThemeProvider>
  )
}
