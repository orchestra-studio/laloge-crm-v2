import React from "react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { fontVariables } from "@/lib/fonts";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn("bg-background font-sans", fontVariables)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange>
          {children}
          <Toaster position="top-center" richColors />
          <NextTopLoader color="var(--primary)" showSpinner={false} height={2} />
        </ThemeProvider>
      </body>
    </html>
  );
}
