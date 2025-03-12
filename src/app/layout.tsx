import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ProfileProvider } from "@/components/providers/profile-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { MainContent } from "@/components/layout/main-content";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Based App",
  description: "A Slack-like chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLandingPage = false; // In a real app, we'd detect landing/auth pages

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProfileProvider>
            {isLandingPage ? (
              children
            ) : (
              <div className="flex h-screen flex-col md:flex-row">
                {/* Desktop Sidebar - hidden on mobile */}
                <div className="hidden md:block md:w-64">
                  <Sidebar />
                </div>
                
                {/* Mobile Navigation - hidden on desktop */}
                <div className="md:hidden">
                  <MobileNav />
                </div>
                
                {/* Main Content */}
                <MainContent>
                  {children}
                </MainContent>
                
                {/* Mobile Channel/DM Sidebar - floating button + drawer */}
                <MobileSidebar />
              </div>
            )}
            <Toaster />
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
