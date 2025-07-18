import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const accessibleButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-institutional font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden focus-ring press-effect",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-foreground/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive/20",
        outline:
          "border-2 border-foreground bg-background hover:bg-foreground hover:text-background",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary-foreground/20",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
      loading: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof accessibleButtonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  ariaLabel?: string
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false, 
    loadingText, 
    asChild = false, 
    children, 
    disabled, 
    ariaLabel,
    'aria-label': ariaLabelProp,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(accessibleButtonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-label={ariaLabel || ariaLabelProp}
        role={asChild ? undefined : "button"}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {loading && (
          <Loader2 
            className="animate-spin" 
            aria-hidden="true"
            role="status"
          />
        )}
        <span className={loading ? "sr-only" : undefined}>
          {loading ? loadingText || children : children}
        </span>
        {loading && loadingText && (
          <span aria-live="polite" className="sr-only">
            {loadingText}
          </span>
        )}
      </Comp>
    )
  }
)
AccessibleButton.displayName = "AccessibleButton"

export { AccessibleButton, accessibleButtonVariants }