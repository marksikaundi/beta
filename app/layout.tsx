import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lupleg - Master Backend Development",
  description:
    "Master backend development with hands-on projects, interactive coding challenges, and structured learning paths. Learn programming like a pro.",
  keywords: [
    "backend development",
    "programming",
    "coding",
    "learn to code",
    "software engineering",
  ],
  authors: [{ name: "Mark Sikaundi" }],
  openGraph: {
    title: "Lupleg - Master Backend Development",
    description:
      "Master backend development with hands-on projects and structured learning paths.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <div className="flex min-h-screen flex-col">
                {children}
                <Footer />
              </div>
              <Toaster />
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
