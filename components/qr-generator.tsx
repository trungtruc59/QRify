"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import QRCodeStyling, { type DotType } from "qr-code-styling"

const PREVIEW_SIZE = 180

const QR_STYLES: { value: DotType; label: string }[] = [
  { value: "square", label: "Vuông" },
  { value: "dots", label: "Chấm tròn" },
  { value: "rounded", label: "Bo góc" },
  { value: "extra-rounded", label: "Bo góc nhiều" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy bo góc" },
]

function normalizeUrl(value: string) {
  const trimmedValue = value.trim()
  const urlValue = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`
  const url = new URL(urlValue)

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Unsupported protocol")
  }

  return url.toString()
}

function createQrCode(options: {
  data: string
  size: number
  color: string
  style: DotType
}) {
  return new QRCodeStyling({
    width: options.size,
    height: options.size,
    type: "canvas",
    data: options.data,
    margin: 8,
    qrOptions: {
      errorCorrectionLevel: "H",
    },
    dotsOptions: {
      color: options.color,
      type: options.style,
    },
    cornersSquareOptions: {
      type: options.style === "dots" ? "dot" : "square",
      color: options.color,
    },
    cornersDotOptions: {
      type: options.style === "dots" ? "dot" : "square",
      color: options.color,
    },
    backgroundOptions: {
      color: "#ffffff",
    },
  })
}

export default function QrGenerator() {
  const [url, setUrl] = useState("")
  const [qrValue, setQrValue] = useState("")
  const [error, setError] = useState("")
  const [downloadSize, setDownloadSize] = useState<250 | 500>(250)
  const [qrColor, setQrColor] = useState("#000000")
  const [colorInput, setColorInput] = useState("#000000")
  const [qrStyle, setQrStyle] = useState<DotType>("square")
  const previewRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    if (!qrValue || !previewRef.current) return

    if (!qrCodeRef.current) {
      qrCodeRef.current = createQrCode({
        data: qrValue,
        size: PREVIEW_SIZE,
        color: qrColor,
        style: qrStyle,
      })
      previewRef.current.innerHTML = ""
      qrCodeRef.current.append(previewRef.current)
      return
    }

    qrCodeRef.current.update({
      data: qrValue,
      width: PREVIEW_SIZE,
      height: PREVIEW_SIZE,
      dotsOptions: {
        color: qrColor,
        type: qrStyle,
      },
      cornersSquareOptions: {
        type: qrStyle === "dots" ? "dot" : "square",
        color: qrColor,
      },
      cornersDotOptions: {
        type: qrStyle === "dots" ? "dot" : "square",
        color: qrColor,
      },
    })
  }, [qrValue, qrColor, qrStyle])

  function renderQrCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const normalizedUrl = normalizeUrl(url)
      setQrValue(normalizedUrl)
      setError("")
    } catch {
      setQrValue("")
      setError("Vui lòng nhập một đường dẫn hợp lệ.")
    }
  }

  function updateQrColor(value: string) {
    const normalizedValue = value.startsWith("#") ? value : `#${value}`
    const uppercaseValue = normalizedValue.toUpperCase()

    setColorInput(uppercaseValue)
    if (/^#[0-9A-F]{6}$/.test(uppercaseValue)) {
      setQrColor(uppercaseValue)
    }
  }

  async function downloadQrCode() {
    if (!qrValue) return

    const downloadQr = createQrCode({
      data: qrValue,
      size: downloadSize,
      color: qrColor,
      style: qrStyle,
    })

    await downloadQr.download({
      name: `qrify-qrcode-${qrStyle}-${downloadSize}px`,
      extension: "png",
    })
  }

  return (
    <div className="grid w-full gap-8 lg:grid-cols-[2fr_1fr]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Trình tạo mã QR
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Tạo mã QR cho sản phẩm, dịch vụ hoặc trang web của bạn.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={renderQrCode}>
          <div className="flex flex-col gap-2">
            <label htmlFor="url" className="text-sm font-medium text-zinc-800">
              URL trang web
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              required
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "url-error" : undefined}
              className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-950 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
            {error ? (
              <p id="url-error" className="text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex flex-row gap-2 justify-between">
            <div className="flex flex-col gap-2 w-[45%]" >
              <label
                htmlFor="qr-style"
                className="text-sm font-medium text-zinc-800"
              >
                Kiểu mã QR
              </label>
              <select
                id="qr-style"
                value={qrStyle}
                onChange={(event) => setQrStyle(event.target.value as DotType)}
                className="h-11 rounded-md border-r-8 border-r-white bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-white focus:ring-2 focus:ring-zinc-200"
              >
                {QR_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 w-[50%]">
              <label
                htmlFor="qr-color"
                className="text-sm font-medium text-zinc-800"
              >
                Màu mã QR
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={qrColor}
                  onChange={(event) => updateQrColor(event.target.value)}
                  aria-label="Chọn màu mã QR"
                  className="h-11 w-14 cursor-pointer rounded-md border border-zinc-300 bg-white p-1"
                />
                <input
                  type="text"
                  id="qr-color"
                  value={colorInput}
                  onChange={(event) => updateQrColor(event.target.value)}
                  onBlur={() => setColorInput(qrColor)}
                  maxLength={7}
                  pattern="#[0-9A-Fa-f]{6}"
                  placeholder="#000000"
                  className="h-11 flex-1 rounded-md border border-zinc-300 bg-white px-3 font-mono text-sm uppercase text-zinc-950 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-950 p-3 font-medium text-white transition hover:bg-zinc-800"
          >
            Tạo mã QR
          </button>
        </form>
      </div>

      <aside className="flex min-h-72 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white/70 p-6">
        {qrValue ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div
                ref={previewRef}
                className="flex size-[150px] items-center justify-center overflow-hidden"
              />
            </div>
            <p className="max-w-128 break-all text-sm text-zinc-600">
              {qrValue}
            </p>
            <div className="flex w-full gap-2">
              <label htmlFor="download-size" className="sr-only">
                Kích thước tải xuống
              </label>
              <select
                id="download-size"
                value={downloadSize}
                onChange={(event) =>
                  setDownloadSize(Number(event.target.value) as 250 | 500)
                }
                className="rounded-md border border-r-5 border-r-white border-zinc-50 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-300"
              >
                <option value={250}>250×250 px</option>
                <option value={500}>500×500 px</option>
              </select>
              <button
                type="button"
                onClick={downloadQrCode}
                className="flex-1 rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Tải xuống
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-zinc-500">
            <p className="font-medium">Mã QR sẽ hiển thị tại đây</p>
            <p className="mt-1 text-sm">Nhập URL và nhấn “Tạo mã QR”.</p>
          </div>
        )}
      </aside>
    </div>
  )
}
