import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const session = await auth()
  const { callbackUrl } = await searchParams

  if (session) redirect(callbackUrl ?? "/dashboard")

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-linear-to-r/decreasing from-indigo-500 to-teal-400 px-4">
      <main className="w-full max-w-sm flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 shadow-md dark:bg-zinc-50">
        <Image className="inline-block" src="/logo.png" alt="QRify Logo" width={100} height={100} />
        <form
          className="mt-4"
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: callbackUrl ?? "/dashboard" })
          }}
        >
          <button
            type="submit"
            className="flex h-11 w-full items-center rounded-full bg-foreground px-5 text-[15px] font-medium text-background transition duration-500 ease-in-out hover:shadow-sm hover:translate-y-[-5px] border border-zinc-200 cursor-pointer"
          >
            <Image className="mr-2" src="/google.png" alt="Google Logo" width={30} height={30} />
            Sign in with Google
          </button>
        </form>
      </main>
    </div>
  )
}
