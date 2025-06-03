import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  courses: defineTable({
    title: v.string(),
    description: v.string(),
    language: v.string(),
    difficulty: v.string(),
    order: v.number(),
    imageUrl: v.optional(v.string()),
  }),

  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    content: v.string(),
    order: v.number(),
    points: v.number(),
  }),

  userProgress: defineTable({
    userId: v.string(),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
    code: v.string(),
    completedAt: v.optional(v.number()),
  }),

  achievements: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    requiredPoints: v.number(),
  }),

  userAchievements: defineTable({
    userId: v.string(),
    achievementId: v.id("achievements"),
    unlockedAt: v.number(),
  }),

  dailyStreaks: defineTable({
    userId: v.string(),
    currentStreak: v.number(),
    lastActivityDate: v.number(),
    emberCount: v.number(),
  }),
});
