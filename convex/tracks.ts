import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all published tracks
export const getAllTracks = query({
  args: {
    category: v.optional(v.string()),
    difficulty: v.optional(
      v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced")
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("tracks")
      .withIndex("by_published", (q) => q.eq("isPublished", true));

    const tracks = await query.collect();

    // Filter by category if provided
    let filteredTracks = tracks;
    if (args.category) {
      filteredTracks = tracks.filter(
        (track) => track.category === args.category
      );
    }

    // Filter by difficulty if provided
    if (args.difficulty) {
      filteredTracks = filteredTracks.filter(
        (track) => track.difficulty === args.difficulty
      );
    }

    // Sort by order
    return filteredTracks.sort((a, b) => a.order - b.order);
  },
});

// Get track by slug
export const getTrackBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tracks")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get track with lessons
export const getTrackWithLessons = query({
  args: {
    slug: v.string(),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const track = await ctx.db
      .query("tracks")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!track) {
      return null;
    }

    // Get lessons for this track
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_track_and_order", (q) => q.eq("trackId", track._id))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    // Get user's progress if clerkId provided
    let userProgress = null;
    let enrollment = null;

    if (args.clerkId) {
      // Get user first
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId!))
        .first();

      if (user) {
        const progressData = await ctx.db
          .query("progress")
          .withIndex("by_user_and_track", (q) =>
            q.eq("userId", user._id).eq("trackId", track._id)
          )
          .collect();

        enrollment = await ctx.db
          .query("enrollments")
          .withIndex("by_user_and_track", (q) =>
            q.eq("userId", user._id).eq("trackId", track._id)
          )
          .first();

        userProgress = progressData.reduce((acc, progress) => {
          acc[progress.lessonId] = progress;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    return {
      track,
      lessons: lessons
        .sort((a, b) => a.order - b.order)
        .map((lesson) => ({
          lesson,
          progress: userProgress ? userProgress[lesson._id] : null,
        })),
      enrollment,
    };
  },
});

// Enroll user in track
export const enrollInTrack = mutation({
  args: {
    userId: v.id("users"),
    trackId: v.id("tracks"),
  },
  handler: async (ctx, args) => {
    // Check if already enrolled
    const existingEnrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_and_track", (q) =>
        q.eq("userId", args.userId).eq("trackId", args.trackId)
      )
      .first();

    if (existingEnrollment) {
      return existingEnrollment;
    }

    // Create enrollment
    const enrollment = await ctx.db.insert("enrollments", {
      userId: args.userId,
      trackId: args.trackId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      certificateIssued: false,
      totalTimeSpent: 0,
      streakCount: 0,
      lastStudiedAt: new Date().toISOString(),
    });

    // Increment enrollment count on track
    const track = await ctx.db.get(args.trackId);
    if (track) {
      await ctx.db.patch(args.trackId, {
        enrollmentCount: track.enrollmentCount + 1,
      });
    }

    // Create achievement for first enrollment
    const userEnrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (userEnrollments.length === 1) {
      await ctx.db.insert("achievements", {
        userId: args.userId,
        type: "first-enrollment",
        title: "Welcome Aboard!",
        description: "You've enrolled in your first learning track!",
        earnedAt: Date.now(),
      });
    }

    return enrollment;
  },
});

// Enroll user in track by clerkId
export const enrollInTrackByClerkId = mutation({
  args: {
    clerkId: v.string(),
    trackSlug: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user first
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get track by slug
    const track = await ctx.db
      .query("tracks")
      .withIndex("by_slug", (q) => q.eq("slug", args.trackSlug))
      .first();

    if (!track) {
      throw new Error("Track not found");
    }

    // Check if already enrolled
    const existingEnrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_and_track", (q) =>
        q.eq("userId", user._id).eq("trackId", track._id)
      )
      .first();

    if (existingEnrollment) {
      return existingEnrollment;
    }

    // Create enrollment
    const enrollment = await ctx.db.insert("enrollments", {
      userId: user._id,
      trackId: track._id,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      certificateIssued: false,
      totalTimeSpent: 0,
      streakCount: 0,
      lastStudiedAt: new Date().toISOString(),
    });

    // Increment enrollment count on track
    await ctx.db.patch(track._id, {
      enrollmentCount: track.enrollmentCount + 1,
    });

    // Create achievement for first enrollment
    const userEnrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (userEnrollments.length === 1) {
      await ctx.db.insert("achievements", {
        userId: user._id,
        type: "first-enrollment",
        title: "Welcome Aboard!",
        description: "You've enrolled in your first learning track!",
        earnedAt: Date.now(),
      });
    }

    return enrollment;
  },
});

