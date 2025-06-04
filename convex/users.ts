import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user profile
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    username: v.string(),
    displayName: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = new Date().toISOString();

    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        email: args.email,
        username: args.username,
        displayName: args.displayName,
        avatar: args.avatar,
        updatedAt: now,
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        username: args.username,
        displayName: args.displayName,
        avatar: args.avatar,
        bio: "",
        level: 1,
        experience: 0,
        streakDays: 0,
        lastActiveDate: now,
        subscriptionTier: "free",
        preferredLanguages: [],
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get user by username
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    bio: v.optional(v.string()),
    githubUsername: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    preferredLanguages: v.optional(v.array(v.string())),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (args.bio !== undefined) updateData.bio = args.bio;
    if (args.githubUsername !== undefined) updateData.githubUsername = args.githubUsername;
    if (args.linkedinUrl !== undefined) updateData.linkedinUrl = args.linkedinUrl;
    if (args.websiteUrl !== undefined) updateData.websiteUrl = args.websiteUrl;
    if (args.preferredLanguages !== undefined) updateData.preferredLanguages = args.preferredLanguages;
    if (args.timezone !== undefined) updateData.timezone = args.timezone;

    return await ctx.db.patch(user._id, updateData);
  },
});

// Add experience points and update level
export const addExperience = mutation({
  args: {
    clerkId: v.string(),
    points: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const newExperience = user.experience + args.points;
    
    // Calculate level based on experience (100 XP per level for simplicity)
    const newLevel = Math.floor(newExperience / 100) + 1;
    const leveledUp = newLevel > user.level;

    await ctx.db.patch(user._id, {
      experience: newExperience,
      level: newLevel,
      updatedAt: new Date().toISOString(),
    });

    // If user leveled up, create notification
    if (leveledUp) {
      await ctx.db.insert("notifications", {
        userId: args.clerkId,
        type: "level-up",
        title: `Level Up! You're now level ${newLevel}`,
        message: `Congratulations! You've reached level ${newLevel} and earned ${args.points} XP.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return { leveledUp, newLevel, newExperience };
  },
});

// Update user's learning streak
export const updateStreak = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const today = new Date().toISOString().split('T')[0];
    const lastActiveDate = user.lastActiveDate.split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let newStreakDays = user.streakDays;

    if (lastActiveDate === yesterday) {
      // Continue streak
      newStreakDays += 1;
    } else if (lastActiveDate !== today) {
      // Reset streak if more than a day has passed
      newStreakDays = 1;
    }

    await ctx.db.patch(user._id, {
      streakDays: newStreakDays,
      lastActiveDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Check for streak achievements
    if (newStreakDays === 7 || newStreakDays === 30 || newStreakDays === 100) {
      await ctx.db.insert("achievements", {
        userId: args.clerkId,
        type: "streak",
        title: `${newStreakDays} Day Streak!`,
        description: `You've maintained a ${newStreakDays} day learning streak!`,
        icon: "flame",
        color: "#f59e0b",
        metadata: { streakDays: newStreakDays },
        earnedAt: new Date().toISOString(),
      });
    }

    return newStreakDays;
  },
});

// Get user's dashboard stats
export const getUserStats = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    // Get enrollments count
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", args.clerkId))
      .collect();

    // Get completed lessons count
    const completedLessons = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", args.clerkId))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    // Get achievements count
    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", args.clerkId))
      .collect();

    // Calculate total time spent
    const totalTimeSpent = enrollments.reduce((total, enrollment) => total + enrollment.totalTimeSpent, 0);

    return {
      user,
      stats: {
        tracksEnrolled: enrollments.length,
        tracksCompleted: enrollments.filter(e => e.completedAt).length,
        lessonsCompleted: completedLessons.length,
        totalTimeSpent: Math.round(totalTimeSpent),
        achievements: achievements.length,
        currentStreak: user.streakDays,
      }
    };
  },
});

// Get leaderboard data
export const getLeaderboard = query({
  args: {
    type: v.union(v.literal("global"), v.literal("weekly"), v.literal("monthly")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    // For simplicity, we'll get users sorted by experience points
    // In a real implementation, you'd maintain separate leaderboard tables
    const users = await ctx.db
      .query("users")
      .order("desc")
      .take(limit);

    return users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      experience: user.experience,
      level: user.level,
      streakDays: user.streakDays,
    }));
  },
});

// Update user mutation
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    githubUsername: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    preferredLanguages: v.optional(v.array(v.string())),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { userId, ...updateData } = args;
    
    // Only update fields that are provided
    const fieldsToUpdate: any = {
      updatedAt: new Date().toISOString(),
    };
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        fieldsToUpdate[key] = value;
      }
    });

    await ctx.db.patch(userId, fieldsToUpdate);
    
    return { success: true };
  },
});