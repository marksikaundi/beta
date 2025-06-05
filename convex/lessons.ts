import { v } from "convex/values";
import { mutation, query, MutationCtx } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Get lesson by slug
export const getLessonBySlug = query({
  args: {
    slug: v.string(),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const lesson = await ctx.db
      .query("lessons")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!lesson) {
      return null;
    }

    // Get track info
    const track = await ctx.db.get(lesson.trackId);

    // Get user progress if clerkId provided
    let progress = null;
    if (args.clerkId) {
      // Get user first
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId!))
        .first();

      if (user) {
        progress = await ctx.db
          .query("progress")
          .withIndex("by_user_and_lesson", (q) =>
            q.eq("userId", user._id).eq("lessonId", lesson._id)
          )
          .first();
      }
    }

    // Get all lessons in track for navigation
    const trackLessons = await ctx.db
      .query("lessons")
      .withIndex("by_track_and_order", (q) => q.eq("trackId", lesson.trackId))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    const sortedLessons = trackLessons.sort((a, b) => a.order - b.order);
    const currentIndex = sortedLessons.findIndex((l) => l._id === lesson._id);
    const previousLesson =
      currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < sortedLessons.length - 1
        ? sortedLessons[currentIndex + 1]
        : null;

    return {
      lesson,
      track,
      progress,
      navigation: {
        previous: previousLesson,
        next: nextLesson,
        current: currentIndex + 1,
        total: sortedLessons.length,
      },
    };
  },
});

// Start or update lesson progress
export const updateLessonProgress = mutation({
  args: {
    userId: v.string(), // This will be clerkId
    lessonId: v.id("lessons"),
    status: v.union(
      v.literal("not-started"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("skipped")
    ),
    timeSpent: v.optional(v.number()),
    readingProgress: v.optional(v.number()),
    score: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Get user by clerkId first
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get existing progress
    const existingProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_and_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId)
      )
      .first();

    const now = new Date().toISOString();

    const progressData: any = {
      userId: user._id,
      lessonId: args.lessonId,
      trackId: lesson.trackId,
      status: args.status,
      lastAccessedAt: now,
      timeSpent: args.timeSpent || 0,
      attempts: existingProgress ? existingProgress.attempts + 1 : 1,
      readingProgress: args.readingProgress,
      score: args.score,
      updatedAt: now,
    };

    let progressId;

    if (existingProgress) {
      // Update existing progress
      progressData.timeSpent =
        existingProgress.timeSpent + (args.timeSpent || 0);
      if (args.status === "completed" && !existingProgress.completedAt) {
        progressData.completedAt = now;
      }
      progressId = existingProgress._id;
      await ctx.db.patch(existingProgress._id, progressData);
    } else {
      // Create new progress
      progressData.createdAt = now;
      if (args.status === "completed") {
        progressData.completedAt = now;
      }
      progressId = await ctx.db.insert("progress", progressData);
    }

    // If lesson completed, award experience points
    if (
      args.status === "completed" &&
      (!existingProgress || existingProgress.status !== "completed")
    ) {
      // Award experience points
      if (user) {
        const newExperience = user.experience + lesson.experiencePoints;
        const newLevel = Math.floor(newExperience / 100) + 1;
        const leveledUp = newLevel > user.level;

        await ctx.db.patch(user._id, {
          experience: newExperience,
          level: newLevel,
          updatedAt: now,
        });

        // Update streak
        await ctx.runMutation(api.users.updateStreak, { clerkId: args.userId });

        // Check if this is user's first completed lesson
        const completedLessons = await ctx.db
          .query("progress")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .filter((q) => q.eq(q.field("status"), "completed"))
          .collect();

        if (completedLessons.length === 1) {
          await ctx.db.insert("achievements", {
            userId: user._id,
            type: "first-lesson",
            title: "First Lesson Complete!",
            description: "You've completed your first lesson. Keep it up!",
            earnedAt: Date.now(),
          });
        }

        // Update track enrollment progress
        await updateTrackProgress(ctx, user._id, lesson.trackId);
      }
    }

    return progressId;
  },
});

