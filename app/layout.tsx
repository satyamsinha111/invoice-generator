import type { Metadata } from 'next'
import './globals.css'
import { InvoiceProvider } from '@/contexts/InvoiceContext'

export const metadata: Metadata = {
  title: 'Invoice Generator - Professional Invoicing Made Simple',
  description: 'Create, preview, and download professional invoices with ease. Manual invoice generator with live preview and PDF export.',
  keywords: 'invoice, generator, pdf, accounting, business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <InvoiceProvider>
          {children}
        </InvoiceProvider>
      </body>
    </html>
  )
}


