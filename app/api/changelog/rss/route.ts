import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function GET() {
  try {
    // Fetch the public changelog entries
    const entries = await fetchQuery(api.changelog.getPublicChangelog, {});

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LupLeg Platform Changelog</title>
    <description>Latest updates, improvements, and announcements for the LupLeg learning platform</description>
    <link>${siteUrl}/changelog</link>
    <atom:link href="${siteUrl}/api/changelog/rss" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>LupLeg Changelog System</generator>
    
    ${entries
      .map(
        (entry) => `
    <item>
      <title><![CDATA[${entry.title}]]></title>
      <description><![CDATA[${entry.description}]]></description>
      <link>${siteUrl}/changelog#entry-${entry._id}</link>
      <guid isPermaLink="true">${siteUrl}/changelog#entry-${entry._id}</guid>
      <pubDate>${new Date(
        entry.publishedAt || entry.createdAt
      ).toUTCString()}</pubDate>
      <category>${entry.type}</category>
      ${entry.severity ? `<category>severity-${entry.severity}</category>` : ""}
    </item>
    `
      )
      .join("")}
    
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
