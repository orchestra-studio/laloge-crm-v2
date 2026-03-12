"use client";

import Link from "next/link";
import {
  BriefcaseIcon,
  Building2Icon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  StarIcon
} from "lucide-react";

import { ContactStatusBadge } from "./contact-status-badge";
import type { Contact } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

interface ContactDetailSheetProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

export function ContactDetailSheet({ contact, open, onOpenChange }: ContactDetailSheetProps) {
  if (!contact) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border/60 bg-linear-to-br from-[#FCFAF6] via-white to-white p-6 text-left">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-xl">
                  {contact.first_name} {contact.last_name}
                </SheetTitle>
                {contact.is_decision_maker && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#C5A572]/20 bg-[#C5A572]/10 px-2 py-1 text-xs font-medium text-[#8C6B2D]">
                    <StarIcon className="size-3.5 fill-current" />
                    Décisionnaire
                  </span>
                )}
              </div>
              <SheetDescription className="text-sm leading-6">
                Vue détail du contact, historique outreach et contexte salon.
              </SheetDescription>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <BriefcaseIcon className="size-4" />
                  {contact.role}
                </div>
                <ContactStatusBadge status={contact.status} />
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-5 p-6">
          <Card className="border-[#C5A572]/12 shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 text-sm">
              <div className="grid gap-3">
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-3 hover:text-foreground">
                    <PhoneIcon className="size-4 text-[#8C6B2D]" />
                    {contact.phone}
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <PhoneIcon className="size-4" />
                    Téléphone non renseigné
                  </div>
                )}
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-foreground">
                    <MailIcon className="size-4 text-[#8C6B2D]" />
                    {contact.email}
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MailIcon className="size-4" />
                    Email non renseigné
                  </div>
                )}
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MessageCircleIcon className="size-4 text-[#8C6B2D]" />
                  Dernier contact le {formatDate(contact.last_contact)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {contact.linkedin && (
                  <Button asChild variant="outline" size="sm">
                    <a href={contact.linkedin} target="_blank" rel="noreferrer">
                      <LinkedinIcon className="size-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {contact.instagram && (
                  <Button asChild variant="outline" size="sm">
                    <a href={contact.instagram} target="_blank" rel="noreferrer">
                      <InstagramIcon className="size-4" />
                      Instagram
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C5A572]/12 shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Salon lié</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-sm">
              <Link prefetch={false}
                href={`/dashboard/salons/${contact.salon_id}`}
                className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
                <Building2Icon className="mt-0.5 size-4 text-[#8C6B2D]" />
                <div>
                  <p className="font-medium">{contact.salon_name}</p>
                  <p className="text-muted-foreground mt-1">{contact.salon_city}</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-[#C5A572]/12 shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Historique outreach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {contact.outreach_history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-border/60 bg-white p-4 text-sm shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">
                      {entry.channel} • {entry.status}
                    </div>
                    <div className="text-muted-foreground text-xs">{formatDate(entry.date)}</div>
                  </div>
                  <p className="text-muted-foreground mt-2 leading-6">{entry.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[#C5A572]/12 shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {contact.notes.map((note) => (
                <div key={note.id} className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm">
                  <div className="text-muted-foreground mb-2 text-xs">{formatDate(note.date)}</div>
                  <p className="leading-6">{note.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
