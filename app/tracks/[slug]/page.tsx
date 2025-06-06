"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  Circle,
  Lock,
  Trophy,
  Target,
  ArrowLeft,
  Code,
  FileText,
  Video,
  HelpCircle,
  Award,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Lesson {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: "reading" | "coding" | "quiz" | "project" | "video";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  order: number;
  isPremium: boolean;
  experiencePoints: number;
}

interface Progress {
  status: "not-started" | "in-progress" | "completed" | "skipped";
  completedAt?: string;
  timeSpent: number;
  score?: number;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 border-green-200";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "advanced":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getLessonIcon(type: string) {
  switch (type) {
    case "reading":
      return FileText;
    case "coding":
      return Code;
    case "quiz":
      return HelpCircle;
    case "video":
      return Video;
    case "project":
      return Trophy;
    default:
      return BookOpen;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "in-progress":
      return Play;
    default:
      return Circle;
  }
}

function LessonCard({
  lesson,
  progress,
  trackSlug,
  isLocked = false,
}: {
  lesson: Lesson;
  progress?: Progress;
  trackSlug: string;
  isLocked?: boolean;
}) {
  const LessonIcon = getLessonIcon(lesson.type);
  const StatusIcon = getStatusIcon(progress?.status || "not-started");

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg border border-border/40 overflow-hidden",
        progress?.status === "completed"
          ? "bg-gradient-to-r from-green-50/80 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-900/30"
          : "hover:bg-accent/30 bg-background/60 backdrop-blur-sm",
        isLocked ? "opacity-60" : ""
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  progress?.status === "completed"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <LessonIcon className="h-4 w-4" />
              </div>
              <StatusIcon
                className={cn(
                  "h-5 w-5",
                  progress?.status === "completed"
                    ? "text-green-500 dark:text-green-400"
                    : progress?.status === "in-progress"
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-muted-foreground"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-sm truncate">{lesson.title}</h3>
                {lesson.isPremium && (
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20 dark:text-yellow-500 border-yellow-200 dark:border-yellow-900/30">
                    <Award className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {lesson.description}
              </p>
              <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {lesson.estimatedMinutes}m
                </span>
                <span className="flex items-center">
                  <Target className="h-3 w-3 mr-1" />
                  {lesson.experiencePoints} XP
                </span>
                <Badge
                  className={getDifficultyColor(lesson.difficulty)}
                  variant="outline"
                >
                  {lesson.difficulty}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {progress?.score && (
              <Badge variant="secondary" className="text-xs">
                {progress.score}%
              </Badge>
            )}
            {isLocked ? (
              <Button size="sm" disabled variant="secondary" className="opacity-70">
                <Lock className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" asChild className={cn(
                progress?.status === "completed" 
                  ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" 
                  : progress?.status === "in-progress"
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                  : ""
              )}>
                <Link href={`/tracks/${trackSlug}/lessons/${lesson.slug}`}>
                  {progress?.status === "completed" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Review
                    </>
                  ) : progress?.status === "in-progress" ? (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Continue
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </>
                  )}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const trackSlug = params.slug as string;

  // Get track with lessons and progress
  const trackData = useQuery(api.tracks.getTrackWithLessons, {
    slug: trackSlug,
    clerkId: user?.id,
  });

  // Get user enrollment status
  useQuery(
    api.tracks.getUserEnrollmentForTrack,
    user ? { clerkId: user.id, trackSlug } : "skip"
  );

  // Enrollment mutation
  const enrollInTrack = useMutation(api.tracks.enrollInTrackByClerkId);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnrollment = async () => {
    if (!user) {
      // Redirect to sign in or show auth modal
      router.push("/sign-in");
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollInTrack({
        clerkId: user.id,
        trackSlug: trackSlug,
      });

      toast.success("Successfully enrolled in track!", {
        description: "You can now access all lessons and start learning.",
      });

      // Refresh the page to update the UI
      window.location.reload();
    } catch (error) {
      console.error("Failed to enroll in track:", error);
      toast.error("Failed to enroll in track", {
        description:
          "Please try again. If the problem persists, contact support.",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!trackData) {
    return (
      <>
        <MainNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { track, lessons, enrollment: trackProgress } = trackData;

  if (!track) {
    return (
      <>
        <MainNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Track Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The track you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/tracks">Browse All Tracks</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const completedLessons =
    lessons?.filter((l) => l.progress?.status === "completed").length || 0;
  const totalLessons = lessons?.length || 0;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <>
      <MainNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracks
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Track Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: track.color }}
                      >
                        {track.title.charAt(0)}
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold">{track.title}</h1>
                        <p className="text-lg text-muted-foreground">
                          {track.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {track.isPremium && (
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <Badge className={getDifficultyColor(track.difficulty)}>
                      {track.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                {trackProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your Progress</span>
                      <span>{Math.round(progressPercentage)}% Complete</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {completedLessons} of {totalLessons} lessons completed
                      </span>
                      <span>
                        {trackProgress.totalTimeSpent || 0} minutes studied
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-muted-foreground leading-relaxed">
                  {track.longDescription}
                </p>

                <div className="flex flex-wrap gap-2">
                  {track.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Lessons List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Lessons</h2>
                  <Badge variant="secondary">{totalLessons} lessons</Badge>
                </div>

                <div className="space-y-3">
                  {lessons?.map((lessonData) => {
                    const isLocked =
                      !trackProgress && lessonData.lesson.isPremium;
                    return (
                      <LessonCard
                        key={lessonData.lesson._id}
                        lesson={lessonData.lesson}
                        progress={lessonData.progress}
                        trackSlug={trackSlug}
                        isLocked={isLocked}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enrollment Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {trackProgress ? "Continue Learning" : "Start Learning"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trackProgress ? (
                    <>
                      <div className="text-center py-4">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {Math.round(progressPercentage)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Complete
                        </div>
                      </div>
                      <Button className="w-full" asChild>
                        <Link
                          href={`/tracks/${trackSlug}/lessons/${lessons?.[0]?.lesson.slug}`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-center py-4">
                        <div className="text-lg font-semibold mb-2">
                          Ready to start?
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Join {track.enrollmentCount.toLocaleString()} learners
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleEnrollment}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Enroll Now
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Track Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Track Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {track.totalLessons}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Lessons
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {track.estimatedHours}h
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Duration
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {track.averageRating.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Rating
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {track.enrollmentCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Students
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="capitalize">{track.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <Badge
                        className={getDifficultyColor(track.difficulty)}
                        variant="outline"
                      >
                        {track.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills You'll Learn */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {track.tags.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
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
