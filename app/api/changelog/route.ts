import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const type = searchParams.get("type");

    // Fetch changelog entries
    const entries = await fetchQuery(api.changelog.getPublicChangelog, {});

    // Filter by type if specified
    let filteredEntries = entries;
    if (
      type &&
      [
        "feature",
        "improvement",
        "bugfix",
        "issue",
        "maintenance",
        "security",
      ].includes(type)
    ) {
      filteredEntries = entries.filter((entry) => entry.type === type);
    }

    // Limit results
    const limitedEntries = filteredEntries.slice(0, limit);

    // Transform for API response
    const response = {
      meta: {
        total: filteredEntries.length,
        limit: limit,
        type: type || "all",
        generated: new Date().toISOString(),
      },
      data: limitedEntries.map((entry) => ({
        id: entry._id,
        title: entry.title,
        description: entry.description,
        content: entry.content,
        type: entry.type,
        severity: entry.severity,
        isResolved: entry.isResolved,
        affectedServices: entry.affectedServices,
        version: entry.version,
        tags: entry.tags,
        author: {
          name: entry.authorName,
        },
        publishedAt: entry.publishedAt,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      })),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching changelog API:", error);
    return NextResponse.json(
      { error: "Failed to fetch changelog" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
