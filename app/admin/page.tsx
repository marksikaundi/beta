"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<string>("");

  const createSampleLessons = useMutation(api.lessons.createSampleCodingLessons);
  const createSampleTracks = useMutation(api.tracks.createSampleTracks);

  const handleCreateSampleLessons = async () => {
    setIsCreating(true);
    try {
      const result = await createSampleLessons({});
      setResult(`Success: ${result.message}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateSampleTracks = async () => {
    setIsCreating(true);
    try {
      const result = await createSampleTracks({});
      setResult(`Success: ${result.message}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <MainNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
            <p className="text-muted-foreground">
              Development tools for setting up sample data
            </p>
            <Badge variant="destructive" className="mt-2">
              Development Only
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sample Data Creation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  onClick={handleCreateSampleTracks}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? "Creating..." : "Create Sample Tracks"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Creates sample learning tracks if they don't exist
                </p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleCreateSampleLessons}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? "Creating..." : "Create Sample Coding Lessons"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Creates sample coding lessons with interactive challenges
                </p>
              </div>

              {result && (
                <div className={`p-3 rounded-md text-sm ${
                  result.startsWith("Success") 
                    ? "bg-green-100 text-green-800 border border-green-200" 
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}>
                  {result}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" asChild className="w-full justify-start">
                <a href="/tracks" target="_blank">
                  View All Tracks
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <a href="/dashboard" target="_blank">
                  View Dashboard
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <a href="/tracks/javascript-fundamentals" target="_blank">
                  View JavaScript Fundamentals Track
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              This admin panel is for development purposes only. 
              In production, content would be managed through a proper CMS.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
