import { Scissors } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandProps {
  compact?: boolean
  className?: string
}

export function Brand({ compact = false, className }: BrandProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/12 text-primary",
          compact ? "h-9 w-9" : "h-11 w-11",
        )}
      >
        <Scissors className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </span>
      <span className="min-w-0 leading-none">
        <span className={cn("block font-heading tracking-[0.08em] text-foreground", compact ? "text-lg" : "text-xl")}>
          SUA BARBEARIA
        </span>
        <span className="mt-1 block text-xs font-semibold tracking-[0.14em] text-primary">
          SITE DEMONSTRATIVO
        </span>
      </span>
    </span>
  )
}
