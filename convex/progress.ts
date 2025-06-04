import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's overall progress analytics
export const getUserProgressAnalytics = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Get user first
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    // Get all user's progress
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Get enrollments
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Calculate weekly progress
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyProgress = allProgress.filter(
      (p) => new Date(p.lastAccessedAt) >= weekAgo
    );

    // Calculate daily activity for the last 30 days
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailyActivity = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split("T")[0];

      const dayProgress = allProgress.filter(
        (p) => p.lastAccessedAt.split("T")[0] === dateString
      );

      const timeSpent = dayProgress.reduce(
        (total, p) => total + p.timeSpent,
        0
      );
      const lessonsCompleted = dayProgress.filter(
        (p) =>
          p.status === "completed" &&
          p.completedAt?.split("T")[0] === dateString
      ).length;

      dailyActivity.push({
        date: dateString,
        timeSpent,
        lessonsCompleted,
        active: timeSpent > 0,
      });
    }

    // Calculate progress by category
    const progressByCategory: Record<string, any> = {};

    for (const enrollment of enrollments) {
      const track = await ctx.db.get(enrollment.trackId);
      if (track) {
        if (!progressByCategory[track.category]) {
          progressByCategory[track.category] = {
            category: track.category,
            tracksEnrolled: 0,
            tracksCompleted: 0,
            totalProgress: 0,
            timeSpent: 0,
          };
        }

        progressByCategory[track.category].tracksEnrolled++;
        progressByCategory[track.category].totalProgress += enrollment.progress;
        progressByCategory[track.category].timeSpent +=
          enrollment.totalTimeSpent;

        if (enrollment.completedAt) {
          progressByCategory[track.category].tracksCompleted++;
        }
      }
    }

    // Calculate average progress per category
    Object.values(progressByCategory).forEach((category: any) => {
      category.averageProgress =
        category.tracksEnrolled > 0
          ? Math.round(category.totalProgress / category.tracksEnrolled)
          : 0;
    });

    return {
      totalLessons: allProgress.length,
      completedLessons: allProgress.filter((p) => p.status === "completed")
        .length,
      totalTimeSpent: allProgress.reduce((total, p) => total + p.timeSpent, 0),
      weeklyTimeSpent: weeklyProgress.reduce(
        (total, p) => total + p.timeSpent,
        0
      ),
      weeklyLessonsCompleted: weeklyProgress.filter(
        (p) => p.status === "completed"
      ).length,
      dailyActivity,
      progressByCategory: Object.values(progressByCategory),
      enrollments: enrollments.length,
      completedTracks: enrollments.filter((e) => e.completedAt).length,
    };
  },
});

// Get progress for a specific track
export const getTrackProgress = query({
  args: {
    clerkId: v.string(),
    trackId: v.id("tracks"),
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

    // Get enrollment
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_and_track", (q) =>
        q.eq("userId", user._id).eq("trackId", args.trackId)
      )
      .first();

    if (!enrollment) {
      return null;
    }

    // Get track info
    const track = await ctx.db.get(args.trackId);
    if (!track) {
      return null;
    }

    // Get all lessons for this track
    const trackLessons = await ctx.db
      .query("lessons")
      .withIndex("by_track", (q) => q.eq("trackId", args.trackId))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    // Get user's progress for these lessons
    const lessonsProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_and_track", (q) =>
        q.eq("userId", user._id).eq("trackId", args.trackId)
      )
      .collect();

    // Create lesson progress map
    const progressMap = lessonsProgress.reduce((acc, progress) => {
      acc[progress.lessonId] = progress;
      return acc;
    }, {} as Record<string, any>);

    // Add progress info to each lesson
    const lessonsWithProgress = trackLessons
      .sort((a, b) => a.order - b.order)
      .map((lesson) => ({
        lesson,
        progress: progressMap[lesson._id] || null,
      }));

    // Calculate detailed statistics
    const completedLessons = lessonsProgress.filter(
      (p) => p.status === "completed"
    );
    const averageScore =
      lessonsProgress
        .filter((p) => p.score !== undefined)
        .reduce((sum, p) => sum + (p.score || 0), 0) /
        lessonsProgress.filter((p) => p.score !== undefined).length || 0;

    return {
      track,
      enrollment,
      lessons: lessonsWithProgress,
      stats: {
        totalLessons: trackLessons.length,
        completedLessons: completedLessons.length,
        progressPercentage: enrollment.progress,
        totalTimeSpent: enrollment.totalTimeSpent,
        averageScore: Math.round(averageScore),
        currentStreak: enrollment.streakCount,
        lastStudied: enrollment.lastStudiedAt,
      },
    };
  },
});

