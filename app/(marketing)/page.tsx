"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const features = [
  "Real-world backend projects",
  "Interactive coding challenges",
  "Python, Go, SQL & more",
  "Professional certifications",
  "Career-focused curriculum",
  "Active learning community",
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">
                LearnDev
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/courses"
                className="text-gray-600 hover:text-gray-900"
              >
                Courses
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Learn Backend Development
              <br />
              <span className="text-blue-600">The Right Way</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Master backend development through hands-on projects and
              structured learning paths. Build real-world applications while
              learning Python, Go, SQL, and more.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="text-lg">
                  View Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Everything you need to become a backend developer
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Our comprehensive curriculum is designed by industry experts to
                help you master the skills that matter most in backend
                development.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl bg-gray-900/5 p-8">
                <div className="w-full h-full bg-white rounded-lg shadow-2xl">
                  {/* You can add a code example or screenshot here */}
                  <div className="p-6">
                    <pre className="text-sm text-gray-800">
                      <code>{`def process_payment(amount: float) -> bool:
    """Process a payment transaction"""
    try:
        # Validate amount
        if amount <= 0:
            raise ValueError("Amount must be positive")
            
        # Process payment logic here
        return True
    except Exception as e:
        logging.error(f"Payment failed: {str(e)}")
        return False`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to start your journey?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of developers who have already taken the first
              step.
            </p>
            <div className="mt-8">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/courses"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-gray-500 text-center">
              © {new Date().getFullYear()} LearnDev. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
