"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Trophy, User, BarChart, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "My Courses",
    href: "/dashboard",
    icon: BookOpen,
  },
  {
    title: "Lessons",
    href: "/dashboard/lessons",
    icon: BarChart,
  },
  {
    title: "Achievements",
    href: "/dashboard/achievements",
    icon: Trophy,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50/40">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          LearnDev
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid items-start px-4 text-sm">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 hover:bg-gray-100",
                  pathname === item.href ? "bg-gray-100 font-medium" : ""
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
