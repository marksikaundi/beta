"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileText,
  GraduationCap,
  Settings,
  Book,
  Layout,
  Code,
  BookOpenCheck,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Layout,
  },
  {
    name: "Labs",
    href: "/admin/labs",
    icon: Code,
  },
  {
    name: "Tracks",
    href: "/admin/tracks",
    icon: Book,
  },
  {
    name: "Lessons",
    href: "/admin/lessons",
    icon: GraduationCap,
  },
  {
    name: "Changelog",
    href: "/admin/changelog",
    icon: FileText,
  },
];

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation Trigger */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <SheetHeader className="border-b border-border/40 px-6 py-4">
                  <SheetTitle className="flex items-center gap-x-2">
                    <Layout className="h-5 w-5 text-primary" />
                    <span>Navigation Menu</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-1 overflow-y-auto">
                  <div className="space-y-1 p-4">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors duration-150",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                            aria-hidden="true"
                          />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-x-2">
              <Layout className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-x-4">
            {/* Add any header actions here if needed */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-screen-2xl py-6">{children}</main>
    </div>
  );
}