// Get user's enrolled tracks
export const getUserEnrollments = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Get user first
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Get track details for each enrollment
    const tracksWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const track = await ctx.db.get(enrollment.trackId);
        return {
          enrollment,
          track,
        };
      })
    );

    return tracksWithProgress.filter((item) => item.track);
  },
});

// Create a new track (admin function)
export const createTrack = mutation({
  args: {
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
    color: v.string(),
    icon: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    prerequisites: v.array(v.string()),
    isPremium: v.boolean(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existingTrack = await ctx.db
      .query("tracks")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingTrack) {
      throw new Error("A track with this slug already exists");
    }

    // Get the next order number
    const tracks = await ctx.db.query("tracks").collect();
    const maxOrder = Math.max(...tracks.map((t) => t.order), 0);

    const now = new Date().toISOString();

    return await ctx.db.insert("tracks", {
      title: args.title,
      slug: args.slug,
      description: args.description,
      longDescription: args.longDescription,
      difficulty: args.difficulty,
      estimatedHours: args.estimatedHours,
      thumbnail: args.thumbnail,
      color: args.color,
      icon: args.icon,
      category: args.category,
      tags: args.tags,
      prerequisites: args.prerequisites,
      isPublished: true,
      isPremium: args.isPremium,
      order: maxOrder + 1,
      totalLessons: 0,
      enrollmentCount: 0,
      averageRating: 0,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Create JavaScript Fundamentals track (for sample lessons)
export const createJavaScriptFundamentalsTrack = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if the track already exists
    const existingTrack = await ctx.db
      .query("tracks")
      .withIndex("by_slug", (q) => q.eq("slug", "javascript-fundamentals"))
      .first();

    if (existingTrack) {
      return { message: "JavaScript Fundamentals track already exists" };
    }

    // Create the track
    const now = new Date().toISOString();

    const trackId = await ctx.db.insert("tracks", {
      title: "JavaScript Fundamentals",
      slug: "javascript-fundamentals",
      description: "Learn the basics of JavaScript programming language",
      longDescription:
        "This track covers the fundamental concepts of JavaScript programming, including variables, functions, objects, arrays, and more.",
      difficulty: "beginner",
      estimatedHours: 10,
      thumbnail: "/tracks/javascript.svg", // Update with actual thumbnail path
      color: "#F7DF1E", // JavaScript yellow
      icon: "code",
      category: "frontend",
      tags: ["javascript", "programming", "web development"],
      prerequisites: [],
      isPublished: true,
      isPremium: false,
      order: 1,
      totalLessons: 0, // Will be updated as lessons are added
      enrollmentCount: 0,
      averageRating: 5.0,
      createdBy: "system",
      createdAt: now,
      updatedAt: now,
    });

    return {
      message: "JavaScript Fundamentals track created successfully",
      trackId,
    };
  },
});

// Get track categories
export const getTrackCategories = query({
  handler: async (ctx) => {
    const tracks = await ctx.db
      .query("tracks")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();

    const categories = [...new Set(tracks.map((track) => track.category))];

    return categories.map((category) => {
      const categoryTracks = tracks.filter(
        (track) => track.category === category
      );
      return {
        name: category,
        count: categoryTracks.length,
        tracks: categoryTracks.slice(0, 3), // Show first 3 tracks
      };
    });
  },
});

// Search tracks
export const searchTracks = query({
  args: {
    searchTerm: v.string(),
    category: v.optional(v.string()),
    difficulty: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tracks = await ctx.db
      .query("tracks")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();

    let filteredTracks = tracks;

    // Filter by search term
    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase();
      filteredTracks = filteredTracks.filter(
        (track) =>
          track.title.toLowerCase().includes(searchLower) ||
          track.description.toLowerCase().includes(searchLower) ||
          track.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (args.category) {
      filteredTracks = filteredTracks.filter(
        (track) => track.category === args.category
      );
    }

    // Filter by difficulty
    if (args.difficulty) {
      filteredTracks = filteredTracks.filter(
        (track) => track.difficulty === args.difficulty
      );
    }

    return filteredTracks.sort((a, b) => a.order - b.order);
  },
});

// Get user enrollment for a specific track
export const getUserEnrollmentForTrack = query({
  args: {
    clerkId: v.string(),
    trackSlug: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user first
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    const track = await ctx.db
      .query("tracks")
      .withIndex("by_slug", (q) => q.eq("slug", args.trackSlug))
      .first();

    if (!track) {
      return null;
    }

    return await ctx.db
      .query("enrollments")
      .withIndex("by_user_and_track", (q) =>
        q.eq("userId", user._id).eq("trackId", track._id)
      )
      .first();
  },
});
