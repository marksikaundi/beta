import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    language: v.string(),
    difficulty: v.string(),
    order: v.number(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const courseId = await ctx.db.insert("courses", args);
    return courseId;
  },
});

export const getLessons = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const q = await ctx.db.query("lessons");
    return await q
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .order("asc")
      .collect();
  },
});
