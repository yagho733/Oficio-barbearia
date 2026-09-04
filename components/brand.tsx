import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

interface BrandProps {
  compact?: boolean
  className?: string
}

export function Brand({ compact = false, className }: BrandProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-3 text-foreground", className)}>
      <span aria-hidden="true" className={cn("block w-px shrink-0 bg-primary", compact ? "h-9" : "h-11")} />
      <span className="min-w-0 leading-none">
        <span className={cn("block font-heading font-semibold tracking-[-0.03em]", compact ? "text-xl" : "text-2xl")}>
          {siteConfig.business.name}
        </span>
        <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {siteConfig.business.descriptor}
        </span>
      </span>
    </span>
  )
}
