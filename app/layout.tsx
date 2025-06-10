import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";
import { Toaster } from "sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Lupleg - Master Backend Development",
  description:
    "Learn backend development through interactive courses and real-world projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={fontSans.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <div className="relative min-h-screen bg-background">
                {/* Navigation */}
                <Header />

                {/* Main Content */}
                <main className="relative z-10 pb-20">{children}</main>

                {/* Modern Grid Pattern */}
                <div
                  className="fixed inset-0 -z-20 h-full w-full opacity-[0.02]"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #808080 1px, transparent 1px),
                      linear-gradient(to bottom, #808080 1px, transparent 1px)
                    `,
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Gradient Atmosphere */}
                <div className="fixed inset-0 -z-10">
                  <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-primary/5 via-primary/2 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-background via-background/90 to-transparent" />
                </div>

                {/* Footer */}
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
