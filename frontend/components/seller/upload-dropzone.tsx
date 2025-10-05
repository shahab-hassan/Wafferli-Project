"use client"

import type React from "react"
import { useCallback, useMemo, useState } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

export function UploadDropzone({
  onFiles,
  multiple = true,
  large = false,
  className,
}: {
  onFiles: (files: File[]) => void
  multiple?: boolean
  large?: boolean
  className?: string
}) {
  const [previews, setPreviews] = useState<string[]>([])
  const height = large ? "h-28 sm:h-36 md:h-40" : "h-20"

  const handleFiles = useCallback(
    (files: FileList) => {
      const arr = Array.from(files)
      onFiles(arr)
      const urls = arr.slice(0, 3).map((f) => URL.createObjectURL(f))
      setPreviews(urls)
    },
    [onFiles],
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const previewsEl = useMemo(
    () =>
      previews.length > 0 && (
        <div className="mt-2 flex gap-2">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src || "/placeholder.svg"}
              alt={`preview ${i + 1}`}
              className="h-12 w-12 rounded-md object-cover"
              crossOrigin="anonymous"
            />
          ))}
        </div>
      ),
    [previews],
  )

  const inputId = "upload-input"

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-[16px] border border-dashed border-border bg-[var(--brand-surface)] px-4 text-center cursor-pointer",
        height,
        className,
      )}
    >
      <Upload className="h-5 w-5 text-[var(--brand-ink)] opacity-70" />
      {/* label is clickable and linked to input */}
      <label
        htmlFor={inputId}
        className="mt-1 text-sm text-[color-mix(in oklab, var(--brand-ink) 55%, white)] cursor-pointer"
      >
        Click to Upload
      </label>
      <input
        id={inputId}
        type="file"
        multiple={multiple}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="sr-only"
        aria-label="Upload images"
      />
      {previewsEl}
    </div>
  )
}
