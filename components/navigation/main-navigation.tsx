"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    authRequired: true,
  },
  {
    name: "Tracks",
    href: "/tracks",
    icon: BookOpen,
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
  {
    name: "Progress",
    href: "/progress",
    icon: TrendingUp,
    authRequired: true,
  },
];

export function MainNavigation() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredItems = navigationItems.filter(item => 
    !item.authRequired || isSignedIn
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">DevLearn</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Streak indicator for signed-in users */}
            {isSignedIn && (
              <div className="hidden sm:flex items-center space-x-1 text-sm">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="font-medium">0</span>
                <span className="text-muted-foreground">day streak</span>
              </div>
            )}

            {/* Premium badge */}
            <Badge variant="outline" className="hidden sm:inline-flex">
              <GraduationCap className="h-3 w-3 mr-1" />
              Free
            </Badge>

            {/* Auth buttons */}
            {isLoaded && (
              <div className="flex items-center space-x-2">
                {isSignedIn ? (
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8"
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <Button size="sm">
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
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Mobile user info */}
                  {isSignedIn && (
                    <div className="flex items-center space-x-3 p-4 bg-accent rounded-lg">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "h-10 w-10"
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Welcome back!</p>
                        <p className="text-xs text-muted-foreground">Level 1 • 0 XP</p>
                      </div>
                    </div>
                  )}

                  {/* Mobile navigation */}
                  <nav className="flex flex-col space-y-2">
                    {filteredItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || 
                        (item.href !== "/" && pathname.startsWith(item.href));
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile auth section */}
                  {!isSignedIn && (
                    <div className="border-t pt-4 space-y-2">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignInButton mode="modal">
                        <Button className="w-full">
                          Get Started Free
                        </Button>
                      </SignInButton>
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
