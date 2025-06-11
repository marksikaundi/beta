// filepath: /Users/marksikaundi/Documents/progress/101/beta/components/dashboard/challenge-progress.tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { FileCode, ChevronRight, Award, Check, Star } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

// Temporary type definitions until the generated types are available
interface UserStats {
  totalCompleted: number;
  byDifficulty: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  byCategory: Record<string, number>;
  totalPoints: number;
  streak: number;
}

interface Challenge {
  _id: string;
  title: string;
  difficulty: string;
  points: number;
  category?: string;
}

export function ChallengeProgress() {
  // Replace with direct lab completions query until challenge_progress is generated
  const labCompletions = useQuery(api.labs.getUserCompletions) || [];
  const labs = useQuery(api.labs.list) || [];

  // Manually compute the statistics
  const userStats: UserStats = {
    totalCompleted: labCompletions.length,
    byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
    byCategory: {},
    totalPoints: 0,
    streak: 0,
  };

  // Calculate recommended challenges
  const completedLabIds = new Set(
    labCompletions.map((completion: any) => completion.labId)
  );
  const recommendedChallenges: Challenge[] = labs
    .filter((lab: any) => !completedLabIds.has(lab._id))
    .slice(0, 5);

  // Process lab completions to build stats
  labCompletions.forEach((completion: any) => {
    const lab = labs.find((l: any) => l._id === completion.labId);
    if (lab) {
      // Count by difficulty
      if (lab.difficulty) {
        userStats.byDifficulty[
          lab.difficulty as keyof typeof userStats.byDifficulty
        ]++;
      }

      // Count by category
      if (lab.category) {
        userStats.byCategory[lab.category] =
          (userStats.byCategory[lab.category] || 0) + 1;
      }

      // Sum points
      userStats.totalPoints += lab.points || 0;
    }
  });

  // Simple streak calculation
  if (labCompletions.length > 0) {
    userStats.streak = 1; // At least 1 day if they have completions
  }

  // Handle loading state
  if (!labCompletions || !labs) {
    return (
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <FileCode className="h-5 w-5 text-primary" />
            <span>Coding Challenges</span>
          </CardTitle>
          <CardDescription>
            Track your coding challenge progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle empty state
  if (userStats.totalCompleted === 0) {
    return (
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <FileCode className="h-5 w-5 text-primary" />
            <span>Coding Challenges</span>
          </CardTitle>
          <CardDescription>Get started with coding challenges</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <FileCode className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No challenges completed yet</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Solve challenges to improve your coding skills and earn points.
          </p>
          <Button asChild>
            <Link href="/challenges">
              Browse Challenges
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // When user has completed challenges
  return (
    <Card className="modern-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center space-x-2">
              <FileCode className="h-5 w-5 text-primary" />
              <span>Coding Challenges</span>
            </CardTitle>
            <CardDescription>
              Your progress on coding challenges
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            {userStats.totalPoints} points
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b">
          <div className="text-center p-2">
            <p className="text-2xl font-bold">{userStats.totalCompleted}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl font-bold">{userStats.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl font-bold text-green-500">
              {userStats.byDifficulty?.Easy || 0}
            </p>
            <p className="text-xs text-muted-foreground">Easy</p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl font-bold text-yellow-500">
              {userStats.byDifficulty?.Medium || 0}
            </p>
            <p className="text-xs text-muted-foreground">Medium</p>
          </div>
        </div>

        {/* Progress by category */}
        {Object.keys(userStats.byCategory || {}).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Progress by Category</h3>
            {Object.entries(userStats.byCategory).map(([category, count]) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category}</span>
                  <span className="text-muted-foreground">
                    {count} completed
                  </span>
                </div>
                <Progress
                  value={Math.min((count as number) * 10, 100)}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        )}

        {/* Recommended challenges */}
        {recommendedChallenges.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Recommended Challenges</h3>
            <div className="space-y-2">
              {recommendedChallenges.slice(0, 3).map((challenge) => (
                <Link key={challenge._id} href={`/lab?id=${challenge._id}`}>
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${
                          challenge.difficulty === "Easy"
                            ? "bg-green-500"
                            : challenge.difficulty === "Medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        } text-xs`}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <span className="text-sm font-medium">
                        {challenge.title}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/challenges">
            View All Challenges
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
