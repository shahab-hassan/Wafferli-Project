"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/common/shadecn-card";
import type { PostType } from "@/types/post-ad";
import { MapPin, Tag, ShoppingCart, Wrench, PartyPopper } from "lucide-react";

type Item = {
  key: PostType;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const ITEMS: Item[] = [
  { key: "explore", label: "Explore", Icon: MapPin },
  { key: "offer", label: "Offer", Icon: Tag },
  { key: "product", label: "Product", Icon: ShoppingCart },
  { key: "service", label: "Service", Icon: Wrench },
  { key: "event", label: "Event", Icon: PartyPopper },
];

type TypeSelectorProps = {
  value?: PostType | null;
  onChange?: (value: PostType) => void;
  className?: string;
  selectedType?: PostType | null; // 👈 for edit mode
};

export function TypeSelector({
  value,
  onChange,
  className,
  selectedType,
}: TypeSelectorProps) {
  const isEditMode = !!selectedType; // agar selectedType aya to edit mode hai
  const currentValue = isEditMode ? selectedType : value;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
        className
      )}
    >
      {ITEMS.map(({ key, label, Icon }) => {
        const selected = currentValue === key;
        const disabled = isEditMode && !selected; // edit mode me bas selected hi clickable hoga

        return (
          <button
            key={key}
            type="button"
            onClick={() => !disabled && onChange?.(key)} // agar disabled nahi hai tabhi click chale
            className={cn(
              "group rounded-xl focus:outline-none transition-all",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-pressed={selected}
            disabled={disabled}
          >
            <Card
              className={cn(
                "flex h-full w-full items-center gap-3 rounded-xl border bg-card p-4 transition-all",
                "hover:translate-y-[-2px] hover:shadow-md",
                selected
                  ? "ring-2 ring-primary"
                  : "hover:ring-1 hover:ring-muted-foreground/20"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  selected
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  selected ? "text-foreground" : "text-foreground"
                )}
              >
                {label}
              </span>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
