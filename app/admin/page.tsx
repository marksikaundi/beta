"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  Plus,
  BookOpen,
  Code,
  Users,
  TrendingUp,
  Settings,
  Database,
  FileText,
  Video,
  HelpCircle,
  Trophy,
  Edit,
  Trash2,
  Eye,
  Clock,
  Target,
  Award,
} from "lucide-react";

interface Track {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  category: string;
  totalLessons: number;
  enrollmentCount: number;
  isPremium: boolean;
  isPublished: boolean;
  color: string;
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
  isPublished: boolean;
  order: number;
  trackId: string;
}

function CreateTrackForm() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    difficulty: "beginner" as const,
    estimatedHours: 1,
    category: "",
    tags: "",
    color: "#3b82f6",
    isPremium: false,
  });

  const createTrack = useMutation(api.tracks.createTrack);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await createTrack({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        longDescription: formData.longDescription,
        difficulty: formData.difficulty,
        estimatedHours: formData.estimatedHours,
        thumbnail: "",
        color: formData.color,
        icon: "BookOpen",
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        prerequisites: [],
        isPremium: formData.isPremium,
        createdBy: "admin",
      });

      // Reset form
      setFormData({
        title: "",
        slug: "",
        description: "",
        longDescription: "",
        difficulty: "beginner",
        estimatedHours: 1,
        category: "",
        tags: "",
        color: "#3b82f6",
        isPremium: false,
      });
    } catch (error) {
      console.error("Error creating track:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create New Course
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Learn Python Fundamentals"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="learn-python-fundamentals"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Short Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description for course cards"
              required
            />
          </div>

          <div>
            <Label htmlFor="longDescription">Detailed Description</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  longDescription: e.target.value,
                }))
              }
              placeholder="Detailed course description for the course page"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="1"
                max="100"
                value={formData.estimatedHours}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedHours: parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="e.g., backend, frontend, mobile"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="python, programming, beginners"
              />
            </div>

            <div>
              <Label htmlFor="color">Course Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="w-16 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPremium"
              checked={formData.isPremium}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPremium: e.target.checked,
                }))
              }
              className="rounded"
            />
            <Label htmlFor="isPremium">Premium Course</Label>
          </div>

          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CreateLessonForm() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    type: "reading" as const,
    difficulty: "beginner" as const,
    estimatedMinutes: 15,
    experiencePoints: 100,
    trackId: "",
    isPremium: false,
  });

  const createLesson = useMutation(api.lessons.createLesson);
  const tracks = useQuery(api.tracks.getAllTracks, {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trackId) return;

    setIsCreating(true);
    try {
      await createLesson({
        trackId: formData.trackId as any,
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        type: formData.type,
        difficulty: formData.difficulty,
        estimatedMinutes: formData.estimatedMinutes,
        experiencePoints: formData.experiencePoints,
        isPremium: formData.isPremium,
        tags: [],
      });

      // Reset form
      setFormData({
        title: "",
        slug: "",
        description: "",
        content: "",
        type: "reading",
        difficulty: "beginner",
        estimatedMinutes: 15,
        experiencePoints: 100,
        trackId: "",
        isPremium: false,
      });
    } catch (error) {
      console.error("Error creating lesson:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create New Lesson
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="trackId">Select Course</Label>
            <Select
              value={formData.trackId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, trackId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a course..." />
              </SelectTrigger>
              <SelectContent>
                {tracks?.map((track) => (
                  <SelectItem key={track._id} value={track._id}>
                    {track.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lesson-title">Lesson Title</Label>
              <Input
                id="lesson-title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Variables and Data Types"
                required
              />
            </div>

            <div>
              <Label htmlFor="lesson-slug">URL Slug</Label>
              <Input
                id="lesson-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="variables-and-data-types"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lesson-description">Description</Label>
            <Input
              id="lesson-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief lesson description"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Lesson Content (Markdown)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Write your lesson content in Markdown..."
              rows={8}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="lesson-type">Lesson Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lesson-difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimatedMinutes">Duration (min)</Label>
              <Input
                id="estimatedMinutes"
                type="number"
                min="5"
                max="120"
                value={formData.estimatedMinutes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedMinutes: parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="experiencePoints">XP Points</Label>
              <Input
                id="experiencePoints"
                type="number"
                min="50"
                max="500"
                step="50"
                value={formData.experiencePoints}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experiencePoints: parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="lesson-isPremium"
              checked={formData.isPremium}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPremium: e.target.checked,
                }))
              }
              className="rounded"
            />
            <Label htmlFor="lesson-isPremium">Premium Lesson</Label>
          </div>

          <Button
            type="submit"
            disabled={isCreating || !formData.trackId}
            className="w-full"
          >
            {isCreating ? "Creating..." : "Create Lesson"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const tracks = useQuery(api.tracks.getAllTracks, {});
  const recentLessons = useQuery(api.lessons.getRecentLessons, { limit: 10 });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getLessonIcon = (type: string) => {
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
  };

  return (
    <div className="space-y-8">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{tracks?.length || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
                <p className="text-2xl font-bold">
                  {recentLessons?.length || 0}
                </p>
              </div>
              <Code className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold">
                  {tracks?.reduce(
                    (sum, track) => sum + track.enrollmentCount,
                    0
                  ) || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg Course Rating
                </p>
                <p className="text-2xl font-bold">
                  {tracks?.length
                    ? (
                        tracks.reduce(
                          (sum, track) => sum + track.averageRating,
                          0
                        ) / tracks.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Recent Courses
            </span>
            <Button size="sm" variant="outline" asChild>
              <a href="/lab">View All</a>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tracks && tracks.length > 0 ? (
            <div className="space-y-3">
              {tracks.slice(0, 5).map((track) => (
                <div
                  key={track._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: track.color }}
                    />
                    <div>
                      <h3 className="font-medium">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {track.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={getDifficultyColor(track.difficulty)}
                      variant="outline"
                    >
                      {track.difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {track.totalLessons} lessons
                    </Badge>
                    {track.isPremium && (
                      <Badge variant="secondary">
                        <Award className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <Button size="sm" variant="ghost" asChild>
                      <a href={`/tracks/${track.slug}`}>
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No courses created yet. Create your first course above!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Lessons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Recent Lessons
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLessons && recentLessons.length > 0 ? (
            <div className="space-y-3">
              {recentLessons.slice(0, 5).map((lesson: any) => {
                const LessonIcon = getLessonIcon(lesson.type);
                return (
                  <div
                    key={lesson._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <LessonIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {lesson.trackTitle} • {lesson.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={getDifficultyColor(lesson.difficulty)}
                        variant="outline"
                      >
                        {lesson.difficulty}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {lesson.estimatedMinutes}m
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Target className="h-3 w-3 mr-1" />
                        {lesson.experiencePoints} XP
                      </div>
                      {lesson.isPremium && (
                        <Badge variant="secondary">
                          <Award className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No lessons created yet. Create your first lesson above!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const { user } = useUser();
  const [result, setResult] = useState<string>("");

  const createSampleLessons = useMutation(
    api.lessons.createSampleCodingLessons
  );
  const createJsTrack = useMutation(
    api.tracks.createJavaScriptFundamentalsTrack
  );
  const createSampleNotifications = useMutation(
    api.notifications.createSampleNotifications
  );
  const clearNotifications = useMutation(
    api.notifications.clearAllUserNotifications
  );
  const createSampleChangelogEntries = useMutation(
    api.changelog.createSampleChangelogEntries
  );

  if (!user) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-16 text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground">
                Please sign in to access the admin dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage courses, lessons, and platform content
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Settings className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="courses">
              <CreateTrackForm />
            </TabsContent>

            <TabsContent value="lessons">
              <CreateLessonForm />
            </TabsContent>

            <TabsContent value="tools">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Development Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={async () => {
                          try {
                            // First create the JS track
                            const trackResult = await createJsTrack({});
                            setResult(
                              `Created JavaScript track: ${trackResult.message}`
                            );

                            // Then create the lessons
                            const lessonResult = await createSampleLessons({});
                            setResult(
                              `Created track and lessons: ${lessonResult.message}`
                            );
                          } catch (error) {
                            setResult(`Error: ${error}`);
                          }
                        }}
                        variant="outline"
                      >
                        Create JavaScript Track & Lessons
                      </Button>

                      <Button
                        onClick={async () => {
                          if (!user) return;
                          try {
                            const result = await createSampleNotifications({
                              userId: user.id,
                            });
                            setResult(`Success: ${result.message}`);
                          } catch (error) {
                            setResult(`Error: ${error}`);
                          }
                        }}
                        variant="outline"
                      >
                        Create Sample Notifications
                      </Button>

                      <Button
                        onClick={async () => {
                          if (!user) return;
                          try {
                            await clearNotifications({ userId: user.id });
                            setResult("Success: Cleared all notifications");
                          } catch (error) {
                            setResult(`Error: ${error}`);
                          }
                        }}
                        variant="outline"
                      >
                        Clear Notifications
                      </Button>

                      <Button
                        onClick={async () => {
                          try {
                            const result = await createSampleChangelogEntries(
                              {}
                            );
                            setResult(`Success: ${result.message}`);
                          } catch (error) {
                            setResult(`Error: ${error}`);
                          }
                        }}
                        variant="outline"
                      >
                        Create Sample Changelog
                      </Button>
                    </div>

                    {result && (
                      <div className="mt-4">
                        <Card>
                          <CardContent className="pt-6">
                            <p className="text-sm font-mono">{result}</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Changelog Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Platform Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Manage platform announcements, status updates, and
                        changelog entries.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button asChild>
                          <Link href="/admin/changelog">
                            <FileText className="h-4 w-4 mr-2" />
                            Manage Changelog
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href="/changelog">
                            <Eye className="h-4 w-4 mr-2" />
                            View Public Page
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
