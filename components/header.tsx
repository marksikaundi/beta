"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Code2,
  Menu,
  BookOpen,
  Trophy,
  Users,
  TrendingUp,
  Zap,
  GraduationCap,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "./navigation/notifications-dropdown";
import { SystemStatusWidget } from "./system-status-widget";
import { ProfileDropdown } from "./navigation/profile-dropdown";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    authRequired: true,
  },
  {
    name: "Challenges",
    href: "/challenges",
    icon: Code2,
    description: "Coding challenges & problems",
  },
  {
    name: "Lab",
    href: "/lab",
    icon: Zap,
    description: "Interactive courses & lessons",
  },
  {
    name: "Tracks",
    href: "/tracks",
    icon: BookOpen,
    description: "Learning paths & roadmaps",
  },
  {
    name: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    name: "Community",
    href: "/community",
    icon: Users,
  },
  // {
  //   name: "Status",
  //   href: "/changelog",
  //   icon: TrendingUp,
  //   description: "Platform status & updates",
  // },
];

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredItems = navigationItems.filter(
    (item) => !item.authRequired || isSignedIn
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="enterprise-layout">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary transition-all duration-200 group-hover:shadow-lg">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold enterprise-gradient">
              Lupleg
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`enterprise-nav-item flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-active={isActive}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="hidden md:block">
              <SystemStatusWidget />
            </div>

            {/* Streak indicator for signed-in users */}
            {isSignedIn && (
              <div className="hidden sm:flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Zap className="h-4 w-4" />
                <span className="font-medium">0</span>
                <span>day streak</span>
              </div>
            )}

            {/* Notifications for signed-in users */}
            {isSignedIn && <NotificationsDropdown />}

            {/* Premium badge */}
            <Badge
              variant="outline"
              className="hidden sm:inline-flex enterprise-glass border-primary/20"
            >
              <GraduationCap className="h-3 w-3 mr-1 text-primary" />
              Free
            </Badge>

            {/* Auth buttons */}
            {isLoaded && (
              <div className="flex items-center space-x-2">
                {isSignedIn ? (
                  <ProfileDropdown />
                ) : (
                  <div className="flex items-center space-x-2">
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full hover:bg-secondary"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <Button
                        size="sm"
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Get Started
                      </Button>
                    </SignInButton>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" className="rounded-lg">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full bg-background">
                  <div className="p-6 border-b">
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Code2 className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-semibold enterprise-gradient">
                        Lupleg
                      </span>
                    </Link>
                  </div>

                  <div className="flex-1 overflow-auto py-6 px-4">
                    {/* Mobile user info */}
                    {isSignedIn && (
                      <div className="mb-6">
                        <div className="flex items-center space-x-3 p-4 rounded-lg enterprise-glass">
                          <UserButton
                            appearance={{
                              elements: {
                                avatarBox: "h-10 w-10",
                              },
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Welcome back!</p>
                            <p className="text-xs text-muted-foreground">
                              Level 1 • 0 XP
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mobile navigation */}
                    <nav className="flex flex-col space-y-1">
                      {filteredItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                          pathname === item.href ||
                          (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Mobile auth section */}
                  {!isSignedIn && (
                    <div className="p-6 border-t bg-muted/50">
                      <div className="space-y-3">
                        <SignInButton mode="modal">
                          <Button
                            variant="outline"
                            className="w-full rounded-full"
                          >
                            Sign In
                          </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                          <Button className="w-full rounded-full bg-primary text-primary-foreground">
                            Get Started Free
                          </Button>
                        </SignInButton>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
