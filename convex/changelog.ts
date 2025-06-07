import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Public queries that don't require authentication
export const getPublicChangelog = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    type: v.optional(
      v.union(
        v.literal("feature"),
        v.literal("improvement"),
        v.literal("bugfix"),
        v.literal("issue"),
        v.literal("maintenance"),
        v.literal("security")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { limit = 20, offset = 0, type } = args;

    let query = ctx.db
      .query("changelog")
      .filter((q) => q.eq(q.field("status"), "published"))
      .order("desc");

    if (type) {
      query = query.filter((q) => q.eq(q.field("type"), type));
    }

    const entries = await query
      .collect()
      .then((results) => results.slice(offset, offset + limit));

    return entries.map((entry) => ({
      _id: entry._id,
      title: entry.title,
      description: entry.description,
      content: entry.content,
      type: entry.type,
      severity: entry.severity,
      isResolved: entry.isResolved,
      affectedServices: entry.affectedServices,
      version: entry.version,
      authorName: entry.authorName,
      tags: entry.tags,
      publishedAt: entry.publishedAt,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));
  },
});

export const getChangelogEntry = query({
  args: { id: v.id("changelog") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);
    
    if (!entry || entry.status !== "published") {
      return null;
    }

    return {
      _id: entry._id,
      title: entry.title,
      description: entry.description,
      content: entry.content,
      type: entry.type,
      severity: entry.severity,
      isResolved: entry.isResolved,
      affectedServices: entry.affectedServices,
      version: entry.version,
      authorName: entry.authorName,
      tags: entry.tags,
      publishedAt: entry.publishedAt,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  },
});

export const getSystemStatus = query({
  args: {},
  handler: async (ctx) => {
    // Get recent issues and their resolution status
    const recentIssues = await ctx.db
      .query("changelog")
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "published"),
          q.eq(q.field("type"), "issue")
        )
      )
      .order("desc")
      .take(10);

    const activeIssues = recentIssues.filter(issue => !issue.isResolved);
    const resolvedIssues = recentIssues.filter(issue => issue.isResolved);

    // Determine overall system status
    const criticalIssues = activeIssues.filter(issue => issue.severity === "critical");
    const highIssues = activeIssues.filter(issue => issue.severity === "high");

    let systemStatus: "operational" | "degraded" | "major-outage";
    let statusMessage = "";

    if (criticalIssues.length > 0) {
      systemStatus = "major-outage";
      statusMessage = "We are experiencing major issues affecting the platform.";
    } else if (highIssues.length > 0) {
      systemStatus = "degraded";
      statusMessage = "We are experiencing some issues that may affect performance.";
    } else if (activeIssues.length > 0) {
      systemStatus = "degraded";
      statusMessage = "Minor issues are being investigated.";
    } else {
      systemStatus = "operational";
      statusMessage = "All systems are operational.";
    }

    return {
      status: systemStatus,
      message: statusMessage,
      activeIssues: activeIssues.length,
      lastUpdated: new Date().toISOString(),
      recentIssues: activeIssues.slice(0, 3).map(issue => ({
        title: issue.title,
        severity: issue.severity,
        affectedServices: issue.affectedServices,
        createdAt: issue.createdAt,
      })),
    };
  },
});

// Admin functions (require authentication and admin role)
export const createChangelogEntry = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("feature"),
      v.literal("improvement"),
      v.literal("bugfix"),
      v.literal("issue"),
      v.literal("maintenance"),
      v.literal("security")
    ),
    severity: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      )
    ),
    affectedServices: v.optional(v.array(v.string())),
    version: v.optional(v.string()),
    tags: v.array(v.string()),
    publishNow: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    // Check if user is admin (you may need to implement admin role checking)
    // This is a placeholder - implement according to your auth system
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date().toISOString();
    
    const changelogEntry = await ctx.db.insert("changelog", {
      title: args.title,
      description: args.description,
      content: args.content,
      type: args.type,
      status: args.publishNow ? "published" : "draft",
      severity: args.severity,
      isResolved: args.type === "issue" ? false : undefined,
      affectedServices: args.affectedServices,
      version: args.version,
      authorId: user.clerkId,
      authorName: user.displayName,
      tags: args.tags,
      publishedAt: args.publishNow ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });

    return changelogEntry;
  },
});