// Submit code for coding lesson
export const submitCode = mutation({
  args: {
    userId: v.string(), // This will be clerkId
    lessonId: v.id("lessons"),
    code: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson || lesson.type !== "coding") {
      throw new Error("Invalid lesson for code submission");
    }

    // Get user by clerkId
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // In a real implementation, you'd run the code against test cases
    // For now, we'll simulate test results
    const testResults = (lesson.testCases || []).map((testCase, index) => ({
      test: testCase.description,
      passed: Math.random() > 0.3, // Simulate 70% pass rate
      output: "Mock output",
      expectedOutput: testCase.expectedOutput,
    }));

    const passedTests = testResults.filter((r) => r.passed).length;
    const totalTests = testResults.length;
    const score =
      totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    const status = score >= 70 ? "passed" : "failed";

    // Save submission
    const submissionId = await ctx.db.insert("submissions", {
      userId: args.userId, // clerkId for submissions table
      lessonId: args.lessonId,
      trackId: lesson.trackId,
      code: args.code,
      language: args.language,
      status,
      testResults,
      score,
      isPublic: false,
      submittedAt: new Date().toISOString(),
    });

    // Update lesson progress
    await ctx.runMutation(api.lessons.updateLessonProgress, {
      userId: args.userId,
      lessonId: args.lessonId,
      status: status === "passed" ? "completed" : "in-progress",
      score,
    });

    return {
      submissionId,
      testResults,
      score,
      status,
      passedTests,
      totalTests,
    };
  },
});

