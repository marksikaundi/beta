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
  Clock
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Interactive Coding",
    description: "Write and run code directly in your browser with instant feedback",
  },
  {
    icon: Target,
    title: "Project-Based Learning",
    description: "Build real-world projects that showcase your skills to employers",
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
    content: "DevLearn's hands-on approach helped me transition from frontend to backend development in just 6 months.",
    avatar: "SC",
  },
  {
    name: "Mike Rodriguez",
    role: "Senior Engineer at Microsoft",
    content: "The progressive difficulty and real-world projects made learning backend concepts intuitive and engaging.",
    avatar: "MR",
  },
  {
    name: "Emily Johnson",
    role: "Full-Stack Developer",
    content: "I love the gamified experience. The XP system and achievements kept me motivated throughout my learning journey.",
    avatar: "EJ",
  },
];

export function HeroSection() {
  const { isSignedIn } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <div className="relative">
      {/* Main Hero */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Zap className="h-3 w-3 mr-2" />
            New: Advanced Go Programming Track Available
          </Badge>

          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Master{" "}
            <span className="text-gradient">Backend Development</span>{" "}
            Like a Pro
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Learn programming through hands-on projects, interactive coding challenges, 
            and real-world scenarios. Join thousands of developers advancing their careers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                <Play className="h-5 w-5 mr-2" />
                Start Learning Free
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/tracks">
                <BookOpen className="h-5 w-5 mr-2" />
                Explore Tracks
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground mb-16">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Learn at your own pace
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              4.9/5 from 10,000+ reviews
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose DevLearn?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine the best of interactive learning, real-world projects, 
              and community support to accelerate your growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="learning-card border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Developers Worldwide
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of successful developers who transformed their careers with DevLearn
          </p>

          <Card className="p-8 md:p-12">
            <CardContent className="p-0">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>

              {/* Testimonial navigation */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentTestimonial ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of learners and start building your backend development skills today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6"
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
              className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/tracks">
                View All Tracks
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
