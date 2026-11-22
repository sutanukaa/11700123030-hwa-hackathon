import './globals.css'
import { Fredoka, DM_Sans } from 'next/font/google'
import { CustomCursor } from '@/components/ui/CustomCursor'

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
      <body className="font-body">
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}