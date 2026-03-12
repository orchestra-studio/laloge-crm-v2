import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/dashboard/login/v1",
  "/dashboard/login/v2",
  "/dashboard/register/v1",
  "/dashboard/register/v2",
  "/dashboard/forgot-password"
];

const PROTECTED_PATH_PREFIXES = [
  "/",
  "/dashboard",
  "/salons",
  "/brands",
  "/contacts",
  "/pipeline",
  "/outreach",
  "/actions",
  "/agents",
  "/dossiers",
  "/reports",
  "/settings",
  "/notifications",
  "/profile",
  "/users"
];

function matchesPath(pathname: string, route: string) {
  if (route === "/") {
    return pathname === route;
  }

  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((route) => matchesPath(pathname, route));
  const isProtectedPath = PROTECTED_PATH_PREFIXES.some((route) => matchesPath(pathname, route));

  if (!isPublicPath && !isProtectedPath) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath && !isPublicPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard/login/v1";
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isPublicPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export default middleware;

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/salons/:path*",
    "/brands/:path*",
    "/contacts/:path*",
    "/pipeline/:path*",
    "/outreach/:path*",
    "/actions/:path*",
    "/agents/:path*",
    "/dossiers/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/users/:path*"
  ]
};
