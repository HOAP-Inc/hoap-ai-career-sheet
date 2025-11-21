import type { Metadata } from 'next'
import '../src/index.css'

export const metadata: Metadata = {
  title: 'HOAP キャリアシート',
  description: 'HOAP キャリアシート管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

