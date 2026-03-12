"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { BellIcon, LogOutIcon, SettingsIcon, UserCircle2Icon } from "lucide-react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

const fallbackUserData = {
  name: "Bonnie Martin",
  role: "Opérations CRM",
  email: "bonnie@laloge.fr",
  avatar: "/images/avatars/01.png"
};

function formatDisplayName(email?: string | null) {
  if (!email) {
    return fallbackUserData.name;
  }

  const localPart = email.split("@")[0] ?? "";
  const formattedName = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return formattedName || fallbackUserData.name;
}

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "BM";
}

function buildUserData(
  user?: {
    email?: string | null;
    user_metadata?: {
      full_name?: string;
      name?: string;
      role?: string;
      avatar_url?: string;
    } | null;
  } | null
) {
  const metadata = user?.user_metadata;

  const name =
    typeof metadata?.full_name === "string" && metadata.full_name.trim().length > 0
      ? metadata.full_name
      : typeof metadata?.name === "string" && metadata.name.trim().length > 0
        ? metadata.name
        : formatDisplayName(user?.email);

  return {
    name,
    role:
      typeof metadata?.role === "string" && metadata.role.trim().length > 0
        ? metadata.role
        : fallbackUserData.role,
    email: user?.email ?? fallbackUserData.email,
    avatar:
      typeof metadata?.avatar_url === "string" && metadata.avatar_url.trim().length > 0
        ? metadata.avatar_url
        : fallbackUserData.avatar
  };
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [userData, setUserData] = useState(fallbackUserData);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (isMounted) {
        setUserData(buildUserData(user));
      }
    };

    void syncUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUserData(buildUserData(session?.user ?? null));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push("/dashboard/login/v1");
    router.refresh();
  }

  const userInitials = getInitials(userData.name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="rounded-full">
                <AvatarImage src={userData.avatar || undefined} alt={userData.name} />
                <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="text-muted-foreground truncate text-xs">{userData.role}</span>
              </div>
              <DotsVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData.avatar || undefined} alt={userData.name} />
                  <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link prefetch={false} href="/profile">
                  <UserCircle2Icon />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link prefetch={false} href="/notifications">
                  <BellIcon />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link prefetch={false} href="/settings">
                  <SettingsIcon />
                  Réglages
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isSigningOut} onClick={() => void handleLogout()}>
              <LogOutIcon />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
