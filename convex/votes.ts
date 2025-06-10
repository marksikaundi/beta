import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Check if a user has already voted on a discussion
export const hasUserVotedOnDiscussion = query({
  args: {
    userId: v.id("users"),
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    const existingVote = await ctx.db
      .query("discussionVotes")
      .withIndex("by_user_discussion", (q) =>
        q.eq("userId", args.userId).eq("discussionId", args.discussionId)
      )
      .unique();

    return existingVote ? existingVote.voteType : null;
  },
});

// Check if a user has already voted on a reply
export const hasUserVotedOnReply = query({
  args: {
    userId: v.id("users"),
    replyId: v.id("discussionReplies"),
  },
  handler: async (ctx, args) => {
    const existingVote = await ctx.db
      .query("replyVotes")
      .withIndex("by_user_reply", (q) =>
        q.eq("userId", args.userId).eq("replyId", args.replyId)
      )
      .unique();

    return existingVote ? existingVote.voteType : null;
  },
});
