"use client";

import { PanelLeftClose, PanelLeftOpen, SparklesIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import Notifications from "@/components/layout/header/notifications";
import Search from "@/components/layout/header/search";
import ThemeSwitch from "@/components/layout/header/theme-switch";
import UserMenu from "@/components/layout/header/user-menu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SiteHeader() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <header className="bg-background/80 sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:rounded-tl-xl md:rounded-tr-xl">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
        <Button onClick={toggleSidebar} size="icon" variant="ghost">
          {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

        <div className="hidden lg:flex">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--brand-gold)_30%,white)] bg-[var(--brand-gold-soft)] px-3 py-1 text-xs font-medium text-[var(--brand-gold-ink)]">
            <SparklesIcon className="size-3.5" />
            La Loge CRM
          </div>
        </div>

        <Search />

        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitch />
          <Notifications />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
