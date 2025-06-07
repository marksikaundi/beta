"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle, Clock, Info, Shield, Wrench, Zap, Plus, Edit, Send, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ChangelogFormData {
  title: string;
  description: string;
  content: string;
  type: "feature" | "improvement" | "bugfix" | "issue" | "maintenance" | "security";
  severity?: "low" | "medium" | "high" | "critical";
  affectedServices: string[];
  version?: string;
  tags: string[];
  publishNow: boolean;
}

export default function ChangelogAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [formData, setFormData] = useState<ChangelogFormData>({
    title: "",
    description: "",
    content: "",
    type: "feature",
    affectedServices: [],
    tags: [],
    publishNow: false,
  });

  const entries = useQuery(api.changelog.getAllChangelogEntries, {});
  const stats = useQuery(api.changelog.getChangelogStats, {});
  const createEntry = useMutation(api.changelog.createChangelogEntry);
  const updateEntry = useMutation(api.changelog.updateChangelogEntry);
  const sendNotification = useMutation(api.changelog.sendChangelogNotification);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEntry) {
        await updateEntry({
          id: editingEntry._id,
          ...formData,
        });
        toast.success("Changelog entry updated successfully!");
        setEditingEntry(null);
      } else {
        await createEntry(formData);
        toast.success("Changelog entry created successfully!");
      }
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        content: "",
        type: "feature",
        affectedServices: [],
        tags: [],
        publishNow: false,
      });
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to save changelog entry");
      console.error(error);
    }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      description: entry.description,
      content: entry.content,
      type: entry.type,
      severity: entry.severity,
      affectedServices: entry.affectedServices || [],
      version: entry.version,
      tags: entry.tags || [],
      publishNow: entry.status === "published",
    });
    setShowForm(true);
  };

  const handleResolveIssue = async (entryId: any) => {
    try {
      await updateEntry({
        id: entryId,
        isResolved: true,
      });
      toast.success("Issue marked as resolved!");
    } catch (error) {
      toast.error("Failed to resolve issue");
    }
  };

  const handleSendNotification = async (entryId: any) => {
    try {
      const result = await sendNotification({
        changelogId: entryId,
        notificationType: "in-app",
      });
      
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to send notification");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature": return <Zap className="h-4 w-4" />;
      case "improvement": return <CheckCircle className="h-4 w-4" />;
      case "bugfix": return <Wrench className="h-4 w-4" />;
      case "issue": return <AlertCircle className="h-4 w-4" />;
      case "maintenance": return <Clock className="h-4 w-4" />;
      case "security": return <Shield className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "improvement": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "bugfix": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "issue": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "maintenance": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "security": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Changelog Management</h1>
            <p className="text-muted-foreground">
              Manage platform updates, announcements, and status reports.
            </p>
          </div>
          <Button 
            onClick={() => {
              setShowForm(!showForm);
              setEditingEntry(null);
              setFormData({
                title: "",
                description: "",
                content: "",
                type: "feature",
                affectedServices: [],
                tags: [],
                publishNow: false,
              });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>

        {/* Statistics Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.published} published, {stats.drafts} drafts
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.activeIssues}</div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Features Added</CardTitle>
                <Zap className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.typeStats.feature}</div>
                <p className="text-xs text-muted-foreground">
                  New features released
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bugs Fixed</CardTitle>
                <Wrench className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.typeStats.bugfix}</div>
                <p className="text-xs text-muted-foreground">
                  Issues resolved
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingEntry ? "Edit Changelog Entry" : "Create New Changelog Entry"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="improvement">Improvement</SelectItem>
                        <SelectItem value="bugfix">Bug Fix</SelectItem>
                        <SelectItem value="issue">Issue/Incident</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the change or issue..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Detailed description with markdown support..."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(formData.type === "issue" || formData.type === "maintenance") && (
                    <div>
                      <Label htmlFor="severity">Severity</Label>
                      <Select 
                        value={formData.severity || ""} 
                        onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={formData.version || ""}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="e.g., 1.2.0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags.join(", ")}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                      })}
                      placeholder="api, dashboard, performance"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="services">Affected Services (comma-separated)</Label>
                  <Input
                    id="services"
                    value={formData.affectedServices.join(", ")}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      affectedServices: e.target.value.split(",").map(service => service.trim()).filter(Boolean)
                    })}
                    placeholder="login, dashboard, api, lessons"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="publish"
                    checked={formData.publishNow}
                    onCheckedChange={(checked) => setFormData({ ...formData, publishNow: checked })}
                  />
                  <Label htmlFor="publish">Publish immediately</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingEntry ? "Update Entry" : "Create Entry"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingEntry(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Entries</h2>
          
          {!entries && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {entries && entries.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No changelog entries yet.</p>
              </CardContent>
            </Card>
          )}

          {entries?.map((entry) => (
            <Card key={entry._id}>
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
                      
                      <Badge variant={entry.status === "published" ? "default" : "secondary"}>
                        {entry.status.toUpperCase()}
                      </Badge>
                      
                      {entry.version && (
                        <Badge variant="outline">v{entry.version}</Badge>
                      )}
                      
                      {entry.type === "issue" && (
                        <Badge 
                          variant={entry.isResolved ? "default" : "destructive"}
                        >
                          {entry.isResolved ? "RESOLVED" : "ACTIVE"}
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg mb-1">{entry.title}</CardTitle>
                    <CardDescription>{entry.description}</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {(entry.severity === "critical" || entry.type === "issue") && entry.status === "published" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSendNotification(entry._id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Notify Users
                      </Button>
                    )}
                    {entry.type === "issue" && !entry.isResolved && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleResolveIssue(entry._id)}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Created {formatDistanceToNow(new Date(entry.createdAt))} ago by {entry.authorName}
                  {entry.publishedAt && (
                    <span> • Published {formatDistanceToNow(new Date(entry.publishedAt))} ago</span>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}