"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, CheckCircle, Clock, Info } from "lucide-react";
import Link from "next/link";

export function SystemStatusWidget() {
  const systemStatus = useQuery(api.changelog.getSystemStatus, {});

  if (!systemStatus) {
    return null;
  }

  const getStatusIcon = () => {
    switch (systemStatus.status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "major-outage":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (systemStatus.status) {
      case "operational":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "degraded":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "major-outage":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {getStatusIcon()}
          <span className="hidden sm:inline">Status</span>
          {systemStatus.activeIssues > 0 && (
            <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
              {systemStatus.activeIssues}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <div className="flex-1">
              <div className="font-medium">System Status</div>
              <Badge className={getStatusColor()}>
                {systemStatus.status.replace("-", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {systemStatus.message}
          </p>

          {systemStatus.recentIssues.length > 0 && (
            <div className="space-y-2">
              <div className="font-medium text-sm">Active Issues:</div>
              {systemStatus.recentIssues.map((issue, index) => (
                <div key={index} className="text-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Badge 
                      variant={issue.severity === "critical" || issue.severity === "high" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {issue.severity?.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{issue.title}</span>
                  </div>
                  {issue.affectedServices && issue.affectedServices.length > 0 && (
                    <div className="text-xs text-muted-foreground ml-1">
                      Affects: {issue.affectedServices.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/changelog">
                View Full Status Page
              </Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