// Submit quiz answers
export const submitQuiz = mutation({
  args: {
    userId: v.string(), // This will be clerkId
    lessonId: v.id("lessons"),
    answers: v.array(
      v.object({
        questionIndex: v.number(),
        answer: v.union(v.string(), v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson || lesson.type !== "quiz" || !lesson.questions) {
      throw new Error("Invalid lesson for quiz submission");
    }

    // Get user by clerkId
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    let totalScore = 0;
    let maxScore = 0;

    const results = lesson.questions.map((question, index) => {
      const userAnswer = args.answers.find((a) => a.questionIndex === index);
      const isCorrect =
        userAnswer && userAnswer.answer === question.correctAnswer;

      if (isCorrect) {
        totalScore += question.points;
      }
      maxScore += question.points;

      return {
        questionIndex: index,
        question: question.question,
        userAnswer: userAnswer?.answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        points: isCorrect ? question.points : 0,
      };
    });

    const percentageScore =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentageScore >= 70;

    // Update lesson progress
    await ctx.runMutation(api.lessons.updateLessonProgress, {
      userId: args.userId,
      lessonId: args.lessonId,
      status: passed ? "completed" : "in-progress",
      score: percentageScore,
    });

    return {
      results,
      totalScore,
      maxScore,
      percentageScore,
      passed,
    };
  },
});

// Create a new lesson (admin function)
export const createLesson = mutation({
  args: {
    trackId: v.id("tracks"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(),
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
    experiencePoints: v.number(),
    tags: v.array(v.string()),
    isPremium: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existingLesson = await ctx.db
      .query("lessons")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingLesson) {
      throw new Error("A lesson with this slug already exists");
    }

    // Get the next order number for this track
    const trackLessons = await ctx.db
      .query("lessons")
      .withIndex("by_track", (q) => q.eq("trackId", args.trackId))
      .collect();

    const maxOrder = Math.max(...trackLessons.map((l) => l.order), 0);

    const now = new Date().toISOString();

    const lessonData = {
      trackId: args.trackId,
      title: args.title,
      slug: args.slug,
      description: args.description,
      content: args.content,
      type: args.type,
      difficulty: args.difficulty,
      estimatedMinutes: args.estimatedMinutes,
      order: maxOrder + 1,
      isPublished: true,
      isPremium: args.isPremium,
      experiencePoints: args.experiencePoints,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    };

    const lessonId = await ctx.db.insert("lessons", lessonData);

    // Update track's total lessons count
    const track = await ctx.db.get(args.trackId);
    if (track) {
      await ctx.db.patch(args.trackId, {
        totalLessons: track.totalLessons + 1,
        updatedAt: now,
      });
    }

    return lessonId;
  },
});

// Mutation to create sample coding lessons (for development/testing)
export const createSampleCodingLessons = mutation({
  args: {},
  handler: async (ctx) => {
    // First check if we already have sample lessons
    const existingLesson = await ctx.db
      .query("lessons")
      .withIndex("by_slug", (q) => q.eq("slug", "javascript-basics-variables"))
      .first();

    if (existingLesson) {
      return { message: "Sample lessons already exist" };
    }

    // Get the JavaScript Fundamentals track
    const track = await ctx.db
      .query("tracks")
      .withIndex("by_slug", (q) => q.eq("slug", "javascript-fundamentals"))
      .first();

    if (!track) {
      throw new Error("JavaScript Fundamentals track not found");
    }

    // Create sample coding lessons
    const lessons = [
      {
        title: "JavaScript Variables",
        slug: "javascript-basics-variables",
        description: "Learn about variables in JavaScript",
        content: `# JavaScript Variables

Variables are containers for storing data values. In JavaScript, you can create variables using \`let\`, \`const\`, or \`var\`.

## Task
Create a function called \`createGreeting\` that takes a name parameter and returns a greeting message.

Example:
\`\`\`javascript
createGreeting("Alice") // should return "Hello, Alice!"
\`\`\``,
        type: "coding" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 15,
        order: 1,
        isPremium: false,
        experiencePoints: 50,
        trackId: track._id,
        language: "javascript",
        starterCode: `// Create a function that returns a greeting
function createGreeting(name) {
  // Your code here
  
}`,
        testCases: [
          {
            input: '["Alice"]',
            expectedOutput: "Hello, Alice!",
            description: "Should greet Alice",
          },
          {
            input: '["Bob"]',
            expectedOutput: "Hello, Bob!",
            description: "Should greet Bob",
          },
          {
            input: '["World"]',
            expectedOutput: "Hello, World!",
            description: "Should greet World",
          },
        ],
        tags: ["javascript", "variables", "functions"],
      },
      {
        title: "JavaScript Arrays",
        slug: "javascript-arrays-basics",
        description: "Learn about arrays and array methods",
        content: `# JavaScript Arrays

Arrays are used to store multiple values in a single variable. They have many useful methods for manipulation.

## Task
Create a function called \`sumArray\` that takes an array of numbers and returns the sum of all elements.

Example:
\`\`\`javascript
sumArray([1, 2, 3, 4]) // should return 10
\`\`\``,
        type: "coding" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 20,
        order: 2,
        isPremium: false,
        experiencePoints: 75,
        trackId: track._id,
        language: "javascript",
        starterCode: `// Create a function that sums all numbers in an array
function sumArray(numbers) {
  // Your code here
  
}`,
        testCases: [
          {
            input: "[[1, 2, 3, 4]]",
            expectedOutput: "10",
            description: "Should sum [1, 2, 3, 4] to 10",
          },
          {
            input: "[[5, 10, 15]]",
            expectedOutput: "30",
            description: "Should sum [5, 10, 15] to 30",
          },
          {
            input: "[[]]",
            expectedOutput: "0",
            description: "Should sum empty array to 0",
          },
          {
            input: "[[-1, 1, -2, 2]]",
            expectedOutput: "0",
            description: "Should handle negative numbers",
          },
        ],
        tags: ["javascript", "arrays", "methods"],
      },
      {
        title: "FizzBuzz Challenge",
        slug: "javascript-fizzbuzz",
        description: "Classic FizzBuzz programming challenge",
        content: `# FizzBuzz Challenge

FizzBuzz is a classic programming problem that tests your understanding of conditionals and loops.

## Task
Create a function called \`fizzBuzz\` that takes a number \`n\` and returns an array of strings from 1 to n where:
- Numbers divisible by 3 are replaced with "Fizz"
- Numbers divisible by 5 are replaced with "Buzz"  
- Numbers divisible by both 3 and 5 are replaced with "FizzBuzz"
- All other numbers remain as strings

Example:
\`\`\`javascript
fizzBuzz(15) // should return ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
\`\`\``,
        type: "coding" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 30,
        order: 3,
        isPremium: true,
        experiencePoints: 100,
        trackId: track._id,
        language: "javascript",
        starterCode: `// Implement the FizzBuzz algorithm
function fizzBuzz(n) {
  // Your code here
  
}`,
        testCases: [
          {
            input: "[15]",
            expectedOutput:
              '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
            description: "Should handle FizzBuzz for n=15",
          },
          {
            input: "[5]",
            expectedOutput: '["1","2","Fizz","4","Buzz"]',
            description: "Should handle smaller input n=5",
          },
          {
            input: "[3]",
            expectedOutput: '["1","2","Fizz"]',
            description: "Should handle n=3",
          },
        ],
        tags: ["javascript", "algorithms", "fizzbuzz"],
      },
    ];

    // Insert the lessons
    const insertedLessons = [];
    for (const lessonData of lessons) {
      const now = new Date().toISOString();
      const fullLessonData = {
        ...lessonData,
        createdAt: now,
        updatedAt: now,
        tags: lessonData.tags || [],
        isPublished: true,
      };
      const lessonId = await ctx.db.insert("lessons", fullLessonData);
      insertedLessons.push({ id: lessonId, slug: lessonData.slug });
    }

    return {
      message: `Created ${insertedLessons.length} sample coding lessons`,
      lessons: insertedLessons,
    };
  },
});

// Get recent lessons
export const getRecentLessons = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .take(args.limit);

    // Get track info for each lesson
    const lessonsWithTracks = await Promise.all(
      lessons.map(async (lesson) => {
        const track = await ctx.db.get(lesson.trackId);
        return {
          ...lesson,
          trackTitle: track?.title,
          trackSlug: track?.slug,
          trackColor: track?.color,
        };
      })
    );

    return lessonsWithTracks;
  },
});

