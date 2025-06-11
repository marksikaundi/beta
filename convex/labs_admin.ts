import { mutation } from "./_generated/server";
import { v } from "convex/values";

const labDataSchema = {
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
  category: v.optional(v.string()),
  order: v.optional(v.number()),
  prerequisites: v.optional(v.array(v.id("labs"))),
  points: v.number(),
  timeLimit: v.number(),
  isPublished: v.boolean(),
};

export const createLab = mutation({
  args: labDataSchema,
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

    // Basic validation
    if (args.title.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }

    if (args.timeLimit <= 0) {
      throw new Error("Time limit must be greater than 0");
    }

    if (args.points <= 0) {
      throw new Error("Points must be greater than 0");
    }

    if (args.testCases.length === 0) {
      throw new Error("At least one test case is required");
    }

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
    ...labDataSchema,
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // TODO: Add admin role check

    // Basic validation
    if (updates.title.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }

    if (updates.timeLimit <= 0) {
      throw new Error("Time limit must be greater than 0");
    }

    if (updates.points <= 0) {
      throw new Error("Points must be greater than 0");
    }

    if (updates.testCases.length === 0) {
      throw new Error("At least one test case is required");
    }

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Lab not found");
    }

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

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Lab not found");
    }

    await ctx.db.delete(args.id);
  },
});
