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
      <aside className="hidden md:flex md:flex-col md:w-72 md:fixed md:inset-y-0">
        <div className="flex flex-col h-full bg-card/50 backdrop-filter backdrop-blur-sm border-r border-border/40">
          <div className="flex h-16 items-center gap-x-3 border-b border-border/40 px-6">
            <Layout className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>

          <nav className="flex-1 space-y-1 p-4">
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
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground/90 hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors duration-150",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground/70 group-hover:text-foreground"
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-72">
        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
