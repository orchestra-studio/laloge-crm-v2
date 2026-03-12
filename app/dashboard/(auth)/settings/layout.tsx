import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";

import { SidebarNav } from "./components/sidebar-nav";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Réglages La Loge",
    description: "Configuration équipe, scoring, agents et templates dans La Loge CRM.",
    canonical: "/settings"
  });
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl space-y-4 lg:space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Réglages</h2>
        <p className="text-muted-foreground">
          Gérez le profil, les notifications, le scoring, l’équipe et la configuration des agents.
        </p>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <aside className="lg:w-72">
          <SidebarNav />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
