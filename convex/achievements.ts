import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAchievements = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userAchievements = await ctx.db
      .query("userAchievements")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const achievements = await ctx.db.query("achievements").collect();

    return {
      unlocked: userAchievements,
      available: achievements,
    };
  },
});

export const checkAndGrantAchievements = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get user's completed lessons
    const progress = await ctx.db
      .query("userProgress")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();

    // Calculate total points
    const lessons = await ctx.db.query("lessons").collect();
    const totalPoints = progress.reduce((sum, up) => {
      const lesson = lessons.find((l) => l._id === up.lessonId);
      return sum + (lesson?.points || 0);
    }, 0);

    // Check for new achievements
    const achievements = await ctx.db.query("achievements").collect();
    const userAchievements = await ctx.db
      .query("userAchievements")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const newAchievements = achievements.filter(
      (achievement) =>
        achievement.requiredPoints <= totalPoints &&
        !userAchievements.some((ua) => ua.achievementId === achievement._id)
    );

    // Grant new achievements
    for (const achievement of newAchievements) {
      await ctx.db.insert("userAchievements", {
        userId,
        achievementId: achievement._id,
        unlockedAt: Date.now(),
      });
    }

    return newAchievements;
  },
});
