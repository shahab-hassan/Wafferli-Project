"use client"

import { Button } from "../common/button"

export function StepFooter({
  nextLabel = "Continue",
  onNext,
  disabled,
}: {
  nextLabel?: string
  onNext: () => void
  onBack?: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-end pt-2">
      <Button
      variant={'primary'}
        className="w-full"
        onClick={onNext}
        disabled={disabled}
      >
        {nextLabel}
      </Button>
    </div>
  )
}
