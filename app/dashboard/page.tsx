"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ContinueLearning } from "@/components/dashboard/continue-learning";
import { StudyStreak } from "@/components/dashboard/study-streak";
import { RecommendedTracks } from "@/components/dashboard/recommended-tracks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const userStats = useQuery(
    api.users.getUserStats,
    user ? { clerkId: user.id } : "skip"
  );

  const recentActivity = useQuery(
    api.progress.getRecentActivity,
    user ? { clerkId: user.id, limit: 5 } : "skip"
  );

  const enrollments = useQuery(
    api.tracks.getUserEnrollments,
    user ? { clerkId: user.id } : "skip"
  );

  if (!isLoaded || !user) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  const isNewUser = !userStats?.stats || userStats.stats.lessonsCompleted === 0;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">
              Welcome back, {user.firstName || user.username}! 👋
            </h1>
            <p className="text-muted-foreground">
              {isNewUser
                ? "Ready to start your learning journey? Pick a track below to begin!"
                : "Continue where you left off and keep building your skills."}
            </p>
          </div>

          {/* New User Welcome */}
          {isNewUser && (
            <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                <strong>Welcome to Lupleg!</strong> Start with our Backend
                Fundamentals track to build a solid foundation, or explore all
                available tracks to find what interests you most.
              </AlertDescription>
            </Alert>
          )}

          {/* Dashboard Stats */}
          <DashboardStats stats={userStats?.stats} isLoading={!userStats} />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Continue Learning */}
              <ContinueLearning
                enrollments={enrollments}
                isLoading={!enrollments}
              />

              {/* Recent Activity */}
              <RecentActivity
                activity={recentActivity}
                isLoading={!recentActivity}
              />
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-6">
              {/* Study Streak */}
              <StudyStreak
                streakDays={userStats?.user?.streakDays || 0}
                isLoading={!userStats}
              />

              {/* Recommended Tracks */}
              <RecommendedTracks />

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Level</span>
                    <span className="font-medium">
                      {userStats?.user?.level || 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Experience
                    </span>
                    <span className="font-medium">
                      {userStats?.user?.experience || 0} XP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rank</span>
                    <span className="font-medium">Beginner</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Subscription
                    </span>
                    <span className="font-medium capitalize">
                      {userStats?.user?.subscriptionTier || "Free"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
