import { auth } from "@/auth"
import QrGenerator from "@/components/qr-generator"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <section className="m-auto min-h-[calc(70vh-100px)] content-center justify-center w-full max-w-full rounded-2xl border border-zinc-200 bg-white/40 p-8 shadow-sm backdrop-blur-sm">
      <QrGenerator />
    </section>
  )
}
