import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import '@/lib/polyfills'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Resume ZK',
  description: 'Zero-Knowledge Resume Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}