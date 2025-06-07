import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table to store additional user data beyond Clerk
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
    level: v.number(), // User's overall level
    experience: v.number(), // Total XP earned
    streakDays: v.number(), // Current learning streak
    lastActiveDate: v.string(),
    subscriptionTier: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("premium")
    ),
    githubUsername: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    preferredLanguages: v.array(v.string()),
    timezone: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"])
    .index("by_email", ["email"]),

  // Learning tracks (like Backend Development, Frontend, DevOps, etc.)
  tracks: defineTable({
    title: v.string(),
    slug: v.string(),
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
    color: v.string(), // Hex color for track theming
    icon: v.string(), // Icon name for track
    category: v.string(), // "backend", "frontend", "mobile", "devops", etc.
    tags: v.array(v.string()),
    prerequisites: v.array(v.string()), // Array of other track slugs
    isPublished: v.boolean(),
    isPremium: v.boolean(),
    order: v.number(), // Display order
    totalLessons: v.number(),
    enrollmentCount: v.number(),
    averageRating: v.number(),
    createdBy: v.string(), // User ID of creator
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_published", ["isPublished"])
    .index("by_order", ["order"]),

  // Individual lessons within tracks
  lessons: defineTable({
    trackId: v.id("tracks"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(), // Markdown content
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
    order: v.number(), // Order within the track
    isPublished: v.boolean(),
    isPremium: v.boolean(),
    experiencePoints: v.number(), // XP earned upon completion

    // For coding lessons
    starterCode: v.optional(v.string()),
    solutionCode: v.optional(v.string()),
    language: v.optional(v.string()), // "javascript", "python", "go", etc.
    testCases: v.optional(
      v.array(
        v.object({
          input: v.string(),
          expectedOutput: v.string(),
          description: v.string(),
        })
      )
    ),

    // For quiz lessons
    questions: v.optional(
      v.array(
        v.object({
          question: v.string(),
          type: v.union(
            v.literal("multiple-choice"),
            v.literal("true-false"),
            v.literal("code-completion")
          ),
          options: v.optional(v.array(v.string())),
          correctAnswer: v.union(v.string(), v.number()),
          explanation: v.string(),
          points: v.number(),
        })
      )
    ),

    // For video lessons
    videoUrl: v.optional(v.string()),
    videoDuration: v.optional(v.number()),
    transcript: v.optional(v.string()),

    // Common metadata
    tags: v.array(v.string()),
    resources: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          type: v.union(
            v.literal("documentation"),
            v.literal("article"),
            v.literal("tool"),
            v.literal("repo")
          ),
        })
      )
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_track", ["trackId"])
    .index("by_track_and_order", ["trackId", "order"])
    .index("by_slug", ["slug"])
    .index("by_published", ["isPublished"]),

  // User progress tracking
  progress: defineTable({
    userId: v.string(), // Clerk user ID
    lessonId: v.id("lessons"),
    trackId: v.id("tracks"),
    status: v.union(
      v.literal("not-started"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("skipped")
    ),
    completedAt: v.optional(v.string()),
    timeSpent: v.number(), // Minutes spent on lesson
    attempts: v.number(), // Number of attempts for coding/quiz lessons
    score: v.optional(v.number()), // Score for quiz lessons (0-100)
    lastAccessedAt: v.string(),

    // For coding lessons
    submittedCode: v.optional(v.string()),
    testsPassed: v.optional(v.number()),
    totalTests: v.optional(v.number()),

    // For reading lessons
    readingProgress: v.optional(v.number()), // Percentage read (0-100)

    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_track", ["userId", "trackId"])
    .index("by_user_and_lesson", ["userId", "lessonId"])
    .index("by_lesson", ["lessonId"]),

  // Track enrollments
  enrollments: defineTable({
    userId: v.string(),
    trackId: v.id("tracks"),
    enrolledAt: v.string(),
    completedAt: v.optional(v.string()),
    progress: v.number(), // Percentage completed (0-100)
    certificateIssued: v.boolean(),
    certificateId: v.optional(v.string()),
    currentLessonId: v.optional(v.id("lessons")),

    // Learning analytics
    totalTimeSpent: v.number(), // Total minutes spent
    averageScore: v.optional(v.number()),
    streakCount: v.number(), // Consecutive days working on this track
    lastStudiedAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_track", ["trackId"])
    .index("by_user_and_track", ["userId", "trackId"]),

  // User achievements and badges
  achievements: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    description: v.string(),
    earnedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Discussion system
  discussions: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    trackId: v.optional(v.id("tracks")),
    lessonId: v.optional(v.id("lessons")),
    tags: v.array(v.string()),
    upvotes: v.number(),
    downvotes: v.number(),
    replyCount: v.number(),
    viewCount: v.number(),
    isResolved: v.boolean(),
    isPinned: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_track", ["trackId"])
    .index("by_lesson", ["lessonId"])
    .index("by_author", ["authorId"]),

  discussionReplies: defineTable({
    discussionId: v.id("discussions"),
    content: v.string(),
    authorId: v.id("users"),
    parentReplyId: v.optional(v.id("discussionReplies")),
    upvotes: v.number(),
    downvotes: v.number(),
    isAccepted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_discussion", ["discussionId"])
    .index("by_author", ["authorId"]),

  discussionVotes: defineTable({
    userId: v.id("users"),
    discussionId: v.id("discussions"),
    voteType: v.union(v.literal("up"), v.literal("down")),
    createdAt: v.number(),
  }).index("by_user_discussion", ["userId", "discussionId"]),

  // Reply votes
  replyVotes: defineTable({
    userId: v.id("users"),
    replyId: v.id("discussionReplies"),
    voteType: v.union(v.literal("up"), v.literal("down")),
    createdAt: v.number(),
  }).index("by_user_reply", ["userId", "replyId"]),

  // User code submissions and portfolio
  submissions: defineTable({
    userId: v.string(),
    lessonId: v.id("lessons"),
    trackId: v.id("tracks"),
    code: v.string(),
    language: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("passed"),
      v.literal("failed")
    ),
    testResults: v.array(
      v.object({
        test: v.string(),
        passed: v.boolean(),
        output: v.string(),
        expectedOutput: v.string(),
      })
    ),
    executionTime: v.optional(v.number()),
    memoryUsage: v.optional(v.number()),
    score: v.number(), // 0-100
    isPublic: v.boolean(), // Allow others to see this submission
    submittedAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_lesson", ["lessonId"])
    .index("by_user_and_lesson", ["userId", "lessonId"])
    .index("by_public", ["isPublic"]),

  // Leaderboards and competitions
  leaderboards: defineTable({
    type: v.union(
      v.literal("global"),
      v.literal("track"),
      v.literal("weekly"),
      v.literal("monthly")
    ),
    trackId: v.optional(v.id("tracks")),
    period: v.string(), // "2024-06", "2024-W23", "all-time"
    entries: v.array(
      v.object({
        userId: v.string(),
        username: v.string(),
        avatar: v.optional(v.string()),
        score: v.number(),
        rank: v.number(),
        experienceGained: v.number(),
        lessonsCompleted: v.number(),
      })
    ),
    lastUpdated: v.string(),
    createdAt: v.string(),
  })
    .index("by_type", ["type"])
    .index("by_period", ["period"])
    .index("by_track", ["trackId"]),

  // Notifications
  notifications: defineTable({
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
    isRead: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "isRead"]),

  // User bookmarks/favorites
  bookmarks: defineTable({
    userId: v.string(),
    lessonId: v.optional(v.id("lessons")),
    trackId: v.optional(v.id("tracks")),
    discussionId: v.optional(v.id("discussions")),
    type: v.union(
      v.literal("lesson"),
      v.literal("track"),
      v.literal("discussion")
    ),
    createdAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "type"]),
});
