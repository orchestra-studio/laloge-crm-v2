import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { salonStatusConfig } from "@/lib/salon";

interface StatusBadgeProps {
  status: keyof typeof salonStatusConfig;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const config = salonStatusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.badgeClassName, className)}>
      {showDot ? <span className={cn("size-1.5 rounded-full", config.dotClassName)} /> : null}
      {config.label}
    </Badge>
  );
}
