import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// Add update track functionality
export const updateTrack = mutation({
  args: {
    trackId: v.id("tracks"),
    title: v.string(),
    description: v.string(),
    longDescription: v.string(),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    estimatedHours: v.number(),
    thumbnail: v.string(),
    banner: v.optional(v.string()),
    color: v.string(),
    icon: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    isPublished: v.boolean(),
    isPremium: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if the user is an admin (in a real app, you'd check permissions)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Make sure the track exists
    const track = await ctx.db.get(args.trackId);
    if (!track) {
      throw new Error("Track not found");
    }

    // Update the track
    await ctx.db.patch(args.trackId, {
      title: args.title,
      description: args.description,
      longDescription: args.longDescription,
      difficulty: args.difficulty,
      estimatedHours: args.estimatedHours,
      thumbnail: args.thumbnail,
      banner: args.banner,
      color: args.color,
      icon: args.icon,
      category: args.category,
      tags: args.tags,
      isPublished: args.isPublished,
      isPremium: args.isPremium,
      updatedAt: new Date().toISOString(),
    });

    return args.trackId;
  },
});
