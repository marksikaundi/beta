import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createLab = mutation({
  args: {
    title: v.string(),
    difficulty: v.union(
      v.literal("Easy"),
      v.literal("Medium"),
      v.literal("Hard")
    ),
    description: v.string(),
    problemStatement: v.string(),
    examples: v.array(
      v.object({
        input: v.string(),
        output: v.string(),
        explanation: v.optional(v.string()),
      })
    ),
    testCases: v.array(
      v.object({
        input: v.string(),
        expectedOutput: v.string(),
        description: v.string(),
      })
    ),
    starterCode: v.object({
      javascript: v.string(),
      python: v.string(),
    }),
    hints: v.array(v.string()),
    constraints: v.array(v.string()),
    tags: v.array(v.string()),
    points: v.number(),
    timeLimit: v.number(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // TODO: Add admin role check
    // const user = await ctx.db.query("users").filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)).first();
    // if (!user?.isAdmin) {
    //   throw new Error("Not authorized");
    // }

    const now = new Date().toISOString();
    const labId = await ctx.db.insert("labs", {
      ...args,
      createdAt: now,
      updatedAt: now,
      createdBy: identity.tokenIdentifier,
    });

    return labId;
  },
});

export const updateLab = mutation({
  args: {
    id: v.id("labs"),
    title: v.string(),
    difficulty: v.union(
      v.literal("Easy"),
      v.literal("Medium"),
      v.literal("Hard")
    ),
    description: v.string(),
    problemStatement: v.string(),
    examples: v.array(
      v.object({
        input: v.string(),
        output: v.string(),
        explanation: v.optional(v.string()),
      })
    ),
    testCases: v.array(
      v.object({
        input: v.string(),
        expectedOutput: v.string(),
        description: v.string(),
      })
    ),
    starterCode: v.object({
      javascript: v.string(),
      python: v.string(),
    }),
    hints: v.array(v.string()),
    constraints: v.array(v.string()),
    tags: v.array(v.string()),
    points: v.number(),
    timeLimit: v.number(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // TODO: Add admin role check

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const deleteLab = mutation({
  args: { id: v.id("labs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // TODO: Add admin role check

    await ctx.db.delete(args.id);
  },
});
