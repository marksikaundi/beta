import { v } from "convex/values";
import { mutation, query, MutationCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Helper function to get or create user from Clerk identity
async function getOrCreateUser(ctx: MutationCtx, identity: any) {
  let user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) {
    // Create user if they don't exist
    const now = new Date().toISOString();
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email || "",
      username: identity.nickname || identity.email?.split("@")[0] || "user",
      displayName: identity.name || identity.nickname || "User",
      avatar: identity.pictureUrl,
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
    
    user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Failed to create user");
    }
  }
  
  return user;
}

// Create a new discussion thread
export const createDiscussion = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    trackId: v.optional(v.id("tracks")),
    lessonId: v.optional(v.id("lessons")),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getOrCreateUser(ctx, identity);

    const discussionId = await ctx.db.insert("discussions", {
      title: args.title,
      content: args.content,
      authorId: user._id,
      trackId: args.trackId,
      lessonId: args.lessonId,
      tags: args.tags,
      upvotes: 0,
      downvotes: 0,
      replyCount: 0,
      viewCount: 0,
      isResolved: false,
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return discussionId;
  },
});

// Get discussions with filters
export const getDiscussions = query({
  args: {
    trackId: v.optional(v.id("tracks")),
    lessonId: v.optional(v.id("lessons")),
    tag: v.optional(v.string()),
    sortBy: v.optional(
      v.union(
        v.literal("recent"),
        v.literal("popular"),
        v.literal("unanswered")
      )
    ),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("discussions");

    // Apply filters
    if (args.trackId) {
      query = query.filter((q) => q.eq(q.field("trackId"), args.trackId));
    }
    if (args.lessonId) {
      query = query.filter((q) => q.eq(q.field("lessonId"), args.lessonId));
    }
    if (args.tag) {
      // We'll filter this client-side since Convex doesn't support array.includes in queries
    }

    let discussions = await query.collect();

    // Apply tag filter client-side if provided
    if (args.tag) {
      discussions = discussions.filter((discussion) =>
        discussion.tags.includes(args.tag!)
      );
    }

    // Apply sorting
    if (args.sortBy === "popular") {
      discussions.sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      );
    } else if (args.sortBy === "unanswered") {
      discussions = discussions.filter((d) => d.replyCount === 0);
      discussions.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      discussions.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    // Apply pagination
    const offset = args.offset || 0;
    const limit = args.limit || 20;
    discussions = discussions.slice(offset, offset + limit);

    // Get authors
    const discussionsWithAuthors = await Promise.all(
      discussions.map(async (discussion) => {
        const author = await ctx.db.get(discussion.authorId);
        return {
          ...discussion,
          author: author
            ? {
                _id: author._id,
                name: author.displayName,
                email: author.email,
                imageUrl: author.avatar,
                level: author.level,
              }
            : null,
        };
      })
    );

    return discussionsWithAuthors;
  },
});

// Get single discussion with replies
export const getDiscussion = query({
  args: { discussionId: v.id("discussions") },
  handler: async (ctx, args) => {
    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      return null;
    }

    // Get author
    const author = await ctx.db.get(discussion.authorId);

    // Get replies
    const replies = await ctx.db
      .query("discussionReplies")
      .withIndex("by_discussion", (q) =>
        q.eq("discussionId", args.discussionId)
      )
      .order("desc")
      .collect();

    // Get reply authors
    const repliesWithAuthors = await Promise.all(
      replies.map(async (reply) => {
        const replyAuthor = await ctx.db.get(reply.authorId);
        return {
          ...reply,
          author: replyAuthor
            ? {
                _id: replyAuthor._id,
                name: replyAuthor.displayName,
                email: replyAuthor.email,
                imageUrl: replyAuthor.avatar,
                level: replyAuthor.level,
              }
            : null,
        };
      })
    );

    return {
      ...discussion,
      author: author
        ? {
            _id: author._id,
            name: author.displayName,
            email: author.email,
            imageUrl: author.avatar,
            level: author.level,
          }
        : null,
      replies: repliesWithAuthors,
    };
  },
});

// Create a reply to a discussion
export const createReply = mutation({
  args: {
    discussionId: v.id("discussions"),
    content: v.string(),
    parentReplyId: v.optional(v.id("discussionReplies")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getOrCreateUser(ctx, identity);

    const replyId = await ctx.db.insert("discussionReplies", {
      discussionId: args.discussionId,
      content: args.content,
      authorId: user._id,
      parentReplyId: args.parentReplyId,
      upvotes: 0,
      downvotes: 0,
      isAccepted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update discussion reply count and last activity
    const discussion = await ctx.db.get(args.discussionId);
    if (discussion) {
      await ctx.db.patch(args.discussionId, {
        replyCount: discussion.replyCount + 1,
        updatedAt: Date.now(),
      });
    }

    return replyId;
  },
});

// Vote on a discussion
export const voteDiscussion = mutation({
  args: {
    discussionId: v.id("discussions"),
    voteType: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getOrCreateUser(ctx, identity);

    // Check if user already voted
    const existingVote = await ctx.db
      .query("discussionVotes")
      .withIndex("by_user_discussion", (q) =>
        q.eq("userId", user._id).eq("discussionId", args.discussionId)
      )
      .unique();

    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    if (existingVote) {
      // Update existing vote
      if (existingVote.voteType !== args.voteType) {
        await ctx.db.patch(existingVote._id, { voteType: args.voteType });

        // Update discussion counts
        const upvoteDiff = args.voteType === "up" ? 2 : -2;
        const downvoteDiff = args.voteType === "down" ? 2 : -2;

        await ctx.db.patch(args.discussionId, {
          upvotes:
            discussion.upvotes + (args.voteType === "up" ? upvoteDiff : 0),
          downvotes:
            discussion.downvotes +
            (args.voteType === "down" ? downvoteDiff : 0),
        });
      }
    } else {
      // Create new vote
      await ctx.db.insert("discussionVotes", {
        userId: user._id,
        discussionId: args.discussionId,
        voteType: args.voteType,
        createdAt: Date.now(),
      });

      // Update discussion counts
      await ctx.db.patch(args.discussionId, {
        upvotes:
          args.voteType === "up" ? discussion.upvotes + 1 : discussion.upvotes,
        downvotes:
          args.voteType === "down"
            ? discussion.downvotes + 1
            : discussion.downvotes,
      });
    }
  },
});

// Mark discussion as resolved
export const markResolved = mutation({
  args: { discussionId: v.id("discussions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || user._id !== discussion.authorId) {
      throw new Error("Only the discussion author can mark it as resolved");
    }

    await ctx.db.patch(args.discussionId, {
      isResolved: true,
      updatedAt: Date.now(),
    });
  },
});

// Increment view count for a discussion
export const incrementViewCount = mutation({
  args: { discussionId: v.id("discussions") },
  handler: async (ctx, args) => {
    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    await ctx.db.patch(args.discussionId, {
      viewCount: discussion.viewCount + 1,
    });
  },
});
