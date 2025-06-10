"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code2,
  Play,
  CheckCircle,
  Users,
  Trophy,
  Zap,
  ArrowRight,
  Star,
  BookOpen,
  Target,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Interactive Coding",
    description:
      "Write and run code directly in your browser with instant feedback",
  },
  {
    icon: Target,
    title: "Project-Based Learning",
    description:
      "Build real-world projects that showcase your skills to employers",
  },
  {
    icon: Trophy,
    title: "Gamified Progress",
    description: "Earn XP, unlock achievements, and climb the leaderboards",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Get help from peers and mentors in our active community",
  },
];

const stats = [
  { label: "Active Learners", value: "50,000+" },
  { label: "Coding Challenges", value: "500+" },
  { label: "Success Rate", value: "94%" },
  { label: "Career Transitions", value: "10,000+" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Backend Developer at Google",
    content:
      "Lupleg's hands-on approach helped me transition from frontend to backend development in just 6 months.",
    avatar: "SC",
  },
  {
    name: "Mike Rodriguez",
    role: "Senior Engineer at Microsoft",
    content:
      "The progressive difficulty and real-world projects made learning backend concepts intuitive and engaging.",
    avatar: "MR",
  },
  {
    name: "Emily Johnson",
    role: "Full-Stack Developer",
    content:
      "I love the gamified experience. The XP system and achievements kept me motivated throughout my learning journey.",
    avatar: "EJ",
  },
];

export function HeroSection() {
  const { isSignedIn } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#00DC82_0%,#36E4DA_50%,#0047E1_100%)] opacity-5" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Main Hero */}
      <section className="relative pt-24 pb-20 px-4">
        <div className="enterprise-layout">
          {/* Badge */}
          <div className="flex justify-center mb-8 fade-in">
            <Badge
              variant="secondary"
              className="px-4 py-2 enterprise-glass gap-2 text-sm"
            >
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>New: Advanced Go Programming Track Available</span>
            </Badge>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto slide-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Master{" "}
              <span className="enterprise-gradient">Backend Development</span>{" "}
              Like a Pro
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Industry-leading curriculum designed by experts. Build real-world
              projects and advance your career with enterprise-grade learning
              paths.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                  <Play className="h-5 w-5 mr-2" />
                  Start Learning Free
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg rounded-full enterprise-glass"
                asChild
              >
                <Link href="/tracks">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explore Tracks
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-20">
              <div className="flex items-center justify-center gap-2 enterprise-glass rounded-2xl p-4">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center justify-center gap-2 enterprise-glass rounded-2xl p-4">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm">Learn at your own pace</span>
              </div>
              <div className="flex items-center justify-center gap-2 enterprise-glass rounded-2xl p-4">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-sm">4.9/5 from 10,000+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="enterprise-layout">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Enterprise-Grade Learning Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive curriculum combining theory and practice, designed
              to accelerate your career growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="enterprise-card p-6 scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="enterprise-layout">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Trusted by Leading Developers
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of successful developers who transformed their
                careers with Lupleg
              </p>
            </div>

            <div className="enterprise-card p-8 md:p-12">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary fill-current" />
                ))}
              </div>

              <blockquote className="text-lg md:text-xl mb-8 text-center italic text-muted-foreground">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              <div className="flex items-center justify-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <div className="font-semibold">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      index === currentTestimonial
                        ? "bg-primary"
                        : "bg-primary/20 hover:bg-primary/40"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="enterprise-layout text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join our community of professional developers and start building
            enterprise-grade skills today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg rounded-full bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg rounded-full border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/tracks">View Learning Paths</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
