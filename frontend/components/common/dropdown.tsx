"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/common/label"

export interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

export interface DropdownProps {
  label?: string
  placeholder?: string
  options: DropdownOption[]
  value?: string
  onValueChange?: (value: string) => void
  variant?: "rounded" | "rectangular"
  disabled?: boolean
  className?: string
  status?: string
  statusType?: "default" | "error" | "success"
}

const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      label,
      placeholder = "Select an option",
      options,
      value,
      onValueChange,
      variant = "rounded",
      disabled = false,
      className,
      status,
      statusType = "default",
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [focusedIndex, setFocusedIndex] = React.useState(-1)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const listRef = React.useRef<HTMLUListElement>(null)
    const id = React.useId()

    const selectedOption = options.find((option) => option.value === value)

    const statusColors = {
      default: "text-grey-3",
      error: "text-failure",
      success: "text-success",
    }

    // Handle click outside to close dropdown
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setFocusedIndex(-1)
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [isOpen])

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
            setFocusedIndex(0)
          } else if (focusedIndex >= 0) {
            const option = options[focusedIndex]
            if (!option.disabled) {
              onValueChange?.(option.value)
              setIsOpen(false)
              setFocusedIndex(-1)
            }
          }
          break
        case "Escape":
          setIsOpen(false)
          setFocusedIndex(-1)
          triggerRef.current?.focus()
          break
        case "ArrowDown":
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
            setFocusedIndex(0)
          } else {
            const nextIndex = Math.min(focusedIndex + 1, options.length - 1)
            setFocusedIndex(nextIndex)
          }
          break
        case "ArrowUp":
          event.preventDefault()
          if (isOpen) {
            const prevIndex = Math.max(focusedIndex - 1, 0)
            setFocusedIndex(prevIndex)
          }
          break
      }
    }

    const handleOptionClick = (option: DropdownOption) => {
      if (!option.disabled) {
        onValueChange?.(option.value)
        setIsOpen(false)
        setFocusedIndex(-1)
        triggerRef.current?.focus()
      }
    }

    const handleTriggerClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
        if (!isOpen) {
          setFocusedIndex(0)
        }
      }
    }

    return (
      <div className="w-full" ref={dropdownRef}>
        {label && (
          <Label htmlFor={id} className="text-normal-regular text-black-3 mb-2 block">
            {label}
          </Label>
        )}

        <div className="relative">
          <button
            ref={triggerRef}
            id={id}
            type="button"
            onClick={handleTriggerClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className={cn(
              // Base styles
              "flex h-10 w-full items-center justify-between bg-white px-3 py-2 text-sm text-left",
              "border border-grey-4 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",

              // Variant styles
              variant === "rounded" ? "rounded-full" : "rounded-md",

              // Status styles
              statusType === "error" && "border-failure focus:ring-failure focus:border-failure",
              statusType === "success" && "border-success focus:ring-success focus:border-success",

              className,
            )}
            {...props}
          >
            <span className={cn(!selectedOption && "text-grey-3")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDownIcon className={cn("h-4 w-4 text-grey-3 transition-transform", isOpen && "rotate-180")} />
          </button>

          {isOpen && (
            <ul
              ref={listRef}
              role="listbox"
              className={cn(
                "absolute z-50 mt-1 max-h-96 min-w-full overflow-auto bg-white shadow-lg",
                "animate-in fade-in-0 zoom-in-95",
                variant === "rounded" ? "rounded-2xl" : "rounded-md",
                "border border-grey-4",
              )}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm",
                    "outline-none transition-colors",
                    "hover:bg-primary hover:text-white",
                    focusedIndex === index && "bg-primary text-white",
                    option.disabled && "pointer-events-none opacity-50",
                    variant === "rounded"
                      ? "first:rounded-t-2xl last:rounded-b-2xl"
                      : "first:rounded-t-md last:rounded-b-md",
                  )}
                  onClick={() => handleOptionClick(option)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {status && <p className={cn("text-small-regular mt-1", statusColors[statusType])}>{status}</p>}
      </div>
    )
  },
)

Dropdown.displayName = "Dropdown"

export { Dropdown }
