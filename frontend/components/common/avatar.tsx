import React, { useState } from "react";
export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  children?: React.ReactNode;
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const sizeMap: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "avatar", size = "md", className = "", children, ...rest }, ref) => {
    const [hasError, setHasError] = useState(false);
    const sizes = sizeMap[size] || sizeMap.md;

    return (
      <div
        ref={ref}
        {...rest}
        className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-muted ${sizes} ${className}`}
        role="img"
        aria-label={alt}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          children ?? (
            <AvatarFallback>
              {(alt || "?")
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          )
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <span
        ref={ref}
        {...props}
        className={`select-none font-medium text-foreground ${className}`}
      >
        {children}
      </span>
    );
  }
);

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarFallback };

