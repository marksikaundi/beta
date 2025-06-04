"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, BookOpen, ArrowRight } from "lucide-react";

interface ContinueLearningProps {
  enrollments?: Array<{
    enrollment: {
      progress: number;
      currentLessonId?: string;
      lastStudiedAt: string;
    };
    track: {
      _id: string;
      title: string;
      slug: string;
      description: string;
      thumbnail: string;
      color: string;
      totalLessons: number;
    } | null;
  }> | null;
  isLoading: boolean;
}

export function ContinueLearning({ enrollments, isLoading }: ContinueLearningProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-9 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const inProgressTracks = enrollments?.filter(
    (enrollment) => enrollment.track && enrollment.enrollment.progress > 0 && enrollment.enrollment.progress < 100
  ) || [];

  const notStartedTracks = enrollments?.filter(
    (enrollment) => enrollment.track && enrollment.enrollment.progress === 0
  ) || [];

  const tracksToShow = [...inProgressTracks, ...notStartedTracks].slice(0, 3);

  if (tracksToShow.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlayCircle className="h-5 w-5 mr-2" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              You haven't enrolled in any tracks yet.
            </p>
            <Button asChild>
              <Link href="/tracks">
                Browse Learning Tracks
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PlayCircle className="h-5 w-5 mr-2" />
          Continue Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {tracksToShow.map((item) => {
          if (!item.track) return null;
          
          const { track, enrollment } = item;
          const progressPercentage = enrollment.progress;
          const isNotStarted = progressPercentage === 0;
          
          return (
            <div key={track._id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <h4 className="font-medium text-sm">{track.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {track.description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{track.totalLessons} lessons</span>
                    {!isNotStarted && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{progressPercentage}% complete</span>
                      </>
                    )}
                  </div>
                </div>
                <div 
                  className="w-3 h-3 rounded-full ml-4 mt-1"
                  style={{ backgroundColor: track.color }}
                />
              </div>
              
              {!isNotStarted && (
                <Progress value={progressPercentage} className="h-2" />
              )}
              
              <Button size="sm" variant={isNotStarted ? "default" : "outline"} asChild>
                <Link href={`/tracks/${track.slug}`}>
                  {isNotStarted ? "Start Track" : "Continue"}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          );
        })}
        
        {enrollments && enrollments.length > 3 && (
          <Button variant="ghost" size="sm" asChild className="w-full">
            <Link href="/dashboard/tracks">
              View All Enrolled Tracks
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
