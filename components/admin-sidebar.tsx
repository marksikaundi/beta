"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, BookOpen, Award, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Achievements",
    href: "/admin/achievements",
    icon: Award,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center gap-2 px-6">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Home className="h-6 w-6" />
          <span className="text-lg font-bold">LearnDev</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid items-start px-4 text-sm">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white",
                  pathname === item.href ? "bg-gray-800 text-white" : ""
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-800 p-4">
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
