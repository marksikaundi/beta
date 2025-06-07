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

export default function EditTrackPage() {
  const router = useRouter();
  const params = useParams();
  const trackSlug = params.slug as string;

  // Get track data
  const trackData = useQuery(api.tracks.getTrackBySlug, {
    slug: trackSlug,
  });

  const updateTrack = useMutation(api["tracks-admin"].updateTrack);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    estimatedHours: 0,
    thumbnail: "",
    banner: "",
    color: "#3b82f6",
    icon: "code",
    category: "",
    tags: [] as string[],
    isPublished: true,
    isPremium: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Populate form when track data loads
  useEffect(() => {
    if (trackData) {
      setFormData({
        title: trackData.title || "",
        slug: trackData.slug || "",
        description: trackData.description || "",
        longDescription: trackData.longDescription || "",
        difficulty: trackData.difficulty || "beginner",
        estimatedHours: trackData.estimatedHours || 0,
        thumbnail: trackData.thumbnail || "",
        banner: trackData.banner || "",
        color: trackData.color || "#3b82f6",
        icon: trackData.icon || "code",
        category: trackData.category || "",
        tags: trackData.tags || [],
        isPublished: trackData.isPublished ?? true,
        isPremium: trackData.isPremium ?? false,
      });
    }
  }, [trackData]);

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
      if (!trackData?._id) {
        throw new Error("Track ID not found");
      }

      await updateTrack({
        trackId: trackData._id,
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        difficulty: formData.difficulty,
        estimatedHours: formData.estimatedHours,
        thumbnail: formData.thumbnail,
        banner: formData.banner || undefined,
        color: formData.color,
        icon: formData.icon,
        category: formData.category,
        tags: formData.tags,
        isPublished: formData.isPublished,
        isPremium: formData.isPremium,
      });

      toast.success("Track updated successfully!");
      router.push(`/tracks/${formData.slug}`);
    } catch (error) {
      console.error("Failed to update track:", error);
      toast.error("Failed to update track", {
        description:
          "Please try again. If the problem persists, contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!trackData) {
    return (
      <>
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
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Track</h1>
            <p className="text-muted-foreground mt-2">
              Update the details of your learning track
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
                The core details about your learning track
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Track Title</Label>
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
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Track Settings</CardTitle>
              <CardDescription>
                Configure the track's attributes and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">
                    Estimated Hours to Complete
                  </Label>
                  <Input
                    id="estimatedHours"
                    name="estimatedHours"
                    type="number"
                    min="0"
                    value={formData.estimatedHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedHours: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner">Banner URL (optional)</Label>
                  <Input
                    id="banner"
                    name="banner"
                    value={formData.banner}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Theme Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: formData.color }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon Name</Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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
                Control the visibility and access to this track
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Published Status</h3>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the track will be visible to users
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
                    this track
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
