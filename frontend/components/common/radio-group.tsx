"use client"

import React from "react"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined)

interface RadioGroupProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  name?: string
  disabled?: boolean
}

function RadioGroup({
  className,
  value,
  onValueChange,
  defaultValue,
  name,
  disabled,
  children,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const groupId = React.useId()

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const contextValue = React.useMemo(
    () => ({
      value: currentValue,
      onValueChange: handleValueChange,
      name: name ?? groupId,
      disabled,
    }),
    [currentValue, name, disabled],
  )

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        data-slot="radio-group"
        className={cn("grid gap-3", className)}
        role="radiogroup"
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps extends Omit<React.ComponentProps<"input">, "type"> {
  value: string
}

function RadioGroupItem({ className, value, disabled: itemDisabled, ...props }: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext)

  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup")
  }

  const { value: groupValue, onValueChange, name, disabled: groupDisabled } = context
  const isDisabled = groupDisabled || itemDisabled
  const isChecked = groupValue === value

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled && event.target.checked) {
      onValueChange?.(value)
    }
  }

  return (
    <div className="relative inline-flex">
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={isDisabled}
        className="sr-only"
        {...props}
      />
      <div
        data-slot="radio-group-item"
        data-state={isChecked ? "checked" : "unchecked"}
        className={cn(
          "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer",
          isDisabled && "cursor-not-allowed opacity-50",
          className,
        )}
        onClick={() => !isDisabled && onValueChange?.(value)}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !isDisabled) {
            e.preventDefault()
            onValueChange?.(value)
          }
        }}
        tabIndex={isDisabled ? -1 : 0}
        role="radio"
        aria-checked={isChecked}
        aria-disabled={isDisabled}
      >
        {isChecked && (
          <div 
            data-slot="radio-group-indicator" 
            className="absolute inset-0 flex items-center justify-center"
          >
            <CircleIcon className="w-2 h-2 fill-white text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

export { RadioGroup, RadioGroupItem }