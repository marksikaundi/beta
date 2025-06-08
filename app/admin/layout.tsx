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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-72 md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-[64px] shrink-0 items-center border-b border-border/40 px-8">
            <h1 className="text-lg font-semibold tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <nav className="flex-1 px-6 py-6">
              <div className="space-y-0.5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "text-muted-foreground/90 hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground/70 group-hover:text-foreground/70"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-72">
        <main className="flex-1 px-8 py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
