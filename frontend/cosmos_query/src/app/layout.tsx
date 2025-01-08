// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'CosmosQuery: NASA Data Explorer',
  description: 'Explore the cosmos through our intelligent search engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mono.variable} min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}