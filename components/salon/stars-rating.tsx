import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarsRatingProps {
  rating: number;
  reviewsCount?: number;
  className?: string;
  size?: "sm" | "md";
  showValue?: boolean;
}

export function StarsRating({
  rating,
  reviewsCount,
  className,
  size = "sm",
  showValue = true
}: StarsRatingProps) {
  const rounded = Math.round(rating);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const active = index < rounded;
          return (
            <Star
              key={index}
              className={cn(
                size === "sm" ? "size-3.5" : "size-4",
                active ? "fill-amber-400 stroke-amber-400" : "stroke-slate-300"
              )}
            />
          );
        })}
      </div>
      {showValue ? (
        <span className="text-muted-foreground text-xs font-medium">
          {rating.toFixed(1)}
          {typeof reviewsCount === "number" ? ` · ${reviewsCount} avis` : ""}
        </span>
      ) : null}
    </div>
  );
}
