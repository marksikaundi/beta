import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all completions for a specific user
export const getUserCompletions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const completions = await ctx.db
      .query("labCompletions")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    return completions;
  },
});

// Get completion statistics for a user
export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        totalCompleted: 0,
        byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
        byCategory: {},
        totalPoints: 0,
        streak: 0,
      };
    }

    const completions = await ctx.db
      .query("labCompletions")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    // Calculate statistics
    const totalCompleted = completions.length;
    let totalPoints = 0;
    const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
    const byCategory: Record<string, number> = {};

    completions.forEach((completion) => {
      // Count by difficulty
      if (completion.difficulty) {
        byDifficulty[completion.difficulty as keyof typeof byDifficulty]++;
      }

      // Count by category
      if (completion.category) {
        byCategory[completion.category] =
          (byCategory[completion.category] || 0) + 1;
      }

      // Sum points
      totalPoints += completion.points || 0;
    });

    // Calculate streak (simple implementation - can be enhanced)
    let streak = 0;
    const today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Sort completions by date, most recent first
    const sortedCompletions = [...completions].sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    // Check if user has completed a challenge today
    const mostRecent = sortedCompletions[0];
    if (mostRecent) {
      const mostRecentDate = new Date(mostRecent.completedAt);
      const isToday =
        today.getDate() === mostRecentDate.getDate() &&
        today.getMonth() === mostRecentDate.getMonth() &&
        today.getFullYear() === mostRecentDate.getFullYear();

      if (isToday) {
        streak = 1;
        let checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - 1);

        // Check previous days
        for (let i = 1; i < sortedCompletions.length; i++) {
          const hasCompletionOnDate = sortedCompletions.some((completion) => {
            const completionDate = new Date(completion.completedAt);
            return (
              completionDate.getDate() === checkDate.getDate() &&
              completionDate.getMonth() === checkDate.getMonth() &&
              completionDate.getFullYear() === checkDate.getFullYear()
            );
          });

          if (hasCompletionOnDate) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    return {
      totalCompleted,
      byDifficulty,
      byCategory,
      totalPoints,
      streak,
    };
  },
});

// Get recommended challenges for a user based on their history
export const getRecommendedChallenges = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get user's completed challenges
    const completions = await ctx.db
      .query("labCompletions")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    const completedLabIds = new Set(completions.map((c) => c.labId));

    // Get all published labs
    const allLabs = await ctx.db
      .query("labs")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    // Filter out completed labs
    const incompleteLabs = allLabs.filter(
      (lab) => !completedLabIds.has(lab._id)
    );

    // Get categories and difficulties the user has engaged with
    const engagedCategories = new Set(
      completions.map((c) => c.category).filter(Boolean)
    );
    const engagedDifficulties = new Set(
      completions.map((c) => c.difficulty).filter(Boolean)
    );

    // Scoring function for recommendations
    const scoreChallenge = (lab: any) => {
      let score = 0;

      // Prioritize labs in categories the user has completed before
      if (lab.category && engagedCategories.has(lab.category)) {
        score += 5;
      }

      // Prioritize appropriate difficulty progression
      if (lab.difficulty === "Easy" && engagedDifficulties.has("Easy")) {
        score += 3;
      } else if (
        lab.difficulty === "Medium" &&
        engagedDifficulties.has("Easy")
      ) {
        score += 4;
      } else if (
        lab.difficulty === "Hard" &&
        engagedDifficulties.has("Medium")
      ) {
        score += 4;
      }

      // Prioritize labs with lower order within a category
      if (lab.order !== undefined) {
        score += (1000 - lab.order) / 1000;
      }

      return score;
    };

    // Score and sort the challenges
    const recommendedChallenges = incompleteLabs
      .map((lab) => ({ ...lab, score: scoreChallenge(lab) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return recommendedChallenges;
  },
});
