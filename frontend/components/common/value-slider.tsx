"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps
  extends Omit<
    React.ComponentProps<"div">,
    "onChange" | "defaultValue" | "value"
  > {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: "horizontal" | "vertical"
  onValueChange?: (value: number[]) => void
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  orientation = "horizontal",
  onValueChange,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState<number[]>(() => {
    if (value) return value
    if (defaultValue) return defaultValue
    return [min]
  })

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [activeThumb, setActiveThumb] = React.useState<number | null>(null)

  const handleValueChange = (newValue: number[]) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100

  const getValueFromPosition = (position: number, rect: DOMRect) => {
    const percentage = orientation === "horizontal" ? position / rect.width : 1 - position / rect.height

    const rawValue = min + percentage * (max - min)
    const steppedValue = Math.round(rawValue / step) * step
    return Math.max(min, Math.min(max, steppedValue))
  }

  const handleMouseDown = (thumbIndex: number) => (event: React.MouseEvent) => {
    if (disabled) return

    event.preventDefault()
    setActiveThumb(thumbIndex)

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return

      const rect = trackRef.current.getBoundingClientRect()
      const position = orientation === "horizontal" ? e.clientX - rect.left : e.clientY - rect.top

      const newValue = getValueFromPosition(position, rect)
      const newValues = [...currentValue]
      newValues[thumbIndex] = newValue

      // Ensure values don't cross over
      if (thumbIndex > 0 && newValue < newValues[thumbIndex - 1]) {
        newValues[thumbIndex] = newValues[thumbIndex - 1]
      }
      if (thumbIndex < newValues.length - 1 && newValue > newValues[thumbIndex + 1]) {
        newValues[thumbIndex] = newValues[thumbIndex + 1]
      }

      handleValueChange(newValues)
    }

    const handleMouseUp = () => {
      setActiveThumb(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleTrackClick = (event: React.MouseEvent) => {
    if (disabled || !trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const position = orientation === "horizontal" ? event.clientX - rect.left : event.clientY - rect.top

    const clickValue = getValueFromPosition(position, rect)

    // Find closest thumb
    let closestThumbIndex = 0
    let closestDistance = Math.abs(currentValue[0] - clickValue)

    currentValue.forEach((val, index) => {
      const distance = Math.abs(val - clickValue)
      if (distance < closestDistance) {
        closestDistance = distance
        closestThumbIndex = index
      }
    })

    const newValues = [...currentValue]
    newValues[closestThumbIndex] = clickValue
    handleValueChange(newValues)
  }

  const handleKeyDown = (thumbIndex: number) => (event: React.KeyboardEvent) => {
    if (disabled) return

    let newValue = currentValue[thumbIndex]

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault()
        newValue = Math.min(max, newValue + step)
        break
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault()
        newValue = Math.max(min, newValue - step)
        break
      case "Home":
        event.preventDefault()
        newValue = min
        break
      case "End":
        event.preventDefault()
        newValue = max
        break
      default:
        return
    }

    const newValues = [...currentValue]
    newValues[thumbIndex] = newValue
    handleValueChange(newValues)
  }

  const rangeStart = currentValue.length > 1 ? getPercentage(Math.min(...currentValue)) : 0
  const rangeEnd = getPercentage(Math.max(...currentValue))

  return (
    <div
      data-slot="slider"
      data-disabled={disabled}
      data-orientation={orientation}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <div
        ref={trackRef}
        data-slot="slider-track"
        className={cn(
          "bg-grey-5 h-1.5 relative grow overflow-hidden rounded-full cursor-pointer data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
        onClick={handleTrackClick}
      >
        <div
          data-slot="slider-range"
          className={cn("bg-primary h-1.5 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full")}
          style={
            orientation === "horizontal"
              ? { left: `${rangeStart}%`, width: `${rangeEnd - rangeStart}%` }
              : { bottom: `${rangeStart}%`, height: `${rangeEnd - rangeStart}%` }
          }
        />
      </div>

      {currentValue.map((val, index) => (
        <div
          key={index}
          data-slot="slider-thumb"
          className="border-primary bg-background ring-ring absolute block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
          style={
            orientation === "horizontal"
              ? { left: `${getPercentage(val)}%`, transform: "translateX(-50%)" }
              : { bottom: `${getPercentage(val)}%`, transform: "translateY(50%)" }
          }
          onMouseDown={handleMouseDown(index)}
          onKeyDown={handleKeyDown(index)}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          aria-disabled={disabled}
        />
      ))}
    </div>
  )
}

export { Slider }