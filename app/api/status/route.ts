import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function GET() {
  try {
    // Fetch system status
    const systemStatus = await fetchQuery(api.changelog.getSystemStatus, {});

    // Transform for API response
    const response = {
      status: systemStatus.status,
      message: systemStatus.message,
      activeIssues: systemStatus.activeIssues,
      lastUpdated: systemStatus.lastUpdated,
      recentIssues: systemStatus.recentIssues,
      metadata: {
        generated: new Date().toISOString(),
        endpoint: "/api/status",
        version: "1.0",
      },
    };

    // Set appropriate cache headers based on status
    const cacheTime = systemStatus.status === "operational" ? 300 : 60; // 5 min if operational, 1 min if issues

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": `public, max-age=${cacheTime}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching system status:", error);
    return NextResponse.json(
      {
        status: "unknown",
        message: "Unable to determine system status",
        error: "Service temporarily unavailable",
        metadata: {
          generated: new Date().toISOString(),
          endpoint: "/api/status",
          version: "1.0",
        },
      },
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
