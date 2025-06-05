"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Moon, Sun, Menu, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    // Check localStorage first
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === "true");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
    }

    // Apply dark mode if needed
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", newValue.toString());
      return newValue;
    });
  };

  // Handle menu item click
  const handleMenuItemClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center ml-16">
          <Link href="/" className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">Lupleg</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 mr-4">
        <Link
            href="/features"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/app"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            App
          </Link>

          <Link
            href="/view-badges"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
          >
            Badges
          </Link>

          <div className=" flex items-center gap-4 ">
            <SignedIn>
              <Link className="mr-4" href="/tasks">
                Tasks
              </Link>
              <Link className="mr-4" href="/reports">
                Reports
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="mr-4 bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text cursor-pointer "
                >
                  Dashboard
                </Button>
              </Link>

              <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full border bg-blue-100 border-blue-200 ">
                <UserButton />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text "
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5  " />
            ) : (
              <Moon className="h-5 w-5 " />
            )}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                <div className="border-b p-4">
                  <div className="flex items-center gap-2">
                    <Code className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">Lupleg</span>
                  </div>
                </div>

                <nav className="flex flex-col p-4 flex-1">
                  <Link
                    href="/app"
                    className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                    onClick={handleMenuItemClick}
                  >
                    <span className="font-medium">App</span>
                  </Link>

                  <Link
                    href="/view-badges"
                    className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                    onClick={handleMenuItemClick}
                  >
                    <span className="font-medium">Badges</span>
                  </Link>
                  <Link
                    href="/reports"
                    className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                    onClick={handleMenuItemClick}
                  >
                    <span className="font-medium">Reports</span>
                  </Link>
                  <Link
                    href="/tasks"
                    className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                    onClick={handleMenuItemClick}
                  >
                    <span className="font-medium">Tasks</span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}