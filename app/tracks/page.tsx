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
  TrendingUp,
  Award,
  ArrowRight,
  Play
} from "lucide-react";
import { useState } from "react";

interface Track {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
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

function TrackCard({ track, isEnrolled = false }: { track: Track; isEnrolled?: boolean }) {
  return (
    <Card className="learning-card hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div 
            className="w-4 h-4 rounded-full shrink-0 mt-1"
            style={{ backgroundColor: track.color }}
          />
          <div className="flex gap-2">
            {track.isPremium && (
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800">
                <Award className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            <Badge className={getDifficultyColor(track.difficulty)}>
              {track.difficulty}
            </Badge>
          </div>
        </div>
        
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          <Link href={`/tracks/${track.slug}`}>
            {track.title}
          </Link>
        </CardTitle>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {track.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {track.estimatedHours}h
            </span>
            <span className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {track.totalLessons} lessons
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{track.enrollmentCount.toLocaleString()}</span>
            <Star className="h-4 w-4 ml-2" />
            <span>{track.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-4">
          {track.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {track.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{track.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <Button asChild className="w-full">
          <Link href={`/tracks/${track.slug}`}>
            {isEnrolled ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning
              </>
            )}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function TracksPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  // Get all tracks
  const allTracks = useQuery(api.tracks.getAllTracks, {
    category: selectedCategory || undefined,
    difficulty: selectedDifficulty as any || undefined,
  });

  // Get user enrollments to show enrolled status
  const userEnrollments = useQuery(
    api.tracks.getUserEnrollments,
    user ? { userId: user.id } : "skip"
  );

  const enrolledTrackIds = userEnrollments?.map(e => e.track?._id).filter(Boolean) || [];

  // Filter tracks based on search
  const filteredTracks = allTracks?.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  // Get unique categories for filter
  const categories = [...new Set(allTracks?.map(track => track.category) || [])];

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
            
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
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
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Learning Tracks
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master new skills with our structured learning paths. 
              From beginner-friendly introductions to advanced concepts.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tracks, topics, or technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-40">
                <TrendingUp className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{allTracks.length}</div>
                <div className="text-sm text-muted-foreground">Total Tracks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {allTracks.filter(t => t.difficulty === "beginner").length}
                </div>
                <div className="text-sm text-muted-foreground">Beginner</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {allTracks.filter(t => t.difficulty === "intermediate").length}
                </div>
                <div className="text-sm text-muted-foreground">Intermediate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {allTracks.filter(t => t.difficulty === "advanced").length}
                </div>
                <div className="text-sm text-muted-foreground">Advanced</div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {searchQuery || selectedCategory || selectedDifficulty 
                  ? `Filtered Results (${filteredTracks.length})` 
                  : "All Learning Tracks"
                }
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
                  <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or browse all tracks.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setSelectedDifficulty("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTracks.map((track) => (
                  <TrackCard
                    key={track._id}
                    track={track}
                    isEnrolled={enrolledTrackIds.includes(track._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
