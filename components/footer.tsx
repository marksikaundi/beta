"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Code2,
  BookOpen,
  Trophy,
  Users,
  GraduationCap,
  FileText,
  Briefcase,
  Phone,
  Shield,
  Scroll,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const socialLinks = [
  {
    icon: <Github className="h-5 w-5" />,
    href: "https://github.com/lupleg",
    label: "GitHub",
  },
  {
    icon: <Twitter className="h-5 w-5" />,
    href: "https://twitter.com/lupleg",
    label: "Twitter",
  },
  {
    icon: <Facebook className="h-5 w-5" />,
    href: "https://facebook.com/lupleg",
    label: "Facebook",
  },
  {
    icon: <Instagram className="h-5 w-5" />,
    href: "https://instagram.com/lupleg",
    label: "Instagram",
  },
  {
    icon: <Linkedin className="h-5 w-5" />,
    href: "https://linkedin.com/company/lupleg",
    label: "LinkedIn",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    href: "mailto:contact@lupleg.com",
    label: "Email",
  },
];

const navigationLinks = [
  {
    title: "Platform",
    icon: Code2,
    links: [
      { title: "Dashboard", href: "/dashboard", icon: BookOpen },
      { title: "Tracks", href: "/tracks", icon: BookOpen },
      { title: "Community", href: "/community", icon: Users },
      { title: "Leaderboard", href: "/leaderboard", icon: Trophy },
      { title: "Lab", href: "/lab", icon: Code2 },
    ],
  },
  {
    title: "Resources",
    icon: FileText,
    links: [
      { title: "Documentation", href: "/docs", icon: FileText },
      { title: "API Reference", href: "/api", icon: Code2 },
      { title: "Tutorials", href: "/tutorials", icon: GraduationCap },
      { title: "Blog", href: "/blog", icon: FileText },
      { title: "Changelog", href: "/changelog", icon: Scroll },
    ],
  },
  {
    title: "Company",
    icon: Briefcase,
    links: [
      { title: "About", href: "/about", icon: Briefcase },
      { title: "Careers", href: "/careers", icon: Briefcase },
      { title: "Contact", href: "/contact", icon: Phone },
      { title: "Privacy", href: "/privacy", icon: Shield },
      { title: "Terms", href: "/terms", icon: Scroll },
    ],
  },
];

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t", className)}>
      <div className="container mx-auto px-4">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Code2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Lupleg</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Master backend development with hands-on projects, interactive
                coding challenges, and structured learning paths.
              </p>
              
              {/* Status Badge */}
              <Badge variant="outline" className="w-fit">
                <GraduationCap className="h-3 w-3 mr-1" />
                Free Platform
              </Badge>

              {/* Social Links */}
              <div className="flex items-center space-x-2">
                {socialLinks.map((social, index) => (
                  <Button key={index} variant="ghost" size="icon" asChild>
                    <Link href={social.href} aria-label={social.label}>
                      {social.icon}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* Navigation Sections */}
            {navigationLinks.map((section, index) => {
              const SectionIcon = section.icon;
              return (
                <div key={index} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <SectionIcon className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => {
                      const LinkIcon = link.icon;
                      return (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                          >
                            <LinkIcon className="h-3 w-3 group-hover:text-primary transition-colors" />
                            <span>{link.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <Separator className="my-8" />

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Lupleg. All rights reserved.
              </p>
              <div className="hidden md:block w-px h-4 bg-border"></div>
              <p className="text-xs text-muted-foreground">
                Designed and developed by Mark Sikaundi
              </p>
            </div>
            
            {/* Additional footer actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/contact" className="text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  Support
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/changelog" className="text-xs">
                  <Scroll className="h-3 w-3 mr-1" />
                  Updates
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
