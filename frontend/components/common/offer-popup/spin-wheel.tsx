"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type SpinWheelProps = {
  className?: string
  onFinish?: (value: number) => void
  triggerSpin?: number // change this number to trigger a spin
}

const SEGMENTS = [
  { label: "25", color: "primary", value: 25 }, // yellow
  { label: "10", color: "secondary", value: 10 }, // slightly darker yellow
  { label: "0", color: "primary", value: 0 }, // pinkish
  { label: "50", color: "secondary", value: 50 }, // purple
]

export function SpinWheel({ className, onFinish, triggerSpin = 0 }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const latestTargetIndex = useRef<number | null>(null)

  // measure for responsive label positioning
  const wheelRef = useRef<HTMLDivElement | null>(null)
  const [labelRadius, setLabelRadius] = useState(60) // px

  useEffect(() => {
    const el = wheelRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const size = entry.contentRect.width
      // Place labels centered in the colored ring between outer edge and center cap
      // approx: 35% of diameter works well across sizes
      setLabelRadius(Math.max(38, Math.round(size * 0.33)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Kick off a spin whenever triggerSpin changes
  useEffect(() => {
    if (!triggerSpin) return
    startSpin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSpin])

  const startSpin = () => {
    if (spinning) return
    setSpinning(true)

    const index = Math.floor(Math.random() * SEGMENTS.length)
    latestTargetIndex.current = index

    // Centers are at 45, 135, 225, 315 for 4 equal segments
    const centerAngle = index * 90 + 45
    // Add multiple full rotations for drama, then align target center to pointer (at top)
    const baseSpins = 720 // 2 full turns
    const final = baseSpins + (360 - centerAngle)

    setRotation((prev) => prev + final)
  }

  const handleTransitionEnd = () => {
    setSpinning(false)
    const idx = latestTargetIndex.current
    if (idx != null) onFinish?.(SEGMENTS[idx].value)
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Pointer (top center, pointing DOWN into the wheel) */}
      <div
        aria-hidden
        className="absolute top-0 z-20 h-0 w-0 -translate-y-1/2 "
        style={{
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "14px solid #ff8dc8ff",
        }}
      />

      {/* Wheel */}
      <div
        ref={wheelRef}
        className="relative size-44 md:size-52 rounded-full border border-border shadow-inner"
        style={{
          background: `conic-gradient(
            #762c85 0 90deg,
            #e71e86 90deg 180deg,
            #762c85 180deg 270deg,
            #e71e86 270deg 360deg
          )`,
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 3.2s cubic-bezier(.17,.67,.32,1.34)" : undefined,
        }}
        onTransitionEnd={handleTransitionEnd}
        role="img"
        aria-label="Spin the wheel"
      >
        {/* Center cap */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-20 md:size-24 rounded-full bg-white/95 border border-border grid place-items-center text-normal-bold text-primary">
            SPIN
          </div>
        </div>

        {/* Segment labels – dynamically placed along ring radius */}
        <WheelLabel text="25" angle={45} r={labelRadius} />
        <WheelLabel text="10" angle={135} r={labelRadius} />
        <WheelLabel text="0" angle={225} r={labelRadius} />
        <WheelLabel text="50" angle={315} r={labelRadius} />
      </div>
    </div>
  )
}

function WheelLabel({ text, angle, r }: { text: string; angle: number; r: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${r}px) rotate(${-angle}deg)`,
        transformOrigin: "center",
      }}
    >
      <div
        className="text-medium-bold select-none"
        style={{
          color: "white",
          textShadow: "0 1px 1px rgba(0,0,0,.35)",
        }}
      >
        {text}
      </div>
    </div>
  )
}
