// filepath: /Users/marksikaundi/Documents/progress/101/beta/components/footer.tsx
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    links: [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Tracks", href: "/tracks" },
      { title: "Community", href: "/community" },
      { title: "Leaderboard", href: "/leaderboard" },
      { title: "Labs", href: "/lab" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Documentation", href: "/docs" },
      { title: "API Reference", href: "/api" },
      { title: "Tutorials", href: "/tutorials" },
      { title: "Blog", href: "/blog" },
      { title: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" },
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
    ],
  },
];

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-background border-t", className)}>
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight">Lupleg</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Master backend development with hands-on projects, interactive
              coding challenges, and structured learning paths.
            </p>
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, index) => (
                <Button key={index} variant="ghost" size="icon" asChild>
                  <Link href={social.href} aria-label={social.label}>
                    {social.icon}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {navigationLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-medium">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Lupleg. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-4 md:mt-0">
            Designed and developed by Mark Sikaundi
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
