"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect } from "react";
import { SparklesIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { useIsTablet } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/layout/logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const isTablet = useIsTablet();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, pathname, setOpenMobile]);

  useEffect(() => {
    setOpen(!isTablet);
  }, [isTablet, setOpen]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link prefetch={false} href="/dashboard" className="h-12">
                <Logo />
                <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="text-foreground font-semibold">La Loge</span>
                  <span className="text-muted-foreground text-xs">CRM beauté & marques</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain />
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-xl border border-[color:color-mix(in_srgb,var(--brand-gold)_20%,white)] bg-[var(--brand-gold-soft)] p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--brand-gold-ink)]">
            <SparklesIcon className="size-4" />
            La Loge Ops
          </div>
          <p className="mt-1 text-xs leading-5 text-foreground/80">
            3,822 salons suivis · 6 marques actives · 3 validations en attente.
          </p>
        </div>
        <SidebarSeparator />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
