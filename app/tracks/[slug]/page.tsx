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
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";

// CSS for grid pattern background
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// Grid background pattern CSS
const gridBgClass = `
  [mask-image:linear-gradient(0deg,rgba(0,0,0,0.9),rgba(0,0,0,0.1))]
  [background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")]
`;

const gridBgDarkClass = `
  [mask-image:linear-gradient(0deg,rgba(0,0,0,0.9),rgba(0,0,0,0.1))]
  [background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")]
`;

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
  
  const isCompleted = progress?.status === "completed";
  const isInProgress = progress?.status === "in-progress";

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] border border-border/40 ${
        isCompleted
          ? "bg-gradient-to-r from-green-50/70 to-green-50/30 border-green-200/70"
          : isInProgress 
          ? "bg-gradient-to-r from-blue-50/50 to-blue-50/20"
          : "bg-card/60 hover:bg-card/90"
      } ${isLocked ? "opacity-60 hover:opacity-70" : ""}`}
    >
      {isCompleted && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-green-200 border-r-transparent z-10"></div>
      )}
      
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl shadow-sm transition-colors ${
                  isCompleted
                    ? "bg-green-100 text-green-600"
                    : isInProgress
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                }`}
              >
                <LessonIcon className="h-5 w-5" />
              </div>
              <StatusIcon
                className={`h-5 w-5 ${
                  isCompleted
                    ? "text-green-500"
                    : isInProgress
                    ? "text-blue-500"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1.5">
                <h3 className="font-semibold text-sm truncate">{lesson.title}</h3>
                {lesson.isPremium && (
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border-amber-200">
                    <Award className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 mb-2.5 group-hover:text-foreground/80 transition-colors">
                {lesson.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                  {lesson.estimatedMinutes}m
                </span>
                <span className="flex items-center">
                  <Target className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                  {lesson.experiencePoints} XP
                </span>
                <Badge
                  className={`${getDifficultyColor(lesson.difficulty)} transition-colors`}
                  variant="outline"
                >
                  {lesson.difficulty}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-2">
            {progress?.score && (
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700">
                {progress.score}%
              </Badge>
            )}
            {isLocked ? (
              <Button size="sm" variant="outline" disabled className="relative overflow-hidden">
                <Lock className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                size="sm" 
                className={`transition-all duration-300 ${
                  isCompleted 
                    ? "bg-green-600 hover:bg-green-700" 
                    : isInProgress 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : ""
                }`}
                asChild
              >
                <Link href={`/tracks/${trackSlug}/lessons/${lesson.slug}`} className="flex items-center gap-1.5">
                  {isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Review
                    </>
                  ) : isInProgress ? (
                    <>
                      <Play className="h-4 w-4" />
                      Continue
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
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
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 relative">
        <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark opacity-5"></div>
        <MainNavigation />
        <div className="container mx-auto px-4 py-8 lg:py-12 relative z-10">
          <div className="space-y-10">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-64" />
                      <Skeleton className="h-5 w-96" />
                    </div>
                  </div>
                  
                  <Skeleton className="h-24 w-full rounded-xl" />
                  
                  <Skeleton className="h-20 w-full" />
                  
                  <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-20 rounded-full" />
                    ))}
                  </div>
                </div>
                
                <Skeleton className="h-1 w-full" />
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-72 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { track, lessons, enrollment: trackProgress } = trackData;

  if (!track) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 relative">
        <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark opacity-5"></div>
        <MainNavigation />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center py-20 max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center p-6 rounded-full bg-muted/50 mb-6">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Track Not Found</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              The track you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link href="/tracks">Browse All Tracks</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const completedLessons =
    lessons?.filter((l) => l.progress?.status === "completed").length || 0;
  const totalLessons = lessons?.length || 0;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <MainNavigation />
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="space-y-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 rounded-full hover:bg-background/80 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracks
          </Button>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Track Header */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl shadow-md flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                        style={{ backgroundColor: track.color }}
                      >
                        <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative z-10">{track.title.charAt(0)}</span>
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold mb-1 relative">
                          {track.title}
                          <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary rounded-full"></span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                          {track.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {track.isPremium && (
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border-amber-200 px-3 py-1 text-sm"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Premium
                      </Badge>
                    )}
                    <Badge 
                      className={`${getDifficultyColor(track.difficulty)} px-3 py-1 text-sm`}
                    >
                      {track.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                {trackProgress && (
                  <div className="bg-card border border-border/30 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Your Progress</span>
                      <span className="text-primary">{Math.round(progressPercentage)}% Complete</span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-2.5 bg-secondary/30" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                        {completedLessons} of {totalLessons} lessons completed
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                        {trackProgress.totalTimeSpent || 0} minutes studied
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-muted-foreground leading-relaxed text-base">
                  {track.longDescription}
                </p>

                <div className="flex flex-wrap gap-2">
                  {track.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline"
                      className="px-3 py-1.5 text-xs bg-card hover:bg-card/80 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Lessons List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Lessons</h2>
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-1 bg-secondary/30 hover:bg-secondary/40 transition-colors"
                  >
                    {totalLessons} lessons
                  </Badge>
                </div>

                <div className="space-y-4">
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
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Enrollment Card */}
              <Card className="overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-xl">
                    {trackProgress ? "Continue Learning" : "Start Learning"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {trackProgress ? (
                    <>                        <div className="text-center py-6">
                        <div className="relative mx-auto w-32 h-32 mb-4">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-3xl font-bold text-primary">
                              {Math.round(progressPercentage)}%
                            </div>
                          </div>
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              className="text-muted/30 stroke-current"
                              strokeWidth="8"
                              strokeLinecap="round"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                            <circle
                              className="text-primary stroke-current transition-all duration-1000 ease-in-out"
                              strokeWidth="8"
                              strokeLinecap="round"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                              strokeDasharray={`${progressPercentage * 2.51} 251.2`}
                              strokeDashoffset="0"
                            />
                          </svg>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Your learning journey is underway!
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300" 
                        size="lg"
                        asChild
                      >
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
                      <div className="text-center py-6">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4">
                          <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-xl font-semibold mb-2">
                          Ready to start?
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Join <span className="font-medium text-foreground">{track.enrollmentCount.toLocaleString()}</span> learners
                        </div>
                      </div>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
                        size="lg"
                        onClick={handleEnrollment}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-5 w-5 mr-2" />
                            Enroll Now
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Track Stats */}
              <Card className="overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-xl">Track Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-card/80 to-card/30 rounded-lg p-4 hover:shadow-md transition-all duration-300 group">
                      <div className="text-2xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                        {track.totalLessons}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <BookOpen className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                        Lessons
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-card/80 to-card/30 rounded-lg p-4 hover:shadow-md transition-all duration-300 group">
                      <div className="text-2xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                        {track.estimatedHours}h
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                        Duration
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-card/80 to-card/30 rounded-lg p-4 hover:shadow-md transition-all duration-300 group">
                      <div className="text-2xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                        {track.averageRating.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Star className="h-3.5 w-3.5 mr-1.5 opacity-70 text-yellow-500" />
                        Rating
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-card/80 to-card/30 rounded-lg p-4 hover:shadow-md transition-all duration-300 group">
                      <div className="text-2xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                        {track.enrollmentCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                        Students
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-1">
                      <span className="text-muted-foreground">Category</span>
                      <span className="capitalize font-medium">{track.category}</span>
                    </div>
                    <div className="flex items-center justify-between p-1">
                      <span className="text-muted-foreground">Level</span>
                      <Badge
                        className={`${getDifficultyColor(track.difficulty)}`}
                        variant="outline"
                      >
                        {track.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills You'll Learn */}
              <Card className="overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-xl">Skills You'll Learn</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {track.tags.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
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
    </div>
  );
}