// Helper function to update track progress
async function updateTrackProgress(
  ctx: MutationCtx,
  userId: Id<"users">,
  trackId: Id<"tracks">
) {
  // Get all lessons in track
  const trackLessons = await ctx.db
    .query("lessons")
    .withIndex("by_track", (q) => q.eq("trackId", trackId))
    .filter((q) => q.eq(q.field("isPublished"), true))
    .collect();

  // Get user's progress for this track
  const userProgress = await ctx.db
    .query("progress")
    .withIndex("by_user_and_track", (q) =>
      q.eq("userId", userId).eq("trackId", trackId)
    )
    .collect();

  const completedLessons = userProgress.filter((p) => p.status === "completed");
  const progressPercentage =
    trackLessons.length > 0
      ? Math.round((completedLessons.length / trackLessons.length) * 100)
      : 0;

  // Update enrollment
  const enrollment = await ctx.db
    .query("enrollments")
    .withIndex("by_user_and_track", (q) =>
      q.eq("userId", userId).eq("trackId", trackId)
    )
    .first();

  if (enrollment) {
    const updateData: any = {
      progress: progressPercentage,
      lastStudiedAt: new Date().toISOString(),
    };

    // If track completed
    if (progressPercentage === 100 && !enrollment.completedAt) {
      updateData.completedAt = new Date().toISOString();
      updateData.certificateIssued = true;
      updateData.certificateId = `cert_${enrollment._id}_${Date.now()}`;

      // Create track completion achievement
      await ctx.db.insert("achievements", {
        userId,
        type: "track-completion",
        title: "Track Completed!",
        description: "You've completed an entire learning track!",
        earnedAt: Date.now(),
      });
    }

    await ctx.db.patch(enrollment._id, updateData);
  }
}
