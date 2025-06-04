"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Clock,
  Trophy,
  Target,
} from "lucide-react";

interface DashboardStatsProps {
  stats?: {
    tracksEnrolled: number;
    tracksCompleted: number;
    lessonsCompleted: number;
    totalTimeSpent: number;
    achievements: number;
    currentStreak: number;
  } | null;
  isLoading: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Lessons Completed",
      value: stats?.lessonsCompleted || 0,
      description: `${stats?.tracksEnrolled || 0} tracks enrolled`,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Study Time",
      value: `${Math.floor((stats?.totalTimeSpent || 0) / 60)}h ${
        (stats?.totalTimeSpent || 0) % 60
      }m`,
      description: "Total learning time",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Current Streak",
      value: `${stats?.currentStreak || 0} days`,
      description: "Keep it going!",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Achievements",
      value: stats?.achievements || 0,
      description: `${stats?.tracksCompleted || 0} tracks completed`,
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="learning-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
