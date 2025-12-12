'use client'

import { ConfigProvider, theme as antdTheme } from 'antd'
import { useTheme } from '@/lib/theme-context'

export function ThemeConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme === 'dark' ? '#bb86fc' : '#9929EA',
          colorInfo: theme === 'dark' ? '#60a5fa' : '#9929EA',
          colorSuccess: theme === 'dark' ? '#4ade80' : '#00AA6C',
          colorWarning: theme === 'dark' ? '#fbbf24' : '#FAEB92',
          colorError: theme === 'dark' ? '#f87171' : '#ff4d4f',
          borderRadius: 8,
          colorBgContainer: theme === 'dark' ? '#18181b' : '#ffffff',
          colorText: theme === 'dark' ? '#fafafa' : '#111827',
          colorTextSecondary: theme === 'dark' ? '#e4e4e7' : '#4b5563',
          colorBorder: theme === 'dark' ? '#27272a' : '#e5e7eb',
        },
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  )
}
