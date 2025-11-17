"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setSellerData } from "@/features/slicer/SellerSlice";

export function UploadDropzone({
  onFiles,
  multiple = true,
  large = false,
  className,
  type = "gallery", // differentiate
}: {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  large?: boolean;
  className?: string;
  type?: "gallery" | "logo";
}) {
  const [previews, setPreviews] = useState<string[]>([]);
  const height = large ? "h-28 sm:h-36 md:h-40" : "h-20";
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const sellerData = useSelector((state: any) => state.seller.sellerData);

  // ✅ Restore logo or gallery previews
  useEffect(() => {
    if (type === "logo" && sellerData?.logoPreview) {
      setPreviews([sellerData.logoPreview]);
    }
    if (type === "gallery" && sellerData?.galleryPreviews?.length) {
      setPreviews(sellerData.galleryPreviews);
    }
  }, [sellerData, type]);

  const handleFiles = useCallback(
    (files: FileList) => {
      let arr = Array.from(files);

      // ✅ Limit files: logo=1, gallery=5
      if (type === "logo") arr = arr.slice(0, 1);
      if (type === "gallery") arr = arr.slice(0, 5);

      onFiles(arr);

      const urls = arr.map((f) => URL.createObjectURL(f));
      setPreviews(urls);
    },
    [onFiles, type]
  );

  const removePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviews([]);
    onFiles([]);

    // ✅ Redux reset
    if (type === "logo") {
      dispatch(setSellerData({ logo: null, logoPreview: null }));
    } else {
      dispatch(setSellerData({ gallery: [], galleryPreviews: [] }));
    }
  };

  const openFileDialog = () => inputRef.current?.click();

  const previewsEl = useMemo(
    () =>
      previews.length > 0 && (
        <div className="relative flex justify-center mt-3 mb-4">
          {previews.map((src, i) => (
            <div key={i} className="relative group mx-1">
              <img
                src={src}
                alt="preview"
                className={`${
                  type === "logo"
                    ? "h-20 w-20 rounded-full"
                    : "h-16 w-16 rounded-md"
                } object-cover border shadow-sm transition-all group-hover:opacity-90`}
              />
              <button
                onClick={removePreview}
                className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full p-1 hover:opacity-100 opacity-100 transition"
                title="Remove"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      ),
    [previews, removePreview, type]
  );

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
      }}
      onClick={openFileDialog}
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-[16px] border border-dashed border-border bg-[var(--brand-surface)] px-4 text-center cursor-pointer hover:bg-[color-mix(in oklab, var(--brand-surface) 85%, white)] transition py-4",
        height,
        className
      )}
    >
      {previews.length === 0 && (
        <>
          <Upload className="h-6 w-6 text-[var(--brand-ink)] opacity-70" />
          <p className="mt-1 text-sm text-[color-mix(in oklab, var(--brand-ink) 55%, white)]">
            Click or Drop to Upload {type === "logo" ? "Logo" : "Images"}{" "}
            {type === "gallery" ? "(max 5)" : "(1 only)"}
          </p>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".png, .jpg, .jpeg"
        multiple={multiple && type !== "logo"}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="sr-only"
      />

      {previewsEl}
    </div>
  );
}
