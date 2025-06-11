import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  executeJavaScript,
  type TestCase,
  type ExecutionResult,
} from "@/lib/code-execution";

export const list = query({
  handler: async (ctx) => {
    const labs = await ctx.db
      .query("labs")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
    return labs;
  },
});

export const getById = query({
  args: { id: v.id("labs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const validateSolution = mutation({
  args: {
    labId: v.id("labs"),
    code: v.string(),
    language: v.union(v.literal("javascript"), v.literal("python")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const lab = await ctx.db.get(args.labId);
    if (!lab) {
      throw new Error("Lab not found");
    }

    // Run tests for the solution
    const testResults = await Promise.all(
      lab.testCases.map(async (testCase) => {
        // TODO: Implement secure code execution
        // This is a placeholder for actual test execution logic
        const result =
          args.language === "javascript"
            ? await executeJavaScript(args.code, [testCase])
            : await executeJavaScript(args.code, [testCase]); // TODO: Add Python execution
        // Get the first test result since we're running one at a time
        const testResult = result.testResults?.[0];
        return {
          ...testCase,
          passed: testResult?.passed ?? false,
          actual: testResult?.actual ?? "",
        };
      })
    );

    const passed = testResults.every((result) => result.passed);

    // If all tests pass, record the completion
    if (passed) {
      // Check if the user has already completed this lab
      const existingCompletion = await ctx.db
        .query("labCompletions")
        .withIndex("by_user_lab", (q) =>
          q.eq("userId", identity.tokenIdentifier).eq("labId", args.labId)
        )
        .first();

      if (existingCompletion) {
        // Update the existing completion
        await ctx.db.patch(existingCompletion._id, {
          updatedAt: new Date().toISOString(),
          code: args.code,
          language: args.language,
          attempts: (existingCompletion.attempts || 1) + 1,
        });
      } else {
        // Create a new completion record
        await ctx.db.insert("labCompletions", {
          labId: args.labId,
          userId: identity.tokenIdentifier,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          code: args.code,
          language: args.language,
          attempts: 1,
          category: lab.category,
          difficulty: lab.difficulty,
          points: lab.points,
        });
      }
    }

    return {
      passed,
      testResults,
      output: "Tests completed",
      executionTime: 0, // Placeholder since we're not actually measuring execution time yet
    };
  },
});

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

export const getByCategory = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.category) {
      return await ctx.db
        .query("labs")
        .filter((q) => q.eq(q.field("isPublished"), true))
        .collect();
    }

    return await ctx.db
      .query("labs")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
  },
});

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

    // Calculate streak (simple implementation)
    let streak = 0;
    const today = new Date();

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
