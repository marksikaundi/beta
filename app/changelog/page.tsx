"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  Shield,
  Wrench,
  Zap,
  Search,
  Filter,
  Rss,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function ChangelogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const changelog = useQuery(api.changelog.getPublicChangelog, {});
  const systemStatus = useQuery(api.changelog.getSystemStatus, {});

  // Filter and search logic
  const filteredChangelog = useMemo(() => {
    if (!changelog) return [];

    return changelog.filter((entry) => {
      // Search filter
      const searchMatch =
        searchQuery === "" ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Type filter
      const typeMatch = selectedType === "all" || entry.type === selectedType;

      // Severity filter
      const severityMatch =
        selectedSeverity === "all" || entry.severity === selectedSeverity;

      return searchMatch && typeMatch && severityMatch;
    });
  }, [changelog, searchQuery, selectedType, selectedSeverity]);

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
          <h1 className="text-4xl font-bold mb-4">
            Platform Status & Changelog
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest platform changes, features, and status
            updates.
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
                Last updated{" "}
                {formatDistanceToNow(new Date(systemStatus.lastUpdated))} ago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{systemStatus.message}</p>

              {systemStatus.recentIssues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Active Issues:</h4>
                  {systemStatus.recentIssues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Badge
                        className={getSeverityColor(issue.severity || "low")}
                      >
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

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Search
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/api/changelog/rss" target="_blank">
                    <Rss className="h-4 w-4 mr-2" />
                    RSS Feed
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/api/changelog" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    JSON API
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search changelog entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="feature">Features</SelectItem>
                  <SelectItem value="improvement">Improvements</SelectItem>
                  <SelectItem value="bugfix">Bug Fixes</SelectItem>
                  <SelectItem value="issue">Issues</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedSeverity}
                onValueChange={setSelectedSeverity}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchQuery ||
              selectedType !== "all" ||
              selectedSeverity !== "all") && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredChangelog?.length || 0} entries found
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedSeverity("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Changelog Entries */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recent Updates</h2>

          {!changelog && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {changelog && filteredChangelog.length === 0 && searchQuery && (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </CardContent>
            </Card>
          )}

          {changelog && filteredChangelog.length === 0 && !searchQuery && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No changelog entries yet.
                </p>
              </CardContent>
            </Card>
          )}

          {filteredChangelog?.map((entry) => (
            <Card
              key={entry._id}
              className="overflow-hidden"
              id={`entry-${entry._id}`}
            >
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
                          className={
                            entry.isResolved
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {entry.isResolved ? "RESOLVED" : "ACTIVE"}
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-xl mb-2">
                      {entry.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {entry.description}
                    </CardDescription>
                  </div>

                  <div className="text-right text-sm text-muted-foreground">
                    <div>
                      {entry.publishedAt
                        ? formatDistanceToNow(new Date(entry.publishedAt)) +
                          " ago"
                        : formatDistanceToNow(new Date(entry.createdAt)) +
                          " ago"}
                    </div>
                    <div>by {entry.authorName}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {entry.affectedServices &&
                  entry.affectedServices.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Affected Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {entry.affectedServices.map((service, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: entry.content.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>

                {entry.tags && entry.tags.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
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
            For technical support or to report issues, please contact our
            support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <p className="text-sm text-muted-foreground">
              Want to get notified of updates? Follow us on social media or
              subscribe to our newsletter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
