"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "./label"
import { cn } from "@/lib/utils"

interface RadioOption {
  value: string
  labelKey: string       // 🔑 translation key
  descriptionKey?: string // 🔑 translation key
  disabled?: boolean
}

interface EnhancedRadioProps {
  labelKey?: string
  descriptionKey?: string
  options: RadioOption[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  className?: string
  orientation?: "vertical" | "horizontal"
}

const EnhancedRadio = React.forwardRef<React.ElementRef<typeof RadioGroup>, EnhancedRadioProps>(
  (
    {
      labelKey,
      descriptionKey,
      options,
      value,
      onValueChange,
      disabled = false,
      required = false,
      className,
      orientation = "vertical",
      ...props
    },
    ref,
  ) => {
    const id = React.useId()
    const t = useTranslations("Radio") // 👈 use namespace e.g. "Radio"

    return (
      <div className={cn("space-y-2", className)}>
        {labelKey && (
          <Label htmlFor={id} className={cn("text-sm font-medium", disabled && "opacity-50 cursor-not-allowed")}>
            {t(labelKey)}
            {required && <span className="text-failure ml-1">*</span>}
          </Label>
        )}

        {descriptionKey && (
          <p className={cn("text-sm text-muted-foreground", disabled && "opacity-50")}>
            {t(descriptionKey)}
          </p>
        )}

        <RadioGroup
          ref={ref}
          id={id}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          className={cn(orientation === "horizontal" ? "flex flex-wrap gap-6" : "grid gap-3")}
          {...props}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center gap-2"> 
              {/* ✅ use gap instead of space-x for RTL support */}
              <RadioGroupItem
                value={option.value}
                disabled={disabled || option.disabled}
                className={cn(option.disabled && "opacity-50 cursor-not-allowed")}
              />
              <Label
                htmlFor={option.value}
                className={cn(
                  "text-sm font-normal cursor-pointer",
                  (disabled || option.disabled) && "opacity-50 cursor-not-allowed",
                )}
              >
                {t(option.labelKey)}
              </Label>
              {option.descriptionKey && (
                <p className="text-xs text-muted-foreground">{t(option.descriptionKey)}</p>
              )}
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  },
)

EnhancedRadio.displayName = "EnhancedRadio"

export { EnhancedRadio }
export type { RadioOption, EnhancedRadioProps }
