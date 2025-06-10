import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getOrCreateUser } from "./users";
import { api } from "./_generated/api";

interface AuthIdentity {
  tokenIdentifier: string;
  subject: string;
  email?: string | null;
  emailAddresses?: Array<{ emailAddress: string }>;
  name?: string;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    // Return empty array if not authenticated instead of throwing
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    // Return empty array if user not found instead of throwing
    if (!user) {
      return [];
    }

    const invites = await ctx.db
      .query("invites")
      .withIndex("by_inviter", (q) => q.eq("inviterId", user._id))
      .collect();

    return invites;
  },
});

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getOrCreateUser(ctx, {
      subject: identity.subject,
      email: identity.email ?? undefined,
      emailAddresses: identity.emailAddresses as { emailAddress: string }[],
      username:
        identity.tokenIdentifier?.split("|")[1] ??
        identity.email?.split("@")[0],
      name: identity.name,
    });

    // Check for existing invite
    const existingInvite = await ctx.db
      .query("invites")
      .withIndex("by_invitee_email", (q) => q.eq("inviteeEmail", args.email))
      .first();

    if (existingInvite) {
      throw new Error("Invite already sent to this email");
    }

    // Create new invite
    const inviteId = await ctx.db.insert("invites", {
      inviterId: user._id,
      inviteeEmail: args.email,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    });

    const invite = await ctx.db.get(inviteId);
    if (!invite) {
      throw new Error("Failed to create invite");
    }

    // Send the invite email - we'll handle this as a separate action that gets triggered
    // after the invite is created successfully
    await ctx.scheduler.runAfter(0, api.emails.sendInviteEmail, {
      to: args.email,
      inviterName: user.displayName || "A CodePlex user",
    });

    return invite;
  },
});
