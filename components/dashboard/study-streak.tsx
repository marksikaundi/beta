"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Target, TrendingUp, Zap } from "lucide-react";

interface StudyStreakProps {
  streakDays: number;
  isLoading: boolean;
  studyStats?: {
    currentStreak: number;
    longestStreak: number;
    totalStudyDays: number;
    weeklyGoal?: number;
    weeklyProgress?: number;
  };
}

function getStreakColor(days: number) {
  if (days >= 30) return "text-purple-600";
  if (days >= 14) return "text-orange-600";
  if (days >= 7) return "text-yellow-600";
  if (days >= 3) return "text-blue-600";
  return "text-gray-600";
}

function getStreakBadge(days: number) {
  if (days >= 30)
    return { label: "Legendary", color: "bg-purple-100 text-purple-800" };
  if (days >= 14)
    return { label: "Amazing", color: "bg-orange-100 text-orange-800" };
  if (days >= 7)
    return { label: "Great", color: "bg-yellow-100 text-yellow-800" };
  if (days >= 3) return { label: "Good", color: "bg-blue-100 text-blue-800" };
  return { label: "Getting Started", color: "bg-gray-100 text-gray-800" };
}

function getMotivationalMessage(days: number) {
  if (days === 0) return "Start your learning journey today!";
  if (days === 1) return "Great start! Keep the momentum going.";
  if (days < 7) return "You're building a habit! Keep it up.";
  if (days < 14) return "Excellent consistency! You're on fire! 🔥";
  if (days < 30) return "Incredible dedication! You're a learning machine! ⚡";
  return "Legendary streak! You're unstoppable! 🚀";
}

export function StudyStreak({
  streakDays,
  isLoading,
  studyStats,
}: StudyStreakProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-2" />
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const streak = studyStats?.currentStreak ?? streakDays;
  const longestStreak = studyStats?.longestStreak ?? streak;
  const totalDays = studyStats?.totalStudyDays ?? Math.max(streak, 1);
  const weeklyGoal = studyStats?.weeklyGoal ?? 5; // Default to 5 days per week
  const weeklyProgress = studyStats?.weeklyProgress ?? Math.min(streak, 7);

  const weeklyPercentage = Math.round((weeklyProgress / weeklyGoal) * 100);
  const streakBadge = getStreakBadge(streak);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flame className={`h-5 w-5 mr-2 ${getStreakColor(streak)}`} />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getStreakColor(streak)} mb-2`}>
            {streak}
          </div>
          <div className="text-sm text-muted-foreground mb-3">
            {streak === 1 ? "day" : "days"} in a row
          </div>
          <Badge className={streakBadge.color}>{streakBadge.label}</Badge>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-3 bg-accent/30 rounded-lg">
          <p className="text-sm font-medium text-accent-foreground">
            {getMotivationalMessage(streak)}
          </p>
        </div>

        {/* Weekly Goal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Weekly Goal
            </span>
            <span className="font-medium">
              {weeklyProgress}/{weeklyGoal} days
            </span>
          </div>
          <Progress value={weeklyPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {weeklyPercentage >= 100
              ? "🎉 Weekly goal achieved!"
              : `${Math.max(
                  0,
                  weeklyGoal - weeklyProgress
                )} more days to reach your weekly goal`}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold">{totalDays}</div>
            <div className="text-xs text-muted-foreground">Total Days</div>
          </div>
        </div>

        {/* Next Milestone */}
        {streak < 30 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Next Milestone
              </span>
            </div>
            {streak < 3 && (
              <div className="text-xs text-muted-foreground">
                📊 Reach 3 days to unlock "Good" badge
              </div>
            )}
            {streak >= 3 && streak < 7 && (
              <div className="text-xs text-muted-foreground">
                🔥 Reach 7 days to unlock "Great" badge
              </div>
            )}
            {streak >= 7 && streak < 14 && (
              <div className="text-xs text-muted-foreground">
                ⭐ Reach 14 days to unlock "Amazing" badge
              </div>
            )}
            {streak >= 14 && streak < 30 && (
              <div className="text-xs text-muted-foreground">
                👑 Reach 30 days to unlock "Legendary" badge
              </div>
            )}
          </div>
        )}

        {/* Streak Tips */}
        {streak === 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Streak Tips
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Study for at least 15 minutes daily</li>
              <li>• Set a consistent study time</li>
              <li>• Start with easier lessons</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
