import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ripcord — pull the ripcord. grab any stream. done.',
  description: 'Download videos and audio from YouTube, X/Twitter, Instagram, TikTok, Threads, and 1800+ sites.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#18181b] text-white selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  )
}
