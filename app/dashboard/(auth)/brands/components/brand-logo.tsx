import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarFallback } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  name: string;
  logoUrl: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function BrandLogo({ name, logoUrl, size = "default", className }: BrandLogoProps) {
  return (
    <Avatar
      size={size}
      className={cn(
        "rounded-2xl border border-[#C5A572]/15 bg-[#FAF7F2] p-1.5 shadow-sm",
        size === "lg" && "size-14",
        size === "default" && "size-11",
        size === "sm" && "size-9",
        className
      )}>
      <AvatarImage src={logoUrl} alt={name} className="rounded-xl object-contain p-1" />
      <AvatarFallback className="rounded-xl bg-[#F7F2E8] text-[0.7rem] font-semibold text-[#8C6B2D]">
        {generateAvatarFallback(name)}
      </AvatarFallback>
    </Avatar>
  );
}
