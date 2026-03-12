"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  BotIcon,
  MailIcon,
  PaletteIcon,
  ShieldIcon,
  TargetIcon,
  UserCogIcon,
  UsersIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sidebarNavItems = [
  {
    title: "Profil",
    href: "/dashboard/settings",
    icon: UserCogIcon
  },
  {
    title: "Compte",
    href: "/dashboard/settings/account",
    icon: ShieldIcon
  },
  {
    title: "Apparence",
    href: "/dashboard/settings/appearance",
    icon: PaletteIcon
  },
  {
    title: "Notifications",
    href: "/dashboard/settings/notifications",
    icon: BellIcon
  },
  {
    title: "Scoring",
    href: "/dashboard/settings/scoring",
    icon: TargetIcon
  },
  {
    title: "Équipe",
    href: "/dashboard/settings/team",
    icon: UsersIcon
  },
  {
    title: "Agents IA",
    href: "/dashboard/settings/agents",
    icon: BotIcon
  },
  {
    title: "Templates email",
    href: "/dashboard/settings/templates",
    icon: MailIcon
  }
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Card className="py-0">
      <CardContent className="p-2">
        <nav className="flex flex-col space-y-0.5">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "justify-start hover:bg-muted",
                pathname === item.href ? "bg-muted hover:bg-muted" : ""
              )}
              asChild
            >
              <Link prefetch={false} href={item.href}>
                <item.icon />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
