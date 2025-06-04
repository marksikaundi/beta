"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  BookOpen, 
  Trophy, 
  Clock, 
  CheckCircle,
  Code,
  PlayCircle,
  Target
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  activity?: Array<{
    type: "lesson_progress" | "achievement";
    timestamp: string;
    progress?: {
      _id: string;
      lessonId: string;
      status: string;
      score?: number;
      timeSpent: number;
    };
    lesson?: {
      _id: string;
      title: string;
      slug: string;
      type: string;
    } | null;
    track?: {
      _id: string;
      title: string;
      slug: string;
      color: string;
    } | null;
    achievement?: {
      _id: string;
      title: string;
      description: string;
      type: string;
      icon: string;
      color: string;
    };
  }> | null;
  isLoading: boolean;
}

function getActivityIcon(type: string, lessonType?: string) {
  switch (type) {
    case "achievement":
      return Trophy;
    case "lesson_progress":
      switch (lessonType) {
        case "coding":
          return Code;
        case "quiz":
          return Target;
        case "video":
          return PlayCircle;
        case "reading":
        default:
          return BookOpen;
      }
    default:
      return Activity;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "text-green-600";
    case "in-progress":
      return "text-blue-600";
    case "not-started":
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In Progress";
    case "not-started":
      return "Started";
    default:
      return status;
  }
}

export function RecentActivity({ activity, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activity || activity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No recent activity to show.
            </p>
            <p className="text-sm text-muted-foreground">
              Start learning to see your progress here!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activity.map((item, index) => {
              const Icon = getActivityIcon(item.type, item.lesson?.type);
              const isAchievement = item.type === "achievement";
              
              return (
                <div key={index} className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-full ${
                    isAchievement 
                      ? "bg-yellow-100" 
                      : item.track 
                        ? "bg-blue-100" 
                        : "bg-gray-100"
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      isAchievement 
                        ? "text-yellow-600" 
                        : item.track 
                          ? "text-blue-600" 
                          : "text-gray-600"
                    }`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {isAchievement && item.achievement ? (
                      <>
                        <p className="text-sm font-medium">
                          🏆 Achievement Unlocked: {item.achievement.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.achievement.description}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium">
                          {item.progress?.status === "completed" ? "Completed" : "Started"}{" "}
                          <Link 
                            href={`/tracks/${item.track?.slug}/lessons/${item.lesson?.slug}`}
                            className="text-blue-600 hover:underline"
                          >
                            {item.lesson?.title}
                          </Link>
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>in</span>
                          <Link 
                            href={`/tracks/${item.track?.slug}`}
                            className="text-blue-600 hover:underline"
                          >
                            {item.track?.title}
                          </Link>
                          {item.progress?.score && (
                            <>
                              <span>•</span>
                              <span>Score: {item.progress.score}%</span>
                            </>
                          )}
                          {item.progress?.timeSpent && (
                            <>
                              <span>•</span>
                              <span>{item.progress.timeSpent}m</span>
                            </>
                          )}
                        </div>
                      </>
                    )}
                    
                    {/* Status Badge */}
                    {item.progress && (
                      <div className="mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(item.progress.status)}`}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {getStatusText(item.progress.status)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
