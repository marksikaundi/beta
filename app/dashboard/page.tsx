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
import { BookOpen, TrendingUp, Target, Code2, Trophy } from "lucide-react";

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
      <div className="modern-container py-8 animate-fade-in">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isNewUser = !userStats?.stats || userStats.stats.lessonsCompleted === 0;

  return (
    <div className="min-h-screen">
      <div className="modern-container py-8 animate-fade-in">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-bold tracking-tight gradient-text">
              Welcome back, {user.firstName || user.username}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              {isNewUser
                ? "Ready to start your learning journey? Pick a track below to begin!"
                : "Continue where you left off and keep building your skills."}
            </p>
          </div>

          {/* New User Welcome */}
          {isNewUser && (
            <Alert className="glass-bg border-primary/20">
              <BookOpen className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground/90">
                <strong>Welcome to Lupleg!</strong> Start with our Backend
                Fundamentals track to build a solid foundation, or explore all
                available tracks to find what interests you most.
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                icon: Code2,
                label: "Lessons Completed",
                value: userStats?.stats?.lessonsCompleted || 0,
              },
              {
                icon: Target,
                label: "Current Level",
                value: userStats?.user?.level || 1,
              },
              {
                icon: Trophy,
                label: "XP Earned",
                value: userStats?.user?.experience || 0,
              },
              {
                icon: TrendingUp,
                label: "Day Streak",
                value: userStats?.user?.streakDays || 0,
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="modern-card animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-md bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Continue Learning</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContinueLearning
                    enrollments={enrollments}
                    isLoading={!enrollments}
                  />
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentActivity
                    activity={recentActivity}
                    isLoading={!recentActivity}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="modern-card">
                <CardContent className="p-6">
                  <StudyStreak
                    streakDays={userStats?.user?.streakDays || 0}
                    isLoading={!userStats}
                  />
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardContent className="p-6">
                  <RecommendedTracks />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
