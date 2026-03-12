import { Badge } from "@/components/ui/badge";
import type { ContactStatus } from "./types";

export function ContactStatusBadge({ status }: { status: ContactStatus }) {
  return (
    <Badge
      variant="outline"
      className={
        status === "actif"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-stone-200 bg-stone-50 text-stone-700"
      }>
      {status === "actif" ? "Actif" : "Inactif"}
    </Badge>
  );
}
