"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3Icon,
  BotIcon,
  Building2Icon,
  FileTextIcon,
  LayoutDashboardIcon,
  ScissorsIcon,
  SendIcon,
  SettingsIcon,
  SquareKanbanIcon,
  UsersIcon,
  ZapIcon,
  type LucideIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: "gold" | "danger" | "neutral";
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

export const navItems: NavGroup[] = [
  {
    title: "La Loge CRM",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboardIcon
      },
      {
        title: "Salons",
        href: "/salons",
        icon: ScissorsIcon,
        badge: "1,707",
        badgeTone: "gold"
      },
      {
        title: "Marques",
        href: "/brands",
        icon: Building2Icon
      },
      {
        title: "Contacts",
        href: "/contacts",
        icon: UsersIcon
      },
      {
        title: "Pipeline",
        href: "/pipeline",
        icon: SquareKanbanIcon
      },
      {
        title: "Outreach",
        href: "/outreach",
        icon: SendIcon
      },
      {
        title: "Actions",
        href: "/actions",
        icon: ZapIcon,
        badge: "3",
        badgeTone: "danger"
      },
      {
        title: "Agents IA",
        href: "/agents",
        icon: BotIcon
      },
      {
        title: "Dossiers",
        href: "/dossiers",
        icon: FileTextIcon
      },
      {
        title: "Rapports",
        href: "/reports",
        icon: BarChart3Icon
      },
      {
        title: "Réglages",
        href: "/settings",
        icon: SettingsIcon
      }
    ]
  }
];

const badgeToneClasses: Record<NonNullable<NavItem["badgeTone"]>, string> = {
  gold:
    "border-[color:color-mix(in_srgb,var(--brand-gold)_35%,white)] bg-[var(--brand-gold-soft)] text-[var(--brand-gold-ink)]",
  danger: "border-red-200 bg-red-50 text-red-600",
  neutral: "border-border bg-muted text-muted-foreground"
};

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavMain() {
  const pathname = usePathname() ?? "";

  return (
    <>
      {navItems.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActivePath(pathname, item.href)}
                    asChild>
                    <Link prefetch={false} href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge
                      className={cn(
                        "rounded-full border px-1.5 text-[11px] font-semibold",
                        badgeToneClasses[item.badgeTone ?? "neutral"]
                      )}>
                      {item.badge}
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
