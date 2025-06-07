import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Add update lesson functionality
export const updateLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    title: v.string(),
    description: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("reading"),
      v.literal("coding"),
      v.literal("quiz"),
      v.literal("project"),
      v.literal("video")
    ),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    estimatedMinutes: v.number(),
    experiencePoints: v.number(),
    tags: v.array(v.string()),
    isPublished: v.boolean(),
    isPremium: v.boolean(),
    starterCode: v.optional(v.string()),
    solutionCode: v.optional(v.string()),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if the user is an admin (in a real app, you'd check permissions)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Make sure the lesson exists
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Update the lesson
    await ctx.db.patch(args.lessonId, {
      title: args.title,
      description: args.description,
      content: args.content,
      type: args.type,
      difficulty: args.difficulty,
      estimatedMinutes: args.estimatedMinutes,
      experiencePoints: args.experiencePoints,
      tags: args.tags,
      isPublished: args.isPublished,
      isPremium: args.isPremium,
      starterCode: args.starterCode,
      solutionCode: args.solutionCode,
      language: args.language,
      updatedAt: new Date().toISOString(),
    });

    return args.lessonId;
  },
});
