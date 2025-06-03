import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const updateProgress = mutation({
  args: {
    userId: v.string(),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, lessonId, completed, code } = args;

    // Update progress
    await ctx.db.insert("userProgress", {
      userId,
      lessonId,
      completed,
      code,
      completedAt: completed ? Date.now() : undefined,
    });

    // Update streak if completed
    if (completed) {
      const today = new Date().setHours(0, 0, 0, 0);
      const streak = await ctx.db
        .query("dailyStreaks")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      if (streak) {
        const lastActivity = new Date(streak.lastActivityDate).setHours(
          0,
          0,
          0,
          0
        );
        const daysDiff = Math.floor(
          (today - lastActivity) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Increment streak
          await ctx.db.patch(streak._id, {
            currentStreak: streak.currentStreak + 1,
            lastActivityDate: Date.now(),
          });
        } else if (daysDiff > 1 && streak.emberCount > 0) {
          // Use an ember to maintain streak
          await ctx.db.patch(streak._id, {
            emberCount: streak.emberCount - 1,
            lastActivityDate: Date.now(),
          });
        } else if (daysDiff > 1) {
          // Reset streak
          await ctx.db.patch(streak._id, {
            currentStreak: 1,
            lastActivityDate: Date.now(),
          });
        }
      } else {
        // Create first streak
        await ctx.db.insert("dailyStreaks", {
          userId,
          currentStreak: 1,
          lastActivityDate: Date.now(),
          emberCount: 0,
        });
      }
    }
  },
});
