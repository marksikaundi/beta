"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ArrowRight,
  Clock,
  Users,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface Track {
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
  isPopular?: boolean;
  isNew?: boolean;
}

interface RecommendedTracksProps {
  userTracks?: string[]; // Array of enrolled track IDs
  userLevel?: number;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800";
    case "advanced":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function TrackCard({ track }: { track: Track }) {
  return (
    <div className="p-4 border rounded-lg hover:bg-accent/30 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-3 h-3 rounded-full shrink-0 mt-1"
          style={{ backgroundColor: track.color }}
        />
        <div className="flex gap-1">
          {track.isNew && (
            <Badge
              variant="secondary"
              className="text-xs bg-blue-100 text-blue-800"
            >
              New
            </Badge>
          )}
          {track.isPopular && (
            <Badge
              variant="secondary"
              className="text-xs bg-orange-100 text-orange-800"
            >
              Popular
            </Badge>
          )}
        </div>
      </div>

      <h4 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors">
        {track.title}
      </h4>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {track.description}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {track.estimatedHours}h
          </span>
          <span className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            {track.totalLessons}
          </span>
        </div>
        <Badge className={getDifficultyColor(track.difficulty)}>
          {track.difficulty}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />
          {track.enrollmentCount.toLocaleString()}
          <Star className="h-3 w-3 ml-2 mr-1" />
          {track.averageRating.toFixed(1)}
        </div>
        <Button size="sm" variant="ghost" asChild className="text-xs h-6 px-2">
          <Link href={`/tracks/${track.slug}`}>
            View
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function RecommendedTracks({
  userTracks = [],
  userLevel = 1,
}: RecommendedTracksProps) {
  const { user } = useUser();

  // Get all tracks to recommend from
  const allTracks = useQuery(api.tracks.getAllTracks, {});

  if (!allTracks) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-8 w-full mb-3" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Filter out enrolled tracks and get recommendations
  const availableTracks = allTracks
    .filter((track) => !userTracks.includes(track._id) && track.isPublished)
    .map((track) => ({
      ...track,
      isPopular: track.enrollmentCount > 1000,
      isNew:
        new Date(track.createdAt) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    }));

  // Recommendation logic
  let recommendedTracks: Track[] = [];

  // For beginners: recommend beginner tracks
  if (userLevel <= 2) {
    recommendedTracks = availableTracks
      .filter((track) => track.difficulty === "beginner")
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);
  }
  // For intermediate: mix of beginner completion and intermediate
  else if (userLevel <= 5) {
    const beginnerTracks = availableTracks
      .filter((track) => track.difficulty === "beginner")
      .slice(0, 1);
    const intermediateTracks = availableTracks
      .filter((track) => track.difficulty === "intermediate")
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 2);
    recommendedTracks = [...beginnerTracks, ...intermediateTracks];
  }
  // For advanced: intermediate and advanced tracks
  else {
    const intermediateTracks = availableTracks
      .filter((track) => track.difficulty === "intermediate")
      .slice(0, 1);
    const advancedTracks = availableTracks
      .filter((track) => track.difficulty === "advanced")
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 2);
    recommendedTracks = [...intermediateTracks, ...advancedTracks];
  }

  // If we don't have enough, fill with popular tracks
  if (recommendedTracks.length < 3) {
    const popularTracks = availableTracks
      .filter((track) => !recommendedTracks.find((rt) => rt._id === track._id))
      .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
      .slice(0, 3 - recommendedTracks.length);
    recommendedTracks = [...recommendedTracks, ...popularTracks];
  }

  if (recommendedTracks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No recommendations available at the moment.
            </p>
            <Button asChild>
              <Link href="/tracks">
                Browse All Tracks
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
          <Sparkles className="h-5 w-5 mr-2" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendedTracks.map((track) => (
          <TrackCard key={track._id} track={track} />
        ))}

        {availableTracks.length > 3 && (
          <Button variant="ghost" size="sm" asChild className="w-full">
            <Link href="/tracks">
              <TrendingUp className="h-4 w-4 mr-2" />
              Explore All Tracks
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
