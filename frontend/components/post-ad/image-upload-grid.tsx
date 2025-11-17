"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/common/shadecn-card";
import { X, Plus } from "lucide-react";

type ImageUploadGridProps = {
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
  className?: string;
  existingImages?: string[]; // ✅ NEW: For existing images from database
  onRemoveExisting?: (index: number) => void; // ✅ NEW: Callback for removing existing images
};

// Helper to create object URLs and revoke on unmount
function useObjectUrls(files: File[]) {
  const [urls, setUrls] = React.useState<string[]>([]);
  React.useEffect(() => {
    const next = files.map((f) => URL.createObjectURL(f));
    setUrls(next);
    return () => next.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);
  return urls;
}

export function ImageUploadGrid({
  files,
  onChange,
  max = 5,
  className,
  existingImages = [], // ✅ NEW: Default empty array
  onRemoveExisting, // ✅ NEW: Remove callback
}: ImageUploadGridProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const urls = useObjectUrls(files);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const list = Array.from(incoming);

    // ✅ UPDATED: Calculate total including existing images
    const totalImages = existingImages.length + files.length + list.length;

    if (totalImages > max) {
      alert(`You can only upload up to ${max} images total`);
      return;
    }

    const merged = [...files, ...list];
    onChange(merged);
  };

  const removeAt = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    onChange(next);
  };

  // ✅ NEW: Handle removing existing images
  const removeExistingAt = (idx: number) => {
    if (onRemoveExisting) {
      onRemoveExisting(idx);
    }
  };

  // ✅ NEW: Calculate total images and remaining slots
  const totalImages = existingImages.length + files.length;
  const remainingSlots = max - totalImages;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-5 gap-3 max-[500px]:grid-cols-3">
        {/* Add button tile - only show if there are remaining slots */}
        {remainingSlots > 0 && (
          <Card className="relative flex aspect-square items-center justify-center rounded-xl border-dashed p-0 transition hover:translate-y-[-2px] hover:shadow-md">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl text-sm text-muted-foreground hover:text-foreground"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <Plus className="h-5 w-5" />
              </span>
              <span>Add</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => addFiles(e.target.files)}
            />
          </Card>
        )}

        {/* ✅ NEW: Existing Images from database */}
        {existingImages.map((src, i) => (
          <Card
            key={`existing-${i}`}
            className="relative aspect-square overflow-hidden rounded-xl p-0"
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={`Existing ${i + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 20vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeExistingAt(i)}
              className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </Card>
        ))}

        {/* Previews - Newly uploaded files */}
        {urls.map((src, i) => (
          <Card
            key={`new-${i}`}
            className="relative aspect-square overflow-hidden rounded-xl p-0"
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={`Upload ${i + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 20vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </Card>
        ))}

        {/* Placeholders to keep grid size - only show empty slots */}
        {Array.from({ length: Math.max(0, remainingSlots - 1) }).map((_, i) => (
          <Card
            key={`ph-${i}`}
            className="aspect-square rounded-xl p-0 opacity-40"
          >
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Empty
            </div>
          </Card>
        ))}
      </div>

      {/* ✅ NEW: Image count info */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          For the cover picture we recommend using the landscape mode.
        </p>
        <p className="text-xs text-muted-foreground">
          {totalImages}/{max} images
        </p>
      </div>
    </div>
  );
}
