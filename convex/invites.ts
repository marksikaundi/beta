import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Query to get all invites sent by a user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user's ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get all invites sent by this user
    const invites = await ctx.db
      .query("invites")
      .withIndex("by_inviter", (q) => q.eq("inviterId", user._id))
      .collect();

    return invites;
  },
});

// Mutation to create a new invite
export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user's ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if an invite already exists for this email
    const existingInvite = await ctx.db
      .query("invites")
      .withIndex("by_invitee_email", (q) => q.eq("inviteeEmail", args.email))
      .first();

    if (existingInvite) {
      throw new Error("Invite already sent to this email");
    }

    // Create the invite
    const invite = await ctx.db.insert("invites", {
      inviterId: user._id,
      inviteeEmail: args.email,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return invite;
  },
});
