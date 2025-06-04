"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  BookOpen,
  Calendar,
  Github,
  Linkedin,
  Globe,
  Settings,
  Award,
  TrendingUp,
  Zap,
  Target,
  Edit,
  Save,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ProfilePage() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: "",
    bio: "",
    githubUsername: "",
    linkedinUrl: "",
    websiteUrl: "",
  });

  // Get user data from Convex
  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const userEnrollments = useQuery(
    api.tracks.getUserEnrollments,
    user ? { clerkId: user.id } : "skip"
  );

  const userAchievements = useQuery(
    api.progress.getUserAchievements,
    user ? { clerkId: user.id } : "skip"
  );

  const recentActivity = useQuery(
    api.progress.getRecentActivity,
    user ? { clerkId: user.id, limit: 10 } : "skip"
  );

  const updateUser = useMutation(api.users.updateUser);

  const handleEdit = () => {
    if (userData) {
      setEditData({
        displayName: userData.displayName || "",
        bio: userData.bio || "",
        githubUsername: userData.githubUsername || "",
        linkedinUrl: userData.linkedinUrl || "",
        websiteUrl: userData.websiteUrl || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      await updateUser({
        userId: userData._id,
        ...editData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      displayName: "",
      bio: "",
      githubUsername: "",
      linkedinUrl: "",
      websiteUrl: "",
    });
  };

  if (!user || !userData) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const completedLessons =
    userEnrollments?.reduce((total, enrollment) => {
      if (!enrollment.track) return total;
      return (
        total +
        Math.floor(
          (enrollment.enrollment.progress / 100) * enrollment.track.totalLessons
        )
      );
    }, 0) || 0;

  const totalLessonsInEnrolledTracks =
    userEnrollments?.reduce((total, enrollment) => {
      if (!enrollment.track) return total;
      return total + enrollment.track.totalLessons;
    }, 0) || 0;

  const overallProgress =
    totalLessonsInEnrolledTracks > 0
      ? (completedLessons / totalLessonsInEnrolledTracks) * 100
      : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="text-lg">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={editData.displayName}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            displayName: e.target.value,
                          }))
                        }
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editData.bio}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold">
                        {userData.displayName || user.fullName}
                      </h1>
                      <Badge variant="secondary">Level {userData.level}</Badge>
                      <Button onClick={handleEdit} variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-muted-foreground mb-3">
                      @{userData.username}
                    </p>

                    {userData.bio && (
                      <p className="text-sm mb-4">{userData.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined{" "}
                        {formatDistanceToNow(new Date(userData.createdAt))} ago
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        {userData.experience.toLocaleString()} XP
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {userData.streakDays} day streak
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Social Links */}
            {!isEditing && (
              <div className="flex flex-wrap gap-2 mt-6">
                {userData.githubUsername && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://github.com/${userData.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {userData.linkedinUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={userData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {userData.websiteUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={userData.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total XP
                      </p>
                      <p className="text-2xl font-bold">
                        {userData.experience.toLocaleString()}
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Level
                      </p>
                      <p className="text-2xl font-bold">{userData.level}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Completed
                      </p>
                      <p className="text-2xl font-bold">{completedLessons}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Streak
                      </p>
                      <p className="text-2xl font-bold">
                        {userData.streakDays}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {completedLessons}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Lessons Completed
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {userEnrollments?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tracks Enrolled
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity && recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                          <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Completed a lesson
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.lesson?.title} •{" "}
                            {formatDistanceToNow(
                              new Date(
                                activity.progress.completedAt ||
                                  activity.timestamp
                              )
                            )}{" "}
                            ago
                          </p>
                        </div>
                        <Badge variant="secondary">
                          +{activity.lesson?.experiencePoints || 0} XP
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No recent activity. Start learning to see your progress
                    here!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracks Tab */}
          <TabsContent value="tracks">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                {userEnrollments && userEnrollments.length > 0 ? (
                  <div className="space-y-4">
                    {userEnrollments.map((enrollment) => (
                      <div
                        key={enrollment.enrollment._id}
                        className="p-4 rounded-lg border"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">
                            {enrollment.track?.title || "Unknown Track"}
                          </h3>
                          <Badge
                            variant={
                              enrollment.enrollment.progress === 100
                                ? "default"
                                : "secondary"
                            }
                          >
                            {Math.round(enrollment.enrollment.progress)}%
                            Complete
                          </Badge>
                        </div>
                        <Progress
                          value={enrollment.enrollment.progress}
                          className="h-2 mb-2"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {Math.floor(
                              (enrollment.enrollment.progress / 100) *
                                (enrollment.track?.totalLessons || 0)
                            )}{" "}
                            / {enrollment.track?.totalLessons || 0} lessons
                          </span>
                          <span>
                            Last studied{" "}
                            {formatDistanceToNow(
                              new Date(enrollment.enrollment.lastStudiedAt)
                            )}{" "}
                            ago
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    You haven't enrolled in any tracks yet. Check out our
                    available tracks!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {userAchievements && userAchievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userAchievements.map((achievement: any) => (
                      <div
                        key={achievement._id}
                        className="p-4 rounded-lg border bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="h-6 w-6 text-yellow-600" />
                          <h3 className="font-semibold">{achievement.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Earned{" "}
                          {formatDistanceToNow(new Date(achievement.earnedAt))}{" "}
                          ago
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No achievements yet. Keep learning to unlock your first
                    achievement!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="github">GitHub Username</Label>
                        <Input
                          id="github"
                          value={editData.githubUsername}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              githubUsername: e.target.value,
                            }))
                          }
                          placeholder="your-github-username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input
                          id="linkedin"
                          value={editData.linkedinUrl}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              linkedinUrl: e.target.value,
                            }))
                          }
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        value={editData.websiteUrl}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            websiteUrl: e.target.value,
                          }))
                        }
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Personal Information</h3>
                        <p className="text-sm text-muted-foreground">
                          Update your profile information and social links
                        </p>
                      </div>
                      <Button onClick={handleEdit} variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Account Type</h3>
                      <Badge
                        variant={
                          userData.subscriptionTier === "free"
                            ? "outline"
                            : "default"
                        }
                      >
                        {userData.subscriptionTier.charAt(0).toUpperCase() +
                          userData.subscriptionTier.slice(1)}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
