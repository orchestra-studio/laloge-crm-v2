import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/dashboard/login",
  "/dashboard/register",
  "/dashboard/forgot-password",
  "/api",
  "/_next",
  "/favicon.ico",
  "/images",
  "/logos",
  "/404.svg"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public/static paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Redirect root to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For now: allow all dashboard access without auth check
  // This lets the user see all pages immediately
  // TODO: Re-enable auth check once login is wired to Supabase
  let response = NextResponse.next({ request });

  // Only check auth if Supabase env vars are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    });

    // Refresh session (important for SSR)
    await supabase.auth.getUser();
  }

  return response;
}

export default middleware;

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*"
  ]
};
