"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Code,
  Play,
  CheckCircle,
  Trophy,
  Zap,
  Target,
  FileText,
  Video,
  HelpCircle,
  ArrowRight,
  Award,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  thumbnail: string;
  color: string;
  category: string;
  totalLessons: number;
  enrollmentCount: number;
  averageRating: number;
  isPremium: boolean;
  tags: string[];
}

interface Lesson {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: "reading" | "coding" | "quiz" | "video" | "project";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  experiencePoints: number;
  isPremium: boolean;
  trackId: string;
  order: number;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "advanced":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200";
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

function CourseCard({
  course,
  isEnrolled = false,
}: {
  course: Course;
  isEnrolled?: boolean;
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div
            className="w-4 h-4 rounded-full shrink-0"
            style={{ backgroundColor: course.color }}
          />
          <div className="flex gap-1">
            {course.isPremium && (
              <Badge
                variant="secondary"
                className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800"
              >
                <Award className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            )}
            <Badge
              className={getDifficultyColor(course.difficulty)}
              variant="outline"
            >
              {course.difficulty}
            </Badge>
          </div>
        </div>

        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/tracks/${course.slug}`}>{course.title}</Link>
        </CardTitle>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {course.estimatedHours}h
            </span>
            <span className="flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              {course.totalLessons} lessons
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{course.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {course.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{course.tags.length - 2}
            </Badge>
          )}
        </div>

        <Button
          asChild
          className="w-full"
          variant={isEnrolled ? "outline" : "default"}
        >
          <Link href={`/tracks/${course.slug}`}>
            {isEnrolled ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Continue
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Start Course
              </>
            )}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function LessonCard({
  lesson,
  trackTitle,
  progress,
}: {
  lesson: Lesson;
  trackTitle: string;
  progress?: any;
}) {
  const LessonIcon = getLessonIcon(lesson.type);
  const isCompleted = progress?.status === "completed";

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border hover:border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div
            className={`p-2 rounded-lg shrink-0 ${
              isCompleted
                ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <LessonIcon className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                {lesson.title}
              </h3>
              {lesson.isPremium && (
                <Badge variant="secondary" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              )}
              {isCompleted && (
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              {lesson.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
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

              <Button size="sm" variant="ghost" asChild>
                <Link href={`/tracks/${lesson.trackId}/lessons/${lesson.slug}`}>
                  {isCompleted ? "Review" : "Start"}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LabPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"courses" | "lessons">("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Get all tracks/courses
  const allTracks = useQuery(api.tracks.getAllTracks, {
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    difficulty:
      selectedDifficulty !== "all" ? (selectedDifficulty as any) : undefined,
  });

  // Get recent lessons
  const recentLessons = useQuery(api.lessons.getRecentLessons, { limit: 12 });

  // Get user enrollments
  const userEnrollments = useQuery(
    api.tracks.getUserEnrollments,
    user ? { clerkId: user.id } : "skip"
  );

  const enrolledTrackIds =
    userEnrollments?.map((e) => e.track?._id).filter(Boolean) || [];

  // Filter tracks based on search
  const filteredTracks =
    allTracks?.filter(
      (track) =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  // Get unique categories for filter
  const categories = [
    ...new Set(allTracks?.map((track) => track.category) || []),
  ];

  if (!allTracks) {
    return (
      <>
        <MainNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="text-center">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Development Lab
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interactive courses and hands-on lessons to master programming
              skills. Learn by building, coding, and solving real-world
              challenges.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {allTracks.length}
                </div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {recentLessons?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Lessons
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {enrolledTrackIds.length}
                </div>
                <div className="text-sm text-muted-foreground">Enrolled</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {allTracks.filter((t) => t.difficulty === "beginner").length}
                </div>
                <div className="text-sm text-muted-foreground">Beginner</div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={activeTab === "courses" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("courses")}
                className="rounded-md"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </Button>
              <Button
                variant={activeTab === "lessons" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("lessons")}
                className="rounded-md"
              >
                <Code className="h-4 w-4 mr-2" />
                Lessons
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Target className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {activeTab === "courses" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  {searchQuery ||
                  selectedCategory !== "all" ||
                  selectedDifficulty !== "all"
                    ? `Filtered Courses (${filteredTracks.length})`
                    : "All Courses"}
                </h2>
                {user && enrolledTrackIds.length > 0 && (
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Link>
                  </Button>
                )}
              </div>

              {filteredTracks.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No courses found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or browse all courses.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedDifficulty("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTracks.map((track) => (
                    <CourseCard
                      key={track._id}
                      course={track}
                      isEnrolled={enrolledTrackIds.includes(track._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Recent Lessons</h2>
              {recentLessons && recentLessons.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {recentLessons.map((lesson: any) => (
                    <LessonCard
                      key={lesson._id}
                      lesson={lesson}
                      trackTitle={lesson.trackTitle || "Unknown Track"}
                      progress={null}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Code className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No lessons available
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Lessons will appear here as courses are created.
                    </p>
                    <Button asChild>
                      <Link href="/tracks">Browse Courses</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
