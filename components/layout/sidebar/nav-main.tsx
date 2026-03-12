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
        title: "Tableau de bord",
        href: "/dashboard",
        icon: LayoutDashboardIcon
      },
      {
        title: "Salons",
        href: "/dashboard/salons",
        icon: ScissorsIcon,
        badge: "3,822",
        badgeTone: "gold"
      },
      {
        title: "Marques",
        href: "/dashboard/brands",
        icon: Building2Icon
      },
      {
        title: "Contacts",
        href: "/dashboard/contacts",
        icon: UsersIcon
      },
      {
        title: "Pipeline",
        href: "/dashboard/pipeline",
        icon: SquareKanbanIcon
      },
      {
        title: "Outreach",
        href: "/dashboard/outreach",
        icon: SendIcon
      },
      {
        title: "Actions",
        href: "/dashboard/actions",
        icon: ZapIcon,
        badge: "3",
        badgeTone: "danger"
      },
      {
        title: "Agents IA",
        href: "/dashboard/agents",
        icon: BotIcon
      },
      {
        title: "Dossiers",
        href: "/dashboard/dossiers",
        icon: FileTextIcon
      },
      {
        title: "Rapports",
        href: "/dashboard/reports",
        icon: BarChart3Icon
      },
      {
        title: "Réglages",
        href: "/dashboard/settings",
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

function normalizePath(path: string) {
  return path !== "/" ? path.replace(/\/+$/, "") : path;
}

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  const normalizedPathname = normalizePath(pathname);
  const normalizedHref = normalizePath(href);

  if (normalizedHref === "/dashboard") {
    return normalizedPathname === normalizedHref;
  }

  if (!normalizedPathname.startsWith("/dashboard")) {
    return false;
  }

  return (
    normalizedPathname === normalizedHref ||
    normalizedPathname.startsWith(`${normalizedHref}/`)
  );
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
