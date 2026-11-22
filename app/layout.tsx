import './globals.css'
import type { Metadata } from 'next'
import { Fredoka, DM_Sans } from 'next/font/google'
import { CustomCursor } from '@/components/ui/CustomCursor'

export const metadata: Metadata = {
  title: 'CANOPY — A little space to be a dog.',
  description:
    'A thoughtfully designed little world that brings a cosy retreat and playful discovery together.',
  icons: {
    icon: '/cursor-pointer.png',
    shortcut: '/cursor-pointer.png',
    apple: '/cursor-pointer.png',
  },
}

const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/cursor-pointer.png" type="image/png" />
        <link rel="shortcut icon" href="/cursor-pointer.png" />
        <link rel="apple-touch-icon" href="/cursor-pointer.png" />
      </head>
      <body className="font-body">
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}