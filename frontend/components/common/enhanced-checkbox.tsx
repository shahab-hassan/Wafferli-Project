"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Checkbox } from "./checkbox"
import { Label } from "./label"
import { cn } from "@/lib/utils"

export interface EnhancedCheckboxProps {
  id?: string
  labelKey?: string          // 🔑 translation key
  descriptionKey?: string    // 🔑 translation key
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  labelClassName?: string
  descriptionClassName?: string
}

const EnhancedCheckbox = React.forwardRef<React.ElementRef<typeof Checkbox>, EnhancedCheckboxProps>((props, ref) => {
  const generatedId = React.useId()
  const t = useTranslations("Checkbox") // 👈 namespace e.g. "Checkbox"

  const {
    id,
    labelKey,
    descriptionKey,
    checked,
    defaultChecked,
    onCheckedChange,
    className,
    labelClassName,
    descriptionClassName,
    ...rest
  } = props
  const checkboxId = id || generatedId

  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)
  const isControlled = checked !== undefined
  const checkedValue = isControlled ? checked : internalChecked

  const handleCheckedChange = (newChecked: boolean) => {
    if (!isControlled) {
      setInternalChecked(newChecked)
    }
    onCheckedChange?.(newChecked)
  }

  return (
    <div className="flex items-start gap-3"> 
      {/* gap instead of space-x for RTL support */}
      <Checkbox
        id={checkboxId}
        ref={ref}
        checked={checkedValue}
        onCheckedChange={handleCheckedChange}
        className={className}
        {...rest}
      />
      {(labelKey || descriptionKey) && (
        <div className="flex flex-col space-y-1">
          {labelKey && (
            <Label
              htmlFor={checkboxId}
              className={cn(
                "text-normal-regular cursor-pointer",
                props.disabled && "opacity-50 cursor-not-allowed",
                labelClassName,
              )}
            >
              {t(labelKey)}
              {props.required && <span className="text-failure ml-1">*</span>}
            </Label>
          )}
          {descriptionKey && (
            <p
              className={cn(
                "text-small-regular text-muted-foreground",
                props.disabled && "opacity-50",
                descriptionClassName,
              )}
            >
              {t(descriptionKey)}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

EnhancedCheckbox.displayName = "EnhancedCheckbox"

export { EnhancedCheckbox }