// Get recent activity
export const getRecentActivity = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Get user first
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    // Get recent progress updates
    const recentProgress = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    // Get track and lesson info for each progress
    const activityWithDetails = await Promise.all(
      recentProgress.map(async (progress) => {
        const lesson = await ctx.db.get(progress.lessonId);
        const track = lesson ? await ctx.db.get(lesson.trackId) : null;

        return {
          type: "lesson_progress" as const,
          timestamp: progress.lastAccessedAt,
          progress: {
            _id: progress._id.toString(),
            lessonId: progress.lessonId.toString(),
            status: progress.status,
            score: progress.score,
            timeSpent: progress.timeSpent,
          },
          lesson: lesson
            ? {
                _id: lesson._id.toString(),
                title: lesson.title,
                slug: lesson.slug,
                type: lesson.type,
              }
            : null,
          track: track
            ? {
                _id: track._id.toString(),
                title: track.title,
                slug: track.slug,
                color: track.color,
              }
            : null,
        };
      })
    );

    // Get recent achievements
    const recentAchievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(5);

    const achievementActivities = await Promise.all(
      recentAchievements.map(async (achievement) => {
        // For now, since achievements schema doesn't have lessonId/trackId,
        // we'll set lesson and track to null
        const lesson = null;
        const track = null;

        return {
          type: "achievement" as const,
          timestamp: new Date(achievement.earnedAt).toISOString(),
          achievement: {
            _id: achievement._id.toString(),
            title: achievement.title,
            description: achievement.description,
            type: achievement.type,
          },
          lesson,
          track,
        };
      })
    );

    // Combine and sort all activities
    const allActivities = [...activityWithDetails, ...achievementActivities];

    return allActivities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  },
});

// Get study streaks and milestones
export const getStudyMilestones = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    // Get all progress to calculate milestones
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completedLessons = allProgress.filter(
      (p) => p.status === "completed"
    );
    const totalTimeSpent = allProgress.reduce(
      (total, p) => total + p.timeSpent,
      0
    );

    // Calculate study days (unique dates with activity)
    const studyDates = new Set(
      allProgress.map((p) => p.lastAccessedAt.split("T")[0])
    );

    // Get achievements
    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Get enrollments
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completedTracks = enrollments.filter((e) => e.completedAt);

    // Define milestones
    const milestones = [
      {
        id: "first_lesson",
        title: "First Lesson",
        description: "Complete your first lesson",
        target: 1,
        current: completedLessons.length,
        type: "lessons",
        achieved: completedLessons.length >= 1,
      },
      {
        id: "lessons_10",
        title: "10 Lessons",
        description: "Complete 10 lessons",
        target: 10,
        current: completedLessons.length,
        type: "lessons",
        achieved: completedLessons.length >= 10,
      },
      {
        id: "lessons_50",
        title: "50 Lessons",
        description: "Complete 50 lessons",
        target: 50,
        current: completedLessons.length,
        type: "lessons",
        achieved: completedLessons.length >= 50,
      },
      {
        id: "first_track",
        title: "First Track",
        description: "Complete your first track",
        target: 1,
        current: completedTracks.length,
        type: "tracks",
        achieved: completedTracks.length >= 1,
      },
      {
        id: "streak_7",
        title: "Week Streak",
        description: "Study for 7 days in a row",
        target: 7,
        current: user.streakDays,
        type: "streak",
        achieved: user.streakDays >= 7,
      },
      {
        id: "streak_30",
        title: "Month Streak",
        description: "Study for 30 days in a row",
        target: 30,
        current: user.streakDays,
        type: "streak",
        achieved: user.streakDays >= 30,
      },
      {
        id: "time_10h",
        title: "10 Hours",
        description: "Study for 10 hours total",
        target: 600, // 10 hours in minutes
        current: totalTimeSpent,
        type: "time",
        achieved: totalTimeSpent >= 600,
      },
      {
        id: "time_100h",
        title: "100 Hours",
        description: "Study for 100 hours total",
        target: 6000, // 100 hours in minutes
        current: totalTimeSpent,
        type: "time",
        achieved: totalTimeSpent >= 6000,
      },
    ];

    return {
      currentStreak: user.streakDays,
      longestStreak: user.streakDays, // You could track this separately
      totalStudyDays: studyDates.size,
      totalTimeSpent: Math.round(totalTimeSpent),
      level: user.level,
      experience: user.experience,
      milestones,
      achievements: achievements.length,
    };
  },
});

// Get user achievements
export const getUserAchievements = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return achievements;
  },
});

