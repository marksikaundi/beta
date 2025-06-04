import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Create a notification
export const createNotification = mutation({
  args: {
    userId: v.string(),
    type: v.union(
      v.literal("achievement"),
      v.literal("streak-reminder"),
      v.literal("new-lesson"),
      v.literal("discussion-reply"),
      v.literal("level-up"),
      v.literal("certificate-earned")
    ),
    title: v.string(),
    message: v.string(),
    data: v.optional(
      v.object({
        trackId: v.optional(v.id("tracks")),
        lessonId: v.optional(v.id("lessons")),
        achievementId: v.optional(v.id("achievements")),
        url: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      data: args.data,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return notificationId;
  },
});

// Get user notifications
export const getUserNotifications = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.unreadOnly) {
      query = query.filter((q) => q.eq(q.field("isRead"), false));
    }

    const notifications = await query.order("desc").take(args.limit || 20);

    return notifications;
  },
});

// Mark notification as read
export const markNotificationAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });
  },
});

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
      });
    }

    return { updatedCount: unreadNotifications.length };
  },
});

// Get notification count
export const getUnreadNotificationCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .collect();

    return unreadNotifications.length;
  },
});

// Delete notification
export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
  },
});

// Create system notifications for achievements, level ups, etc.
export const triggerAchievementNotification = mutation({
  args: {
    userId: v.string(),
    achievementTitle: v.string(),
    achievementDescription: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "achievement",
      title: "🏆 Achievement Unlocked!",
      message: `You've earned "${args.achievementTitle}": ${args.achievementDescription}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const triggerLevelUpNotification = mutation({
  args: {
    userId: v.string(),
    newLevel: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "level-up",
      title: "🎉 Level Up!",
      message: `Congratulations! You've reached level ${args.newLevel}!`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const triggerStreakReminder = mutation({
  args: {
    userId: v.string(),
    streakDays: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "streak-reminder",
      title: "🔥 Keep Your Streak Alive!",
      message: `You're on a ${args.streakDays} day learning streak. Don't break it now!`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  },
});

// Test function to create sample notifications (development only)
export const createSampleNotifications = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const sampleNotifications = [
      {
        type: "achievement" as const,
        title: "🏆 Achievement Unlocked!",
        message:
          "You've earned 'First Steps': Complete your first coding lesson successfully.",
      },
      {
        type: "level-up" as const,
        title: "🎉 Level Up!",
        message: "Congratulations! You've reached level 2 and earned 100 XP.",
      },
      {
        type: "streak-reminder" as const,
        title: "🔥 Keep Your Streak Alive!",
        message: "You're on a 5 day learning streak. Don't break it now!",
      },
      {
        type: "new-lesson" as const,
        title: "📚 New Lesson Available!",
        message:
          "Advanced JavaScript Functions is now available in your track.",
      },
      {
        type: "discussion-reply" as const,
        title: "💬 New Reply",
        message: "Someone replied to your discussion about React Hooks.",
      },
      {
        type: "certificate-earned" as const,
        title: "🎓 Certificate Earned!",
        message:
          "You've completed JavaScript Fundamentals and earned your certificate!",
      },
    ];

    const createdNotifications = [];
    for (const notification of sampleNotifications) {
      const notificationId = await ctx.db.insert("notifications", {
        userId: args.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: Math.random() > 0.7, // 30% chance of being read
        createdAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // Random time in last 7 days
      });
      createdNotifications.push(notificationId);
    }

    return {
      message: `Created ${createdNotifications.length} sample notifications`,
      notificationIds: createdNotifications,
    };
  },
});

// Test function to clear all notifications for a user (development only)
export const clearAllUserNotifications = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const notification of userNotifications) {
      await ctx.db.delete(notification._id);
    }

    return { message: `Deleted ${userNotifications.length} notifications` };
  },
});

// Test function to trigger a level-up notification (development only)
export const triggerTestLevelUp = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "level-up",
      title: "🎉 Level Up!",
      message: "Congratulations! You've reached level 3 and earned 150 XP.",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return { message: "Level-up notification created successfully" };
  },
});

// Test function to trigger an achievement notification (development only)
export const triggerTestAchievement = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "achievement",
      title: "🏆 Achievement Unlocked!",
      message:
        "You've earned 'Code Master': Complete 10 coding challenges successfully.",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return { message: "Achievement notification created successfully" };
  },
});
