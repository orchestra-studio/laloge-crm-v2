"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled
        aria-hidden="true"
        className="rounded-full border border-border/70 bg-card/70 px-2.5 text-muted-foreground backdrop-blur-md">
        <MoonIcon className="opacity-0" />
        <span className="hidden text-xs font-medium opacity-0 sm:inline">Black Knight</span>
      </Button>
    );
  }

  const activeTheme = resolvedTheme ?? theme ?? "dark";
  const isDark = activeTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const actionLabel = isDark
    ? "Revenir à La Loge Classic"
    : "Activer Black Knight";
  const currentLabel = isDark ? "Black Knight" : "La Loge Classic";

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      aria-label={actionLabel}
      title={actionLabel}
      className="rounded-full border border-border/70 bg-card/70 px-2.5 text-muted-foreground backdrop-blur-md hover:bg-accent/80 hover:text-foreground"
      onClick={() => setTheme(nextTheme)}>
      {isDark ? <SunIcon className="text-[var(--brand-gold)]" /> : <MoonIcon />}
      <span className="hidden text-xs font-medium sm:inline">{currentLabel}</span>
      <span className="sr-only">{actionLabel}</span>
    </Button>
  );
}