// Update lesson progress
export const updateLessonProgress = mutation({
  args: {
    clerkId: v.string(),
    lessonId: v.id("lessons"),
    status: v.union(
      v.literal("not-started"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("skipped")
    ),
    timeSpent: v.number(),
    score: v.optional(v.number()),
    submittedCode: v.optional(v.string()),
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

    // Get lesson info
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Check for existing progress
    const existingProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_and_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId)
      )
      .first();

    const now = new Date().toISOString();

    if (existingProgress) {
      // Update existing progress
      return await ctx.db.patch(existingProgress._id, {
        status: args.status,
        timeSpent: existingProgress.timeSpent + args.timeSpent,
        score: args.score,
        submittedCode: args.submittedCode,
        lastAccessedAt: now,
        completedAt:
          args.status === "completed" ? now : existingProgress.completedAt,
      });
    } else {
      // Create new progress record
      return await ctx.db.insert("progress", {
        userId: user._id,
        lessonId: args.lessonId,
        trackId: lesson.trackId,
        status: args.status,
        timeSpent: args.timeSpent,
        attempts: 1,
        score: args.score,
        lastAccessedAt: now,
        submittedCode: args.submittedCode,
        completedAt: args.status === "completed" ? now : undefined,
      });
    }
  },
});

// Complete lesson with submission
export const completeLesson = mutation({
  args: {
    clerkId: v.string(),
    lessonId: v.id("lessons"),
    timeSpent: v.number(),
    submissionData: v.any(),
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

    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const now = new Date().toISOString();
    const nowTimestamp = Date.now();

    // Update progress
    let score;
    let submittedCode;

    if (lesson.type === "coding") {
      submittedCode = args.submissionData.code;
      score = 100; // Simple scoring for now
    } else if (lesson.type === "quiz") {
      // Calculate quiz score
      const answers = args.submissionData.answers;
      const totalPoints =
        lesson.questions?.reduce((sum, q) => sum + q.points, 0) || 0;
      let earnedPoints = 0;

      lesson.questions?.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          earnedPoints += question.points;
        }
      });

      score =
        totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
    } else {
      score = 100; // Reading/video lessons
    }

    // Update or create progress
    const existingProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_and_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId)
      )
      .first();

    if (existingProgress) {
      await ctx.db.patch(existingProgress._id, {
        status: "completed",
        timeSpent: existingProgress.timeSpent + args.timeSpent,
        score,
        submittedCode,
        lastAccessedAt: now,
        completedAt: now,
      });
    } else {
      await ctx.db.insert("progress", {
        userId: user._id,
        lessonId: args.lessonId,
        trackId: lesson.trackId,
        status: "completed",
        timeSpent: args.timeSpent,
        attempts: 1,
        score,
        submittedCode,
        lastAccessedAt: now,
        completedAt: now,
      });
    }

    // Update user experience
    const existingUser = await ctx.db.get(user._id);
    if (existingUser) {
      const newExperience = existingUser.experience + lesson.experiencePoints;
      const newLevel = Math.floor(newExperience / 1000) + 1; // Simple leveling system

      await ctx.db.patch(user._id, {
        experience: newExperience,
        level: Math.max(existingUser.level, newLevel),
      });

      // Check for level up achievement
      if (newLevel > existingUser.level) {
        await ctx.db.insert("achievements", {
          userId: user._id,
          type: "level-up",
          title: `Level ${newLevel}!`,
          description: `You've reached level ${newLevel}!`,
          earnedAt: nowTimestamp,
        });
      }
    }

    // Update track enrollment progress
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_and_track", (q) =>
        q.eq("userId", user._id).eq("trackId", lesson.trackId)
      )
      .first();

    if (enrollment) {
      // Calculate track progress
      const allTrackLessons = await ctx.db
        .query("lessons")
        .withIndex("by_track", (q) => q.eq("trackId", lesson.trackId))
        .filter((q) => q.eq(q.field("isPublished"), true))
        .collect();

      const completedLessons = await ctx.db
        .query("progress")
        .withIndex("by_user_and_track", (q) =>
          q.eq("userId", user._id).eq("trackId", lesson.trackId)
        )
        .filter((q) => q.eq(q.field("status"), "completed"))
        .collect();

      const progressPercentage =
        allTrackLessons.length > 0
          ? Math.round((completedLessons.length / allTrackLessons.length) * 100)
          : 0;

      await ctx.db.patch(enrollment._id, {
        progress: progressPercentage,
        currentLessonId: args.lessonId,
        totalTimeSpent: enrollment.totalTimeSpent + args.timeSpent,
        lastStudiedAt: now,
      });

      // Check for track completion
      if (progressPercentage === 100 && !enrollment.completedAt) {
        await ctx.db.patch(enrollment._id, {
          completedAt: now,
        });

        // Create track completion achievement
        await ctx.db.insert("achievements", {
          userId: user._id,
          type: "track-completion",
          title: "Track Complete!",
          description: `You've completed the track!`,
          earnedAt: nowTimestamp,
        });
      }
    }

    return { success: true, score };
  },
});
