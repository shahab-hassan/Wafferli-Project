"use client"

import React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.ComponentProps<"input">, "type" | "defaultChecked"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({ className, checked, onCheckedChange, onChange, disabled, ...props }: CheckboxProps) {
  const [internalChecked, setInternalChecked] = React.useState(false)

  const isControlled = checked !== undefined
  const checkedValue = isControlled ? checked : internalChecked

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked

    if (!isControlled) {
      setInternalChecked(newChecked)
    }

    onCheckedChange?.(newChecked)
    onChange?.(event)
  }

  return (
    <div className="relative inline-flex">
      <input
        type="checkbox"
        checked={checkedValue}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        data-slot="checkbox"
        data-state={checkedValue ? "checked" : "unchecked"}
        className={cn(
          "peer !border-grey-4 !border-2 data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        onClick={() =>
          !disabled && handleChange({ target: { checked: !checkedValue } } as React.ChangeEvent<HTMLInputElement>)
        }
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !disabled) {
            e.preventDefault()
            handleChange({ target: { checked: !checkedValue } } as React.ChangeEvent<HTMLInputElement>)
          }
        }}
        tabIndex={disabled ? -1 : 0}
        role="checkbox"
        aria-checked={checkedValue}
        aria-disabled={disabled}
      >
        {checkedValue && (
          <div data-slot="checkbox-indicator" className="flex items-center justify-center text-current transition-none">
            <CheckIcon className="size-3.5" />
          </div>
        )}
      </div>
    </div>
  )
}

export { Checkbox }
