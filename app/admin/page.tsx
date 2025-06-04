"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const { user } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<string>("");

  const createSampleLessons = useMutation(
    api.lessons.createSampleCodingLessons
  );
  const createSampleNotifications = useMutation(
    api.notifications.createSampleNotifications
  );
  const clearNotifications = useMutation(
    api.notifications.clearAllUserNotifications
  );
  const triggerTestLevelUp = useMutation(api.notifications.triggerTestLevelUp);
  const triggerTestAchievement = useMutation(
    api.notifications.triggerTestAchievement
  );

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

  const handleCreateSampleNotifications = async () => {
    if (!user) {
      setResult("Error: Please sign in to test notifications");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createSampleNotifications({ userId: user.id });
      setResult(`Success: ${result.message}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClearNotifications = async () => {
    if (!user) {
      setResult("Error: Please sign in to clear notifications");
      return;
    }

    setIsCreating(true);
    try {
      const result = await clearNotifications({ userId: user.id });
      setResult(`Success: ${result.message}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTriggerLevelUp = async () => {
    if (!user) {
      setResult("Error: Please sign in to test notifications");
      return;
    }

    setIsCreating(true);
    try {
      const result = await triggerTestLevelUp({ userId: user.id });
      setResult(`Success: ${result.message}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTriggerAchievement = async () => {
    if (!user) {
      setResult("Error: Please sign in to test notifications");
      return;
    }

    setIsCreating(true);
    try {
      const result = await triggerTestAchievement({ userId: user.id });
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
                <div
                  className={`p-3 rounded-md text-sm ${
                    result.startsWith("Success")
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {result}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification System Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={handleCreateSampleNotifications}
                  disabled={isCreating || !user}
                  className="w-full"
                  variant="secondary"
                >
                  {isCreating ? "Creating..." : "Create Sample Notifications"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Creates sample notifications to test the notification dropdown
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleClearNotifications}
                  disabled={isCreating || !user}
                  className="w-full"
                  variant="destructive"
                >
                  {isCreating ? "Clearing..." : "Clear All Notifications"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Removes all notifications for the current user
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleTriggerLevelUp}
                  disabled={isCreating || !user}
                  variant="outline"
                  size="sm"
                >
                  {isCreating ? "..." : "Test Level-Up"}
                </Button>
                <Button
                  onClick={handleTriggerAchievement}
                  disabled={isCreating || !user}
                  variant="outline"
                  size="sm"
                >
                  {isCreating ? "..." : "Test Achievement"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Test individual notification types
              </p>

              {!user && (
                <div className="p-3 rounded-md text-sm bg-yellow-100 text-yellow-800 border border-yellow-200">
                  Please sign in to test the notification system
                </div>
              )}

              {result && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    result.startsWith("Success")
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
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
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <a href="/tracks" target="_blank">
                  View All Tracks
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <a href="/dashboard" target="_blank">
                  View Dashboard
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <a href="/tracks/javascript-fundamentals" target="_blank">
                  View JavaScript Fundamentals Track
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              This admin panel is for development purposes only. In production,
              content would be managed through a proper CMS.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
