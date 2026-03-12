"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { generateMeta } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        if (authError.message.includes("Invalid login")) {
          setError("Email ou mot de passe incorrect.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #1a2744 50%, #0A1628 100%)" }}>
        <div className="text-center space-y-6 px-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl"
            style={{ backgroundColor: "rgba(197, 165, 114, 0.15)", border: "1px solid rgba(197, 165, 114, 0.3)" }}>
            <span className="text-3xl font-bold" style={{ color: "#C5A572" }}>L</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            La Loge
          </h1>
          <p className="text-lg text-gray-400 max-w-sm">
            Votre conciergerie digitale beauté.<br />
            L&apos;intelligence au service de vos salons.
          </p>
          <div className="flex items-center gap-8 pt-8 text-sm text-gray-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">3,822</p>
              <p>Salons analysés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#C5A572" }}>6</p>
              <p>Marques partenaires</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">9</p>
              <p>Agents IA actifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex w-full items-center justify-center lg:w-1/2 bg-background">
        <div className="w-full max-w-md space-y-8 px-6">
          {/* Mobile logo */}
          <div className="text-center lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
              style={{ backgroundColor: "rgba(197, 165, 114, 0.1)", border: "1px solid rgba(197, 165, 114, 0.2)" }}>
              <span className="text-xl font-bold" style={{ color: "#C5A572" }}>L</span>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">Connexion</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Accédez à votre espace La Loge
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full h-10"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full h-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10"
              disabled={loading}
              style={!loading ? { backgroundColor: "#C5A572", color: "white" } : undefined}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>Accès réservé aux équipes La Loge</p>
          </div>
        </div>
      </div>
    </div>
  );
}
