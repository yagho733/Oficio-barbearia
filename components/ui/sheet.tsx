"use client"

import * as React from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface SheetContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | null>(null)

export function Sheet({ children, open: controlledOpen, onOpenChange }: SheetProps) {
  const [localOpen, setLocalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : localOpen
  
  const setOpen = React.useCallback((val: boolean) => {
    if (!isControlled) {
      setLocalOpen(val)
    }
    if (onOpenChange) {
      onOpenChange(val)
    }
  }, [isControlled, onOpenChange])

  // Disable body scroll when sheet is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

interface SheetTriggerProps {
  children: React.ReactElement<{
    onClick?: React.MouseEventHandler
    className?: string
  }>
  asChild?: boolean
  className?: string
}

export function SheetTrigger({ children, className }: SheetTriggerProps) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetTrigger must be used within Sheet")

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      if (children.props.onClick) children.props.onClick(e)
      context.setOpen(true)
    },
    className: cn(children.props.className, className)
  })
}

type SheetContentProps = Omit<React.ComponentProps<typeof motion.div>, "children"> & {
  side?: "left" | "right" | "top" | "bottom"
  children?: React.ReactNode
}

export function SheetContent({
  children,
  className,
  side = "right",
  ...props
}: SheetContentProps) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetContent must be used within Sheet")

  const slideVariants: Variants = {
    hidden: {
      x: side === "right" ? "100%" : side === "left" ? "-100%" : 0,
      y: side === "bottom" ? "100%" : side === "top" ? "-100%" : 0,
    },
    visible: {
      x: 0,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 220 }
    },
    exit: {
      x: side === "right" ? "100%" : side === "left" ? "-100%" : 0,
      y: side === "bottom" ? "100%" : side === "top" ? "-100%" : 0,
      transition: { ease: "easeInOut", duration: 0.2 }
    }
  }

  return (
    <AnimatePresence>
      {context.open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => context.setOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet Panel */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className={cn(
              "fixed z-50 gap-4 bg-background p-6 shadow-2xl transition ease-in-out border-border",
              // Positioning
              side === "right" && "right-0 top-0 h-full w-full max-w-sm border-l",
              side === "left" && "left-0 top-0 h-full w-full max-w-sm border-r",
              side === "top" && "top-0 left-0 w-full h-auto border-b",
              side === "bottom" && "bottom-0 left-0 w-full h-auto border-t",
              className
            )}
            {...props}
          >
            {/* Close button */}
            <button
              onClick={() => context.setOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left mb-4",
        className
      )}
      {...props}
    />
  )
}

export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold text-foreground",
        className
      )}
      {...props}
    />
  )
}
