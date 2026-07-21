import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider } from "jotai";
import { type ReactNode, Suspense } from "react";
import { AuthProvider } from "@/components/auth/provider";
import { GitHubStarsLoader } from "@/components/github-stars-loader";
import { GitHubStarsProvider } from "@/components/github-stars-provider";
import { GlobalModals } from "@/components/global-modals";
import { OverlayProvider } from "@/components/overlays/overlay-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/shared/ui/sonner";
import { AppShell } from "@/components/app-shell";
import { mono, sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";


export const metadata: Metadata = {
  title: "AI Workflow Builder - Visual Workflow Automation",
  description:
    "Build powerful AI-driven workflow automations with a visual, node-based editor. Built with Next.js and React Flow.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body className={cn(sans.variable, mono.variable, "antialiased")}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        enableSystem={false}
      >
        <Provider>
          <AuthProvider>
            <OverlayProvider>
              <Suspense
                fallback={
                  <GitHubStarsProvider stars={null}>
                    <AppShell>{children}</AppShell>
                  </GitHubStarsProvider>
                }
              >
                <GitHubStarsLoader>
                  <AppShell>{children}</AppShell>
                </GitHubStarsLoader>
              </Suspense>
              <Toaster />
              <GlobalModals />
            </OverlayProvider>
          </AuthProvider>
        </Provider>
      </ThemeProvider>
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
