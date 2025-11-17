"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { useTranslations } from "next-intl"

interface TextFieldProps extends Omit<React.ComponentProps<"input">, "className"> {
  label?: string          // translation key for label
  status?: string         // translation key for status message
  icon?: React.ReactNode
  error?: boolean
  className?: string
  containerClassName?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, status, icon, error, className, containerClassName, ...props }, ref) => {
    const t = useTranslations("TextField") // namespace in messages JSON

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && <Label className="mb-1 text-sm font-medium text-foreground">{t(label)}</Label>}

        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-[100px] border border-input bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground",
              "transition-colors duration-200",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary",
              error && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
              icon && "pl-10",
              className,
            )}
            placeholder={props.placeholder} 
            {...props}
          />
        </div>

        {status && <p className={cn("mt-1 text-xs", error ? "text-destructive" : "text-muted-foreground")}>{t(status)}</p>}
      </div>
    )
  },
)

TextField.displayName = "TextField"

export { TextField }
