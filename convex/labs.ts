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
      await ctx.db.insert("labCompletions", {
        labId: args.labId,
        userId: identity.tokenIdentifier,
        completedAt: new Date().toISOString(),
        code: args.code,
        language: args.language,
      });
    }

    return {
      passed,
      testResults,
    };
  },
});
