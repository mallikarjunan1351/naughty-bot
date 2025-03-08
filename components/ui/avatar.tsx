import * as React from "react"
import { combineClasses } from "../../lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

export function Avatar({ className, src, alt, ...props }: AvatarProps) {
  return (
    <div
      className={combineClasses(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || ""}
          className="aspect-square h-full w-full"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600">
          {alt ? alt.charAt(0).toUpperCase() : "U"}
        </div>
      )}
    </div>
  );
}

export function AvatarImage({ 
  className, 
  src, 
  alt = "", 
  ...props 
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt}
      className={combineClasses("aspect-square h-full w-full", className)}
      {...props}
    />
  );
}

export function AvatarFallback({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={combineClasses(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 