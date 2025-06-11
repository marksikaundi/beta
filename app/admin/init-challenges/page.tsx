"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InitPage() {
  // Using the string format for the action to avoid TypeScript errors
  // This will work once the Convex types are generated
  const seedChallenges = useAction("seed_challenges:seed");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      const result = await seedChallenges();
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Initialize Coding Challenges</CardTitle>
          <CardDescription>
            Setup your platform with sample coding challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This will create sample coding challenges in your database. Use this
            to quickly set up your platform for testing or demonstration
            purposes.
          </p>

          <div className="text-sm text-muted-foreground mb-4 p-3 border rounded-md bg-muted/50">
            <p className="font-medium mb-1">Note:</p>
            <p>
              Make sure the Convex server is running with{" "}
              <code className="text-xs bg-background p-0.5 rounded">
                pnpx convex dev
              </code>{" "}
              in order for this initialization to work properly.
            </p>
          </div>

          {result && (
            <div
              className={`p-4 mb-4 rounded-lg ${
                result.success
                  ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400"
                  : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400"
              }`}
            >
              <div className="flex items-start">
                <div className="shrink-0 mr-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {result.success ? "Success" : "Error"}
                  </p>
                  <p className="text-sm mt-1">{result.message}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSeed} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>Initialize Sample Challenges</>
            )}
          </Button>
        </CardFooter>
        {result?.success && (
          <div className="px-6 pb-6">
            <div className="flex flex-col gap-3 items-center">
              <Button asChild variant="outline">
                <Link href="/challenges">
                  View Challenges <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/labs">Manage Challenges in Admin</Link>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
