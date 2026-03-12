import { ContactsPageClient } from "./components/contacts-page-client";
import { getContacts } from "@/lib/supabase/queries/contacts";

export default async function ContactsPage() {
  const { contacts } = await getContacts({ limit: 500, offset: 0 });

  return <ContactsPageClient initialContacts={contacts} />;
}
