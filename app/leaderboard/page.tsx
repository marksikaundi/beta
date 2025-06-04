"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  BookOpen,
  Star,
  Target,
  Award,
} from "lucide-react";

export default function LeaderboardPage() {
  const { user } = useUser();
  const [period, setPeriod] = useState<"weekly" | "monthly" | "all-time">(
    "all-time"
  );
  const [selectedTrackId, setSelectedTrackId] = useState<string>("all");

  const globalLeaderboard = useQuery(api.leaderboards.getGlobalLeaderboard, {
    period,
    limit: 50,
  });

  const trackLeaderboard = useQuery(
    api.leaderboards.getTrackLeaderboard,
    selectedTrackId && selectedTrackId !== "all"
      ? {
          trackId: selectedTrackId as any,
          period,
          limit: 50,
        }
      : "skip"
  );

  const leaderboardStats = useQuery(api.leaderboards.getLeaderboardStats);
  const tracks = useQuery(api.tracks.getAllTracks, {});

  const userGlobalRank = useQuery(
    api.leaderboards.getUserGlobalRank,
    user ? { userId: user.id, period } : "skip"
  );

  const userTrackRank = useQuery(
    api.leaderboards.getUserTrackRank,
    user && selectedTrackId && selectedTrackId !== "all"
      ? {
          userId: user.id,
          trackId: selectedTrackId as any,
          period,
        }
      : "skip"
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <span className="text-lg font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank <= 3) return "default";
    if (rank <= 10) return "secondary";
    return "outline";
  };

  const currentLeaderboard =
    selectedTrackId && selectedTrackId !== "all"
      ? trackLeaderboard
      : globalLeaderboard;
  const currentUserRank =
    selectedTrackId && selectedTrackId !== "all"
      ? userTrackRank
      : userGlobalRank;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboards</h1>
        <p className="text-muted-foreground">
          See how you stack up against other learners
        </p>
      </div>

      {/* Stats Overview */}
      {leaderboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Learners
                  </p>
                  <p className="text-2xl font-bold">
                    {leaderboardStats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Learning Tracks
                  </p>
                  <p className="text-2xl font-bold">
                    {leaderboardStats.totalTracks}
                  </p>
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
                    Total Lessons
                  </p>
                  <p className="text-2xl font-bold">
                    {leaderboardStats.totalLessons.toLocaleString()}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Your Rank
                  </p>
                  <p className="text-2xl font-bold">
                    {currentUserRank ? `#${currentUserRank}` : "Unranked"}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Performers This Week */}
      {leaderboardStats?.weeklyTopPerformers && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performers This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leaderboardStats.weeklyTopPerformers
                .slice(0, 3)
                .map((performer: any, index: number) => (
                  <div key={performer.userId} className="text-center">
                    <div className="relative mb-3">
                      <Avatar className="h-16 w-16 mx-auto">
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback>
                          {performer.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">
                        {getRankIcon(index + 1)}
                      </div>
                    </div>
                    <h3 className="font-semibold">
                      {performer.displayName || performer.username}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {performer.experienceGained} XP this week
                    </p>
                    <Badge
                      variant={getRankBadgeVariant(index + 1)}
                      className="mt-2"
                    >
                      {performer.lessonsCompleted} lessons completed
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">This Week</SelectItem>
            <SelectItem value="monthly">This Month</SelectItem>
            <SelectItem value="all-time">All Time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTrackId} onValueChange={setSelectedTrackId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All tracks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            {tracks?.map((track) => (
              <SelectItem key={track._id} value={track._id}>
                {track.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {selectedTrackId && selectedTrackId !== "all"
              ? `${
                  tracks?.find((t) => t._id === selectedTrackId)?.title
                } Leaderboard`
              : "Global Leaderboard"}
            <Badge variant="outline" className="ml-auto">
              {period === "weekly"
                ? "This Week"
                : period === "monthly"
                ? "This Month"
                : "All Time"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentLeaderboard && currentLeaderboard.length > 0 ? (
            <div className="space-y-3">
              {currentLeaderboard.map((entry, index) => {
                const isCurrentUser = user?.id === entry.userId;

                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      isCurrentUser
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(entry.rank)}
                      </div>

                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>
                          {entry.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {entry.displayName || entry.username}
                          </h3>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Level {entry.level}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-lg">
                            {entry.score.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">Score</p>
                        </div>

                        <div className="text-center">
                          <p className="font-semibold">
                            {entry.experienceGained.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">XP</p>
                        </div>

                        <div className="text-center">
                          <p className="font-semibold">
                            {entry.lessonsCompleted}
                          </p>
                          <p className="text-muted-foreground">Lessons</p>
                        </div>

                        {selectedTrackId &&
                          selectedTrackId !== "all" &&
                          "trackProgress" in entry && (
                            <div className="text-center">
                              <p className="font-semibold">
                                {Math.round((entry as any).trackProgress)}%
                              </p>
                              <p className="text-muted-foreground">Progress</p>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data available</h3>
              <p className="text-muted-foreground">
                Start learning to appear on the leaderboard!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Most Popular Tracks */}
      {leaderboardStats?.mostPopularTracks && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Most Popular Tracks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaderboardStats.mostPopularTracks
                .filter((item) => item !== null)
                .map((item: any, index: number) => (
                  <div
                    key={item.track._id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {item.track.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.enrollmentCount} enrolled
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.track.difficulty}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
