import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get global leaderboard
export const getGlobalLeaderboard = query({
  args: {
    period: v.optional(
      v.union(v.literal("weekly"), v.literal("monthly"), v.literal("all-time"))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const period = args.period || "all-time";
    const limit = args.limit || 50;

    // Get all users with their stats
    const users = await ctx.db.query("users").collect();

    // Calculate scores based on period
    let leaderboardData = [];

    for (const user of users) {
      let experienceGained = 0;
      let lessonsCompleted = 0;
      let score = 0;

      if (period === "all-time") {
        experienceGained = user.experience;
        score = user.experience;

        // Count completed lessons
        const completedLessons = await ctx.db
          .query("progress")
          .withIndex("by_user", (q) => q.eq("userId", user.clerkId))
          .filter((q) => q.eq(q.field("status"), "completed"))
          .collect();

        lessonsCompleted = completedLessons.length;
      } else {
        // For weekly/monthly, we need to filter by date
        const now = new Date();
        let startDate: Date;

        if (period === "weekly") {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // Get progress in the period
        const progressInPeriod = await ctx.db
          .query("progress")
          .withIndex("by_user", (q) => q.eq("userId", user.clerkId))
          .filter((q) =>
            q.and(
              q.eq(q.field("status"), "completed"),
              q.gte(q.field("completedAt"), startDate.toISOString())
            )
          )
          .collect();

        lessonsCompleted = progressInPeriod.length;

        // Calculate experience from lessons completed in period
        for (const progress of progressInPeriod) {
          const lesson = await ctx.db.get(progress.lessonId);
          if (lesson) {
            experienceGained += lesson.experiencePoints;
          }
        }

        score = experienceGained;
      }

      leaderboardData.push({
        userId: user.clerkId,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        level: user.level,
        score,
        experienceGained,
        lessonsCompleted,
      });
    }

    // Sort by score and add ranks
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData = leaderboardData.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return leaderboardData;
  },
});

// Get track-specific leaderboard
export const getTrackLeaderboard = query({
  args: {
    trackId: v.id("tracks"),
    period: v.optional(
      v.union(v.literal("weekly"), v.literal("monthly"), v.literal("all-time"))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const period = args.period || "all-time";
    const limit = args.limit || 50;

    // Get all enrollments for this track
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_track", (q) => q.eq("trackId", args.trackId))
      .collect();

    let leaderboardData = [];

    for (const enrollment of enrollments) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", enrollment.userId))
        .unique();

      if (!user) continue;

      let experienceGained = 0;
      let lessonsCompleted = 0;
      let score = 0;

      if (period === "all-time") {
        // Get all completed lessons in this track
        const completedLessons = await ctx.db
          .query("progress")
          .withIndex("by_user_and_track", (q) =>
            q.eq("userId", enrollment.userId).eq("trackId", args.trackId)
          )
          .filter((q) => q.eq(q.field("status"), "completed"))
          .collect();

        lessonsCompleted = completedLessons.length;

        // Calculate total experience from this track
        for (const progress of completedLessons) {
          const lesson = await ctx.db.get(progress.lessonId);
          if (lesson) {
            experienceGained += lesson.experiencePoints;
          }
        }

        // Score based on progress percentage and time efficiency
        score = enrollment.progress * 10 + experienceGained;
      } else {
        // Filter by period for weekly/monthly
        const now = new Date();
        let startDate: Date;

        if (period === "weekly") {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const progressInPeriod = await ctx.db
          .query("progress")
          .withIndex("by_user_and_track", (q) =>
            q.eq("userId", enrollment.userId).eq("trackId", args.trackId)
          )
          .filter((q) =>
            q.and(
              q.eq(q.field("status"), "completed"),
              q.gte(q.field("completedAt"), startDate.toISOString())
            )
          )
          .collect();

        lessonsCompleted = progressInPeriod.length;

        for (const progress of progressInPeriod) {
          const lesson = await ctx.db.get(progress.lessonId);
          if (lesson) {
            experienceGained += lesson.experiencePoints;
          }
        }

        score = experienceGained;
      }

      leaderboardData.push({
        userId: user.clerkId,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        level: user.level,
        score,
        experienceGained,
        lessonsCompleted,
        trackProgress: enrollment.progress,
      });
    }

    // Sort by score and add ranks
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData = leaderboardData.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return leaderboardData;
  },
});

// Get user's rank in global leaderboard
export const getUserGlobalRank = query({
  args: {
    userId: v.string(),
    period: v.optional(
      v.union(v.literal("weekly"), v.literal("monthly"), v.literal("all-time"))
    ),
  },
  handler: async (ctx, args) => {
    const leaderboard = await getGlobalLeaderboard(ctx, {
      period: args.period,
      limit: 1000, // Get more entries to find user's rank
    });

    const userEntry = leaderboard.find((entry) => entry.userId === args.userId);
    return userEntry?.rank || null;
  },
});

// Get user's rank in track leaderboard
export const getUserTrackRank = query({
  args: {
    userId: v.string(),
    trackId: v.id("tracks"),
    period: v.optional(
      v.union(v.literal("weekly"), v.literal("monthly"), v.literal("all-time"))
    ),
  },
  handler: async (ctx, args) => {
    const leaderboard = await getTrackLeaderboard(ctx, {
      trackId: args.trackId,
      period: args.period,
      limit: 1000,
    });

    const userEntry = leaderboard.find((entry) => entry.userId === args.userId);
    return userEntry?.rank || null;
  },
});

// Get leaderboard stats summary
export const getLeaderboardStats = query({
  handler: async (ctx) => {
    const totalUsers = await ctx.db.query("users").collect();
    const totalTracks = await ctx.db.query("tracks").collect();
    const totalLessons = await ctx.db.query("lessons").collect();

    // Get top performers this week
    const weeklyLeaderboard = await getGlobalLeaderboard(ctx, {
      period: "weekly",
      limit: 3,
    });

    // Get most active tracks
    const trackEnrollments = await ctx.db.query("enrollments").collect();
    const trackStats = new Map<string, number>();

    trackEnrollments.forEach((enrollment) => {
      const current = trackStats.get(enrollment.trackId) || 0;
      trackStats.set(enrollment.trackId, current + 1);
    });

    const topTracks = Array.from(trackStats.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topTracksWithDetails = await Promise.all(
      topTracks.map(async ([trackId, enrollmentCount]) => {
        const track = await ctx.db.get(trackId as Id<"tracks">);
        return track ? { track, enrollmentCount } : null;
      })
    );

    return {
      totalUsers: totalUsers.length,
      totalTracks: totalTracks.length,
      totalLessons: totalLessons.length,
      weeklyTopPerformers: weeklyLeaderboard,
      mostPopularTracks: topTracksWithDetails.filter(Boolean),
    };
  },
});

// Update leaderboard cache (to be called periodically)
export const updateLeaderboardCache = mutation({
  handler: async (ctx) => {
    const now = new Date();
    const currentWeek = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // Update global leaderboards
    const globalWeekly = await getGlobalLeaderboard(ctx, {
      period: "weekly",
      limit: 100,
    });
    const globalMonthly = await getGlobalLeaderboard(ctx, {
      period: "monthly",
      limit: 100,
    });
    const globalAllTime = await getGlobalLeaderboard(ctx, {
      period: "all-time",
      limit: 100,
    });

    // Store or update leaderboard entries
    await ctx.db.insert("leaderboards", {
      type: "weekly",
      period: currentWeek,
      entries: globalWeekly,
      lastUpdated: now.toISOString(),
      createdAt: now.toISOString(),
    });

    await ctx.db.insert("leaderboards", {
      type: "monthly",
      period: currentMonth,
      entries: globalMonthly,
      lastUpdated: now.toISOString(),
      createdAt: now.toISOString(),
    });

    await ctx.db.insert("leaderboards", {
      type: "global",
      period: "all-time",
      entries: globalAllTime,
      lastUpdated: now.toISOString(),
      createdAt: now.toISOString(),
    });

    return { success: true, updatedAt: now.toISOString() };
  },
});
