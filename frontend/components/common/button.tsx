"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
      // Don't forward invalid props to Fragment
      if (children.type === React.Fragment) {
        return children
      }

      const child = children as React.ReactElement<any>
      return React.cloneElement(child, {
        ...props,
        ...child.props,
        ref,
        className: cn(props.className, child.props.className),
      })
    }
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} {...props}>
        {children}
      </span>
    )
  }
)
Slot.displayName = "Slot"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10",
  {
    variants: {
      variant: {
        default:
          "bg-grey-4 text-black-2 shadow-xs hover:bg-grey-3 active:bg-grey-2 transition-colors duration-300 cursor-pointer",
        primary:
          "bg-primary text-white shadow-xs hover:bg-secondary active:bg-[#c91a6b] transition-colors duration-300 cursor-pointer",
        secondary:
          "bg-secondary text-white shadow-xs hover:bg-tertiary active:bg-secondary transition-colors duration-300 cursor-pointer",
        tertiary:
          "bg-tertiary text-black-2 shadow-xs hover:bg-primary hover:text-white active:bg-[#5a2269] active:text-white transition-colors duration-300 cursor-pointer",
        gradient:
          "bg-gradient-to-r from-primary via-secondary to-tertiary text-white shadow-xs relative overflow-hidden animate-gradient before:absolute before:inset-0 before:bg-gradient-to-r before:from-tertiary before:via-primary before:to-secondary before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 cursor-pointer",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 cursor-pointer",
        outline:
          "border border-primary text-primary bg-background shadow-xs hover:bg-primary hover:text-white active:bg-primary/90 active:text-white transition-colors duration-300 cursor-pointer",
        normal:
          "border border-grey-5 text-black bg-background shadow-xs hover:bg-primary hover:text-white active:bg-tertiary/90 active:text-white transition-colors duration-300 cursor-pointer",
        tab:
          "border border-grey-5 h-[55px] text-black bg-background shadow-xs hover:bg-tertiary hover:text-white active:bg-tertiary/90 active:text-white transition-colors duration-300 rounded-[24px] cursor-pointer",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 cursor-pointer",
        link: "text-primary underline-offset-4 hover:underline cursor-pointer",
      },
      size: {
        default: "px-6 py-2 has-[>svg]:px-5",
        sm: "px-4 py-2 has-[>svg]:px-3",
        lg: "px-8 py-2 has-[>svg]:px-6",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  // Detect RTL or LTR from document
  const isRTL =
    typeof document !== "undefined"
      ? document?.documentElement?.dir === "rtl"
      : false

  const content = isRTL ? (
    <>
      {trailingIcon}
      {children}
      {leadingIcon}
    </>
  ) : (
    <>
      {leadingIcon}
      {children}
      {trailingIcon}
    </>
  )

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {variant === "gradient" ? (
        <span className="relative z-10">{content}</span>
      ) : (
        content
      )}
    </Comp>
  )
}

export { Button, buttonVariants }