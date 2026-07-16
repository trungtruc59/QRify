"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import SignOutButton from "@/components/sign-out-button"

type OptionsDropdownProps = {
  image?: string | null
  name?: string | null
  email?: string | null
}

export default function OptionsDropdown({
  image,
  name,
  email,
}: OptionsDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Mở menu tài khoản"
        onClick={() => setOpen((value) => !value)}
        className="flex size-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-transparent transition hover:ring-zinc-300 focus-visible:outline-none focus-visible:ring-zinc-400"
      >
        {image ? (
          <Image
            src={image}
            alt={`Ảnh đại diện của ${name ?? "người dùng"}`}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
            {(name ?? email ?? "U").charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {name ?? "Người dùng"}
            </p>
            {email ? (
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {email}
              </p>
            ) : null}
          </div>
          <SignOutButton />
        </div>
      ) : null}
    </div>
  )
}
