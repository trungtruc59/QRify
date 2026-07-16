import { auth } from "@/auth"
import OptionsDropdown from "@/components/options-dropdown"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-[url(/bg.jpeg)] bg-cover bg-center text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 font-semibold tracking-tight"
          >
            <Image
              src="/logo.png"
              alt="QRify"
              width={120}
              height={60}
              className="rounded-lg"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <OptionsDropdown
              image={session.user.image}
              name={session.user.name}
              email={session.user.email}
            />
            
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex justify-center min-h-16 w-full max-w-6xl items-center gap-4 px-4 py-4 text-sm text-zinc-500 sm:px-6 dark:text-zinc-400">
          <p className="text-center text-zinc-500">© {new Date().getFullYear()} QRify. All rights reserved. Designed by NTTdev</p>
        </div>
      </footer>
    </div>
  )
}
