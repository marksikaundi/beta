"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, Clock, Info, Shield, Wrench, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ChangelogPage() {
  const changelog = useQuery(api.changelog.getPublicChangelog, {});
  const systemStatus = useQuery(api.changelog.getSystemStatus, {});

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Zap className="h-4 w-4" />;
      case "improvement":
        return <CheckCircle className="h-4 w-4" />;
      case "bugfix":
        return <Wrench className="h-4 w-4" />;
      case "issue":
        return <AlertCircle className="h-4 w-4" />;
      case "maintenance":
        return <Clock className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "improvement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "bugfix":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "issue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "maintenance":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "security":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "degraded":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "major-outage":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "maintenance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Platform Status & Changelog</h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest platform changes, features, and status updates.
          </p>
        </div>

        {/* System Status */}
        {systemStatus && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {systemStatus.status === "operational" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  Current Status
                </div>
                <Badge className={getStatusColor(systemStatus.status)}>
                  {systemStatus.status.replace("-", " ").toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>
                Last updated {formatDistanceToNow(new Date(systemStatus.lastUpdated))} ago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{systemStatus.message}</p>
              
              {systemStatus.recentIssues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Active Issues:</h4>
                  {systemStatus.recentIssues.map((issue, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Badge className={getSeverityColor(issue.severity || "low")}>
                        {issue.severity?.toUpperCase() || "LOW"}
                      </Badge>
                      <span>{issue.title}</span>
                      {issue.affectedServices && (
                        <span className="text-muted-foreground">
                          ({issue.affectedServices.join(", ")})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Changelog Entries */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recent Updates</h2>
          
          {!changelog && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {changelog && changelog.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No changelog entries yet.</p>
              </CardContent>
            </Card>
          )}

          {changelog?.map((entry) => (
            <Card key={entry._id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(entry.type)}>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(entry.type)}
                          {entry.type.toUpperCase()}
                        </div>
                      </Badge>
                      
                      {entry.version && (
                        <Badge variant="outline">v{entry.version}</Badge>
                      )}
                      
                      {entry.severity && (
                        <Badge className={getSeverityColor(entry.severity)}>
                          {entry.severity.toUpperCase()}
                        </Badge>
                      )}
                      
                      {entry.type === "issue" && (
                        <Badge 
                          className={entry.isResolved 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {entry.isResolved ? "RESOLVED" : "ACTIVE"}
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl mb-2">{entry.title}</CardTitle>
                    <CardDescription className="text-base">
                      {entry.description}
                    </CardDescription>
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <div>
                      {entry.publishedAt 
                        ? formatDistanceToNow(new Date(entry.publishedAt)) + " ago"
                        : formatDistanceToNow(new Date(entry.createdAt)) + " ago"
                      }
                    </div>
                    <div>by {entry.authorName}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {entry.affectedServices && entry.affectedServices.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Affected Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.affectedServices.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: entry.content.replace(/\n/g, "<br />") 
                    }} 
                  />
                </div>
                
                {entry.tags && entry.tags.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t">
          <p className="text-muted-foreground mb-4">
            For technical support or to report issues, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <p className="text-sm text-muted-foreground">
              Want to get notified of updates? Follow us on social media or subscribe to our newsletter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
