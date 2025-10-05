"use client"

import * as React from "react"
import { Slider } from "./value-slider"
import { Label } from "./label"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface SliderLimit {
  value: number
  labelKey: string   // 🔑 translation key
}

interface EnhancedSliderProps {
  // Basic slider props
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: "horizontal" | "vertical"
  onValueChange?: (value: number[]) => void

  // Enhanced features
  labelKey?: string        // 🔑 translation key
  descriptionKey?: string  // 🔑 translation key
  showValue?: boolean
  limits?: SliderLimit[]
  formatValue?: (value: number) => string
  className?: string

  // Variants
  variant?: "single" | "range"
}

const EnhancedSlider = React.forwardRef<React.ElementRef<typeof Slider>, EnhancedSliderProps>(
  (
    {
      labelKey,
      descriptionKey,
      showValue = false,
      limits = [],
      formatValue = (value) => value.toString(),
      className,
      variant = "single",
      value,
      defaultValue,
      min = 0,
      max = 100,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const id = React.useId()

    // Handle single vs range variants
    const [internalValue, setInternalValue] = React.useState<number[]>(() => {
      if (value) return value
      if (defaultValue) return defaultValue
      return variant === "range" ? [min, Math.round(max * 0.3)] : [min]
    })

    // Use controlled value if provided, otherwise use internal state
    const sliderValue = value || internalValue

    const handleValueChange = (newValue: number[]) => {
      if (!value) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    React.useEffect(() => {
      if (value) {
        setInternalValue(value)
      }
    }, [value])

    return (
      <div className={cn("space-y-3", className)}>
        {/* Label and Value Display */}
        {(labelKey || showValue) && (
          <div className="flex items-center justify-between">
            {labelKey && (
              <Label htmlFor={id} className="text-sm font-medium">
                {labelKey}
              </Label>
            )}
            {showValue && (
              <div className="text-sm text-muted-foreground">
                {variant === "range" && sliderValue.length >= 2
                  ? `${formatValue(sliderValue[0])} - ${formatValue(sliderValue[sliderValue.length - 1])}`
                  : formatValue(sliderValue[0] || min)}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {descriptionKey && (
          <p className="text-sm text-muted-foreground">{descriptionKey}</p>
        )}

        {/* Slider */}
        <div className="space-y-3">
          <Slider
            ref={ref}
            id={id}
            value={sliderValue}
            min={min}
            max={max}
            onValueChange={handleValueChange}
            className="w-full"
            {...props}
          />

          {/* Limits Display */}
          {limits.length > 0 && (
            <div className="flex justify-between text-xs text-muted-foreground">
              {limits.map((limit, index) => (
                <span key={index} className="flex flex-col items-center">
                  {limit.labelKey}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
)

EnhancedSlider.displayName = "EnhancedSlider"

export { EnhancedSlider }
export type { EnhancedSliderProps, SliderLimit }