export const updateChangelogEntry = mutation({
  args: {
    id: v.id("changelog"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("published"),
        v.literal("draft"),
        v.literal("archived")
      )
    ),
    isResolved: v.optional(v.boolean()),
    severity: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      )
    ),
    affectedServices: v.optional(v.array(v.string())),
    version: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    const { id, ...updates } = args;
    const now = new Date().toISOString();

    // If publishing for the first time, set publishedAt
    if (updates.status === "published") {
      const existing = await ctx.db.get(id);
      if (existing && !existing.publishedAt) {
        await ctx.db.patch(id, {
          ...updates,
          publishedAt: now,
          updatedAt: now,
        });
      } else {
        await ctx.db.patch(id, {
          ...updates,
          updatedAt: now,
        });
      }
    } else {
      await ctx.db.patch(id, {
        ...updates,
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

export const getAllChangelogEntries = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    const { limit = 50, offset = 0 } = args;

    const entries = await ctx.db
      .query("changelog")
      .order("desc")
      .collect()
      .then((results) => results.slice(offset, offset + limit));

    return entries;
  },
});

// Development/Demo function to create sample changelog entries
export const createSampleChangelogEntries = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date().toISOString();
    
    const sampleEntries = [
      {
        title: "New Interactive Coding Environment",
        description: "Introduced a brand new interactive coding environment with real-time collaboration features.",
        content: `We're excited to announce the launch of our new interactive coding environment! 

**New Features:**
- Real-time code execution in multiple languages
- Collaborative coding sessions
- Enhanced syntax highlighting
- Integrated debugging tools
- Auto-save functionality

**What's Changed:**
- Improved performance by 40%
- Better mobile responsiveness
- Enhanced error handling

This update represents a major milestone in making coding education more accessible and engaging for everyone.`,
        type: "feature" as const,
        status: "published" as const,
        version: "2.1.0",
        tags: ["coding", "collaboration", "performance"],
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      },
      {
        title: "Database Performance Improvements",
        description: "Optimized database queries resulting in 60% faster page load times.",
        content: `We've been working hard to improve the platform's performance. Here's what we've accomplished:

**Performance Improvements:**
- Database query optimization
- Reduced API response times
- Improved caching mechanisms
- Enhanced CDN delivery

**Results:**
- 60% faster page load times
- 40% reduction in server response time
- Improved user experience across all devices

All changes have been thoroughly tested and deployed without any downtime.`,
        type: "improvement" as const,
        status: "published" as const,
        tags: ["performance", "database", "optimization"],
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      },
      {
        title: "Fixed Authentication Issues",
        description: "Resolved login problems affecting some users during peak hours.",
        content: `We identified and fixed several authentication issues that were affecting user logins during peak hours.

**Issues Resolved:**
- Intermittent login failures during high traffic
- Session timeout problems
- OAuth provider connectivity issues

**Actions Taken:**
- Upgraded authentication infrastructure
- Improved error handling and logging
- Added redundancy for critical authentication services

All users should now experience smooth and reliable authentication.`,
        type: "bugfix" as const,
        status: "published" as const,
        tags: ["authentication", "bugfix", "reliability"],
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      },
      {
        title: "Platform Maintenance - API Rate Limiting",
        description: "Scheduled maintenance to implement new API rate limiting for better service stability.",
        content: `We will be performing scheduled maintenance to implement new API rate limiting measures.

**Maintenance Details:**
- **Date:** June 15, 2025
- **Time:** 2:00 AM - 4:00 AM UTC
- **Duration:** Approximately 2 hours
- **Impact:** Brief API interruptions possible

**What We're Doing:**
- Implementing intelligent rate limiting
- Upgrading server infrastructure
- Enhancing DDoS protection

**Expected Benefits:**
- More stable service during high traffic
- Better protection against abuse
- Improved overall platform reliability

We apologize for any inconvenience and appreciate your patience.`,
        type: "maintenance" as const,
        status: "published" as const,
        severity: "medium" as const,
        affectedServices: ["API", "Dashboard", "Learning Platform"],
        tags: ["maintenance", "infrastructure", "rate-limiting"],
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        title: "Security Update - Enhanced Data Protection",
        description: "Important security updates to strengthen data protection and user privacy.",
        content: `We've implemented several important security enhancements to better protect your data and privacy.

**Security Improvements:**
- Enhanced encryption for sensitive data
- Improved access controls and permissions
- Updated security headers and policies
- Strengthened password requirements

**Privacy Enhancements:**
- Better data anonymization practices
- Improved cookie management
- Enhanced user consent mechanisms
- Updated privacy policy

**Action Required:**
No action is required from users. All security updates have been applied automatically.

**Questions?**
If you have any security concerns, please contact our security team at security@lupleg.com`,
        type: "security" as const,
        status: "published" as const,
        tags: ["security", "privacy", "encryption"],
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      }
    ];

    const createdEntries = [];
    
    for (const entry of sampleEntries) {
      const changelogEntry = await ctx.db.insert("changelog", {
        ...entry,
        authorId: user.clerkId,
        authorName: user.displayName,
        createdAt: entry.publishedAt || now,
        updatedAt: entry.publishedAt || now,
      });
      createdEntries.push(changelogEntry);
    }

    return { 
      success: true, 
      created: createdEntries.length,
      message: `Created ${createdEntries.length} sample changelog entries`
    };
  },
});