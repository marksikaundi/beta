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

  // Changelog for tracking system updates and performance
  changelog: defineTable({
    version: v.string(), // Semantic version (e.g., "1.2.3")
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("feature"),      // New feature added
      v.literal("improvement"),  // Enhancement to existing feature
      v.literal("bugfix"),      // Bug fix
      v.literal("security"),    // Security update
      v.literal("performance"), // Performance improvement
      v.literal("maintenance"), // System maintenance
      v.literal("breaking")     // Breaking change
    ),
    category: v.union(
      v.literal("frontend"),    // UI/UX changes
      v.literal("backend"),     // Server-side changes
      v.literal("database"),    // Database schema changes
      v.literal("api"),         // API changes
      v.literal("auth"),        // Authentication changes
      v.literal("notification"),// Notification system
      v.literal("performance"),// Performance optimizations
      v.literal("security"),   // Security improvements
      v.literal("integration"),// Third-party integrations
      v.literal("admin"),      // Admin panel features
      v.literal("general")     // General system changes
    ),
    changes: v.array(
      v.object({
        summary: v.string(),
        details: v.optional(v.string()),
        impact: v.union(
          v.literal("low"),
          v.literal("medium"),
          v.literal("high"),
          v.literal("critical")
        ),
        affectedComponents: v.array(v.string()),
        migrationRequired: v.boolean(),
        migrationNotes: v.optional(v.string()),
      })
    ),
    // Performance metrics for this release
    performanceMetrics: v.optional(
      v.object({
        loadTime: v.optional(v.number()),        // Page load time in ms
        buildTime: v.optional(v.number()),       // Build time in seconds
        bundleSize: v.optional(v.number()),      // Bundle size in KB
        memoryUsage: v.optional(v.number()),     // Memory usage in MB
        cpuUsage: v.optional(v.number()),        // CPU usage percentage
        databaseQueries: v.optional(v.number()), // Average DB queries per request
        apiResponseTime: v.optional(v.number()), // API response time in ms
        errorRate: v.optional(v.number()),       // Error rate percentage
        uptime: v.optional(v.number()),          // Uptime percentage
        userSatisfaction: v.optional(v.number()), // User satisfaction score (1-10)
      })
    ),
    // Deployment info
    deploymentInfo: v.optional(
      v.object({
        environment: v.union(
          v.literal("development"),
          v.literal("staging"),
          v.literal("production")
        ),
        deployedBy: v.string(),       // User who deployed
        deploymentTime: v.string(),   // Deployment timestamp
        rollbackAvailable: v.boolean(),
        rollbackVersion: v.optional(v.string()),
        healthChecks: v.array(
          v.object({
            service: v.string(),
            status: v.union(v.literal("healthy"), v.literal("degraded"), v.literal("unhealthy")),
            responseTime: v.optional(v.number()),
            message: v.optional(v.string()),
          })
        ),
      })
    ),
    // Dependencies and compatibility
    dependencies: v.optional(
      v.object({
        updated: v.array(
          v.object({
            name: v.string(),
            oldVersion: v.string(),
            newVersion: v.string(),
            reason: v.string(),
          })
        ),
        added: v.array(
          v.object({
            name: v.string(),
            version: v.string(),
            reason: v.string(),
          })
        ),
        removed: v.array(
          v.object({
            name: v.string(),
            version: v.string(),
            reason: v.string(),
          })
        ),
      })
    ),
    isPublic: v.boolean(),          // Whether to show in public changelog
    isCritical: v.boolean(),        // Critical update requiring immediate attention
    releaseNotes: v.optional(v.string()), // Detailed release notes in markdown
    authorId: v.string(),           // User who created the changelog entry
    reviewedBy: v.optional(v.string()), // User who reviewed the changes
    tags: v.array(v.string()),      // Tags for categorization
    relatedIssues: v.array(v.string()), // Related issue/ticket numbers
    testingStatus: v.union(
      v.literal("not-tested"),
      v.literal("in-progress"),
      v.literal("passed"),
      v.literal("failed"),
      v.literal("partial")
    ),
    rollbackPlan: v.optional(v.string()), // Rollback strategy if needed
    createdAt: v.string(),
    updatedAt: v.string(),
    releasedAt: v.optional(v.string()),   // When this version was released
  })
    .index("by_version", ["version"])
    .index("by_type", ["type"])
    .index("by_category", ["category"])
    .index("by_author", ["authorId"])
    .index("by_released", ["releasedAt"])
    .index("by_public", ["isPublic"])
    .index("by_critical", ["isCritical"]),

  // System metrics tracking
  systemMetrics: defineTable({
    timestamp: v.string(),
    type: v.union(
      v.literal("performance"),
      v.literal("usage"),
      v.literal("error"),
      v.literal("security"),
      v.literal("user-activity")
    ),
    metrics: v.object({
      // Performance metrics
      responseTime: v.optional(v.number()),
      memoryUsage: v.optional(v.number()),
      cpuUsage: v.optional(v.number()),
      diskUsage: v.optional(v.number()),
      networkLatency: v.optional(v.number()),
      
      // Usage metrics
      activeUsers: v.optional(v.number()),
      newRegistrations: v.optional(v.number()),
      lessonsCompleted: v.optional(v.number()),
      tracksStarted: v.optional(v.number()),
      apiCalls: v.optional(v.number()),
      
      // Error metrics
      errorCount: v.optional(v.number()),
      errorRate: v.optional(v.number()),
      criticalErrors: v.optional(v.number()),
      
      // Custom metrics
      custom: v.optional(v.record(v.string(), v.union(v.number(), v.string(), v.boolean()))),
    }),
    environment: v.union(
      v.literal("development"),
      v.literal("staging"),
      v.literal("production")
    ),
    source: v.string(), // Service or component that reported the metric
    alertLevel: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("error"),
      v.literal("critical")
    ),
    metadata: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean()))),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_type", ["type"])
    .index("by_environment", ["environment"])
    .index("by_source", ["source"])
    .index("by_alert_level", ["alertLevel"]),
});
