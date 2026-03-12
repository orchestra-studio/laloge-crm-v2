import { Link2Icon, Mail, MapPin, PhoneCall } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileCard() {
  return (
    <Card className="relative">
      <CardContent>
        <div className="space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="size-20">
              <AvatarImage src={`/images/avatars/10.png`} alt="La Loge" />
              <AvatarFallback>LL</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h5 className="flex items-center gap-2 text-xl font-semibold">
                Opérations La Loge <Badge variant="info">CRM</Badge>
              </h5>
              <div className="text-muted-foreground text-sm">
                Conciergerie beauté & mise en relation salons-marques
              </div>
            </div>
          </div>
          <div className="bg-muted grid grid-cols-3 divide-x rounded-md border text-center *:py-3">
            <div>
              <h5 className="text-lg font-semibold">3 822</h5>
              <div className="text-muted-foreground text-sm">Salons</div>
            </div>
            <div>
              <h5 className="text-lg font-semibold">6</h5>
              <div className="text-muted-foreground text-sm">Marques</div>
            </div>
            <div>
              <h5 className="text-lg font-semibold">9</h5>
              <div className="text-muted-foreground text-sm">Agents IA</div>
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="text-muted-foreground size-4" /> Bonnie · Marie-Pierre
            </div>
            <div className="flex items-center gap-3 text-sm">
              <PhoneCall className="text-muted-foreground size-4" /> Suivi commercial premium
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="text-muted-foreground size-4" /> France
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link2Icon className="text-muted-foreground size-4" /> 3 822 salons suivis
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link2Icon className="text-muted-foreground size-4" /> 6 marques actives · 3 validations en attente
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
