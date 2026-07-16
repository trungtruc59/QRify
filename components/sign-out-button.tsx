import { signOutAction } from "@/app/actions/auth"

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="block w-full px-4 py-2 text-left text-sm text-zinc-700 transition-colors hover:text-zinc-100 dark:text-zinc-300 dark:hover:text-red-700 cursor-pointer"
      >
        Sign out
      </button>
    </form>
  )
}
