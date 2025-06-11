"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  FileCode,
  Clock,
  Award,
  Filter,
  Search,
  Tag,
  Check,
  ChevronRight,
} from "lucide-react";

// Challenge Card Component
interface ChallengeCardProps {
  lab: any;
  router: any;
}

function ChallengeCard({ lab, router }: ChallengeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge
            className={`mb-2 ${
              lab.difficulty === "Easy"
                ? "bg-green-500"
                : lab.difficulty === "Medium"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {lab.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Award className="h-4 w-4" />
            <span className="text-sm">{lab.points} pts</span>
          </div>
        </div>
        <CardTitle className="text-xl">{lab.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {lab.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2 mb-4">
          {lab.tags &&
            lab.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{lab.timeLimit} min</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4">
        <Button
          onClick={() => router.push(`/lab?id=${lab._id}`)}
          className="w-full"
        >
          Solve Challenge
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ChallengesPage() {
  const router = useRouter();
  const labs = useQuery(api.labs.list) || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Extract all unique tags from all labs
  const allTags = Array.from(
    new Set(labs.flatMap((lab) => lab.tags || []))
  ).sort();

  // Extract all unique categories
  const allCategories = Array.from(
    new Set(labs.map(lab => lab.category).filter(Boolean) as string[])
  ).sort();

  // Filter labs based on search query and filters
  const filteredLabs = labs.filter((lab) => {
    // Search filter
    const searchMatches =
      searchQuery === "" ||
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Difficulty filter
    const difficultyMatches =
      !difficultyFilter || lab.difficulty === difficultyFilter;

    // Tag filter
    const tagMatches = !tagFilter || (lab.tags && lab.tags.includes(tagFilter));
    
    // Category filter
    const categoryMatches = 
      !categoryFilter || (lab.category && lab.category === categoryFilter);

    return searchMatches && difficultyMatches && tagMatches && categoryMatches;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-3xl font-bold mb-2">Coding Challenges</h1>
        <p className="text-muted-foreground mb-6">
          Test your skills with these coding challenges. Solve them to earn
          points and improve your ranking.
        </p>

        {/* Search and filter section */}
        <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={difficultyFilter || ""}
            onValueChange={(value) => setDifficultyFilter(value || null)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Category filter */}
          <Select
            value={categoryFilter || ""}
            onValueChange={(value) => setCategoryFilter(value || null)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {allCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Challenge cards grid */}
        {filteredLabs.length === 0 ? (
          <div className="w-full text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <FileCode className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No challenges found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* If no category filter is active, group by category */}
            {!categoryFilter ? (
              allCategories.map(category => {
                const categoryLabs = filteredLabs.filter(lab => lab.category === category);
                if (categoryLabs.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">{category}</h2>
                      {categoryLabs.length > 3 && (
                        <Button variant="outline" size="sm" onClick={() => setCategoryFilter(category)}>
                          View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                      {categoryLabs
                        .sort((a, b) => (a.order || 999) - (b.order || 999))
                        .slice(0, 6)
                        .map((lab) => (
                          <ChallengeCard key={lab._id} lab={lab} router={router} />
                        ))}
                    </div>
                  </div>
                );
              })
            ) : (
              // If category filter is active, show all matching labs
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredLabs
                  .sort((a, b) => (a.order || 999) - (b.order || 999))
                  .map((lab) => (
                    <ChallengeCard key={lab._id} lab={lab} router={router} />
                  ))}
              </div>
            )}
            
            {/* Show uncategorized challenges if they exist */}
            {!categoryFilter && filteredLabs.some(lab => !lab.category) && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Other Challenges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {filteredLabs
                    .filter(lab => !lab.category)
                    .map((lab) => (
                      <ChallengeCard key={lab._id} lab={lab} router={router} />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
