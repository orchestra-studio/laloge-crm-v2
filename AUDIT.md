# 🔍 Audit CRM La Loge v2 — 12 mars 2026

## État actuel
- **474 fichiers** (hors node_modules/.next/.git) — **6.9 MB** de code source
- **306 fichiers TSX** — beaucoup trop pour un CRM avec 5 liens dans la sidebar
- **62 pages** (routes `page.tsx`) — dont seulement **5 accessibles** depuis la navigation

---

## 🔴 CRITIQUE — Fichiers morts à supprimer

### 1. `app/(auth)/` — 25 fichiers MORTS
Arbre de routes dupliqué. **Chaque page** est soit un `RoutePlaceholder` (stub TODO), soit un redirect vers `/dashboard`. Aucune de ces routes n'est utilisée.
→ **Supprimer entièrement**

### 2. `app/dashboard/(auth)/apps/` — 53 fichiers TEMPLATE
Chat, Kanban, Mail, Tasks, AI Chat v2 — applications du template bundui. Aucun lien sidebar, jamais personnalisées pour La Loge.
→ **Supprimer entièrement**

### 3. `app/dashboard/(auth)/pages/` — 21 fichiers TEMPLATE
Profile, Users, Settings (doublon) — pages template en anglais, dupliquent les vraies pages settings.
→ **Supprimer entièrement**

### 4. `pages/` (Pages Router) — 5 fichiers LEGACY
Mélange Pages Router (Next ≤12) avec App Router. `_app.tsx`, `_error.tsx`, `404.tsx`, `500.tsx`, `api/health.ts`.
→ **Supprimer entièrement** (le 404 est déjà géré par App Router)

### 5. Fichiers mock data — 11 fichiers
Mock data toujours présents malgré l'intégration Supabase :
- `app/dashboard/(auth)/crm/data/mock-*.ts` (6 fichiers)
- `app/dashboard/(auth)/actions/components/mock-agent-actions.ts`
- `app/dashboard/(auth)/dossiers/components/mock-dossiers.ts`
- `app/dashboard/(auth)/outreach/data/mock-outreach.ts`
- `app/dashboard/(auth)/reports/components/mock-reports.ts`
- `app/dashboard/(auth)/settings/components/mock-settings.ts`
→ **Supprimer tous**

**Total fichiers morts : ~115 fichiers à supprimer**

---

## 🟠 BLOAT SIGNIFICATIF

### 6. Images template inutilisées — 55 fichiers
- `public/images/food/` (18 fichiers)
- `public/images/products/` (7 fichiers)
- `public/images/crypto-icons/` (12 fichiers)
- `public/images/avatars/` (12 fichiers — template)
- `public/images/extra/` (6 fichiers)
- `public/academy-dashboard-dark.svg`, `academy-dashboard-light.svg`
- `public/not-selected-chat.svg`, `not-selected-chat-light.svg` (113KB !)
- `public/star-shape.png`
→ **Supprimer tout sauf logos/ et logo.png**

### 7. TipTap (éditeur rich text) — 32 fichiers
`components/ui/custom/tiptap/` — éditeur complet avec 23 barres d'outils. Jamais utilisé par aucune page La Loge.
→ **Supprimer + retirer les 12 deps @tiptap du package.json**

### 8. Theme Customizer — 9 fichiers
`components/theme-customizer/` — fonctionnalité template pour changer couleurs/radius/scale. Pas utile en production.
→ **Supprimer**

### 9. Dépendances npm inutilisées
- `@fullcalendar/*` (5 packages) — calendrier jamais utilisé
- `swiper` — carrousel template
- `react-world-flags` — drapeaux pays
- `react-medium-image-zoom` — zoom images
- `shiki` — syntax highlighting (pour l'éditeur code template)
- `react-ga4` — Google Analytics avec clé template
- `@hello-pangea/dnd` — drag & drop (remplacé par @dnd-kit)
- `lottie-web` (si présent comme transitive)
→ **Nettoyer package.json**

### 10. Composants UI jamais utilisés
62 composants dans `components/ui/` — audit d'usage requis. Estimation : ~20 inutilisés.

---

## 🟡 PROBLÈMES STRUCTURELS

### 11. RLS bloque la page Salons
`getSalons()` utilise `createClient()` (anon key) → RLS refuse → page vide.
→ **Utiliser service_role client côté serveur** (déjà dans `lib/supabase/admin.ts`)

### 12. Navigation incomplète
Sidebar = 5 liens seulement. 12 pages dashboard sont **orphelines** (pas de lien pour y accéder) :
- Contacts, Pipeline, Dossiers, Outreach, Reports, Agents
→ **Supprimer les pages orphelines OU ajouter à la sidebar**

### 13. `ignoreBuildErrors: true`
Cache les erreurs TypeScript au build. Risque de bugs runtime.
→ **Fixer les erreurs TS et retirer le flag**

### 14. Confusion routes Dashboard
`/dashboard` et `/dashboard/crm` pointent vers la même page (re-export).
→ **Supprimer le doublon `/dashboard/crm`**

### 15. Template branding résiduel
- `next.config.ts` → `bundui-images.netlify.app` dans remotePatterns
- `README.md` → contenu template bundui
→ **Nettoyer**

### 16. Fichiers dev/internes
- `WORKER-CONTEXT.md` — doc interne pour agents IA
- `supabase/.temp/` — pas gitignored
→ **Supprimer / gitignore**

---

## 📊 Résumé quantitatif

| Catégorie | Fichiers | Action |
|-----------|----------|--------|
| Routes mortes `app/(auth)/` | 25 | Supprimer |
| Apps template | 53 | Supprimer |
| Pages template | 21 | Supprimer |
| Pages Router legacy | 5 | Supprimer |
| Mock data | 11 | Supprimer |
| Images template | ~55 | Supprimer |
| TipTap éditeur | 32 | Supprimer |
| Theme customizer | 9 | Supprimer |
| **TOTAL à supprimer** | **~211** | **-45% des fichiers** |

**Après nettoyage : ~263 fichiers** (au lieu de 474) — un projet 2× plus léger.

---

## 🎯 Plan d'action

### Phase 1 — Nettoyage radical (cette session)
1. Supprimer les 4 arbres de routes morts
2. Supprimer mock data, images template, TipTap, theme customizer
3. Nettoyer package.json (deps inutilisées)
4. Fixer RLS salons (utiliser admin client)
5. Nettoyer next.config.ts, README, .gitignore
6. Vérifier le build passe toujours

### Phase 2 — Décision sur les pages orphelines
- Garder uniquement ce qui est dans la sidebar ?
- Ou enrichir la sidebar avec les pages utiles (contacts, pipeline, outreach) ?
→ **Décision user requise**

### Phase 3 — Fixer TypeScript strict
- Retirer `ignoreBuildErrors: true`
- Corriger les erreurs TS
