"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Инициализируем планировщик саммери при запуске приложения
    const initScheduler = async () => {
      try {
        const response = await fetch('/api/init-scheduler');
        if (response.ok) {
          console.log('✅ Summary scheduler initialized');
        } else {
          console.warn('⚠️ Failed to initialize scheduler');
        }
      } catch (error) {
        console.warn('⚠️ Could not initialize scheduler:', error);
      }
    };

    initScheduler();
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
