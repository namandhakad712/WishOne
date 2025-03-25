import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { gsap } from "gsap"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  noAnimation?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, noAnimation = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    
    // Merge refs
    const mergedRef = (node: HTMLButtonElement) => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
      buttonRef.current = node
    }
    
    React.useEffect(() => {
      const button = buttonRef.current
      if (!button || noAnimation) return
      
      // Hover animation
      const handleMouseEnter = () => {
        gsap.to(button, {
          scale: 1.03,
          duration: 0.2,
          ease: "power1.out",
        })
      }
      
      // Mouse leave animation
      const handleMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          ease: "power1.out",
        })
      }
      
      // Mouse down animation
      const handleMouseDown = () => {
        gsap.to(button, {
          scale: 0.97,
          duration: 0.1,
          ease: "power1.in",
        })
      }
      
      // Mouse up animation
      const handleMouseUp = () => {
        gsap.to(button, {
          scale: 1.03,
          duration: 0.2,
          ease: "power1.out",
        })
      }
      
      // Add event listeners
      button.addEventListener('mouseenter', handleMouseEnter)
      button.addEventListener('mouseleave', handleMouseLeave)
      button.addEventListener('mousedown', handleMouseDown)
      button.addEventListener('mouseup', handleMouseUp)
      
      // Clean up
      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter)
        button.removeEventListener('mouseleave', handleMouseLeave)
        button.removeEventListener('mousedown', handleMouseDown)
        button.removeEventListener('mouseup', handleMouseUp)
      }
    }, [noAnimation])
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={mergedRef}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
