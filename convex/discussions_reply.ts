import { v } from "convex/values";
import { mutation, query, MutationCtx } from "./_generated/server";

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

// Vote on a reply
export const voteReply = mutation({
  args: {
    replyId: v.id("discussionReplies"),
    voteType: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getOrCreateUser(ctx, identity);

    // Check if user already voted on this reply
    const existingVote = await ctx.db
      .query("replyVotes")
      .withIndex("by_user_reply", (q) =>
        q.eq("userId", user._id).eq("replyId", args.replyId)
      )
      .unique();

    const reply = await ctx.db.get(args.replyId);
    if (!reply) {
      throw new Error("Reply not found");
    }

    if (existingVote) {
      // Update existing vote
      if (existingVote.voteType !== args.voteType) {
        await ctx.db.patch(existingVote._id, { voteType: args.voteType });

        // Update reply counts
        const upvoteDiff = args.voteType === "up" ? 2 : -2;
        const downvoteDiff = args.voteType === "down" ? 2 : -2;

        await ctx.db.patch(args.replyId, {
          upvotes: reply.upvotes + (args.voteType === "up" ? upvoteDiff : 0),
          downvotes:
            reply.downvotes + (args.voteType === "down" ? downvoteDiff : 0),
        });
      }
    } else {
      // Create new vote
      await ctx.db.insert("replyVotes", {
        userId: user._id,
        replyId: args.replyId,
        voteType: args.voteType,
        createdAt: Date.now(),
      });

      // Update reply counts
      await ctx.db.patch(args.replyId, {
        upvotes: args.voteType === "up" ? reply.upvotes + 1 : reply.upvotes,
        downvotes:
          args.voteType === "down" ? reply.downvotes + 1 : reply.downvotes,
      });
    }
  },
});

// Mark a reply as the accepted answer
export const acceptReply = mutation({
  args: {
    replyId: v.id("discussionReplies"),
    discussionId: v.id("discussions"),
  },
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
      throw new Error("Only the discussion author can accept an answer");
    }

    // Clear any previously accepted replies
    const previouslyAccepted = await ctx.db
      .query("discussionReplies")
      .withIndex("by_discussion", (q) =>
        q.eq("discussionId", args.discussionId)
      )
      .filter((q) => q.eq(q.field("isAccepted"), true))
      .collect();

    for (const reply of previouslyAccepted) {
      await ctx.db.patch(reply._id, { isAccepted: false });
    }

    // Mark this reply as accepted
    await ctx.db.patch(args.replyId, { isAccepted: true });

    // Mark the discussion as resolved
    if (!discussion.isResolved) {
      await ctx.db.patch(args.discussionId, {
        isResolved: true,
        updatedAt: Date.now(),
      });
    }
  },
});
