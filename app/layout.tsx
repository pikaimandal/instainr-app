import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import MiniKitProvider from "@/providers/minikit-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InstaINR - Convert Worldcoin to INR",
  description: "Instantly convert your Worldcoin tokens to INR",
    generator: 'InstaINR Pvt Ltd'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light">
          <MiniKitProvider>
            {children}
          </MiniKitProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
