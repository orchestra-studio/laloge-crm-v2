"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getScoreIndicatorClass, getScoreTextClass } from "@/lib/salon";

interface ScoreBarProps {
  score: number;
  className?: string;
  showValue?: boolean;
  compact?: boolean;
}

export function ScoreBar({ score, className, showValue = true, compact = false }: ScoreBarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress
        value={score}
        indicatorColor={getScoreIndicatorClass(score)}
        className={cn("bg-slate-100", compact ? "h-1.5 min-w-20" : "h-2.5 min-w-28")}
      />
      {showValue ? (
        <span className={cn("min-w-10 text-right text-xs font-semibold", getScoreTextClass(score))}>
          {score}
        </span>
      ) : null}
    </div>
  );
}
