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
