"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MainNavigation } from "@/components/navigation/main-navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const trackSlug = params.trackSlug as string;
  const lessonSlug = params.lessonSlug as string;

  // Get lesson data
  const lessonData = useQuery(api.lessons.getLessonBySlug, {
    slug: lessonSlug,
  });

  const updateLesson = useMutation(api["lessons-admin"].updateLesson);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    type: "reading" as "reading" | "coding" | "quiz" | "project" | "video",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    estimatedMinutes: 0,
    experiencePoints: 0,
    tags: [] as string[],
    isPublished: true,
    isPremium: false,
    starterCode: "",
    solutionCode: "",
    language: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Populate form when lesson data loads
  useEffect(() => {
    if (lessonData) {
      setFormData({
        title: lessonData.lesson.title || "",
        slug: lessonData.lesson.slug || "",
        description: lessonData.lesson.description || "",
        content: lessonData.lesson.content || "",
        type: lessonData.lesson.type || "reading",
        difficulty: lessonData.lesson.difficulty || "beginner",
        estimatedMinutes: lessonData.lesson.estimatedMinutes || 0,
        experiencePoints: lessonData.lesson.experiencePoints || 0,
        tags: lessonData.lesson.tags || [],
        isPublished: lessonData.lesson.isPublished ?? true,
        isPremium: lessonData.lesson.isPremium ?? false,
        starterCode: lessonData.lesson.starterCode || "",
        solutionCode: lessonData.lesson.solutionCode || "",
        language: lessonData.lesson.language || "",
      });
    }
  }, [lessonData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!lessonData?.lesson?._id) {
        throw new Error("Lesson ID not found");
      }

      await updateLesson({
        lessonId: lessonData.lesson._id,
        title: formData.title,
        description: formData.description,
        content: formData.content,
        type: formData.type,
        difficulty: formData.difficulty,
        estimatedMinutes: formData.estimatedMinutes,
        experiencePoints: formData.experiencePoints,
        tags: formData.tags,
        isPublished: formData.isPublished,
        isPremium: formData.isPremium,
        starterCode: formData.starterCode || undefined,
        solutionCode: formData.solutionCode || undefined,
        language: formData.language || undefined,
      });

      toast.success("Lesson updated successfully!");
      router.push(`/tracks/${trackSlug}/lessons/${formData.slug}`);
    } catch (error) {
      console.error("Failed to update lesson:", error);
      toast.error("Failed to update lesson", {
        description:
          "Please try again. If the problem persists, contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lessonData) {
    return (
      <>
        <MainNavigation />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-60">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavigation />
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Lesson</h1>
            <p className="text-muted-foreground mt-2">
              Update the details of your lesson
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                The core details about your lesson
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    The slug cannot be changed after creation
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Lesson Content (Markdown)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  required
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lesson Settings</CardTitle>
              <CardDescription>
                Configure the lesson's attributes and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Lesson Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="coding">Coding Challenge</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      handleSelectChange("difficulty", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedMinutes">
                    Estimated Minutes to Complete
                  </Label>
                  <Input
                    id="estimatedMinutes"
                    name="estimatedMinutes"
                    type="number"
                    min="0"
                    value={formData.estimatedMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedMinutes: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experiencePoints">Experience Points (XP)</Label>
                <Input
                  id="experiencePoints"
                  name="experiencePoints"
                  type="number"
                  min="0"
                  value={formData.experiencePoints}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experiencePoints: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>

              {formData.type === "coding" && (
                <>
                  <Separator />
                  <h3 className="font-medium">Coding Challenge Settings</h3>

                  <div className="space-y-2">
                    <Label htmlFor="language">Programming Language</Label>
                    <Input
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      placeholder="javascript, python, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="starterCode">Starter Code</Label>
                    <Textarea
                      id="starterCode"
                      name="starterCode"
                      value={formData.starterCode}
                      onChange={handleChange}
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="solutionCode">Solution Code</Label>
                    <Textarea
                      id="solutionCode"
                      name="solutionCode"
                      value={formData.solutionCode}
                      onChange={handleChange}
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddTag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publication Settings</CardTitle>
              <CardDescription>
                Control the visibility and access to this lesson
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Published Status</h3>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the lesson will be visible to users
                  </p>
                </div>
                <Switch
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isPublished", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Premium Access</h3>
                  <p className="text-sm text-muted-foreground">
                    When enabled, users need a premium subscription to access
                    this lesson
                  </p>
                </div>
                <Switch
                  checked={formData.isPremium}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isPremium", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
