"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Clock, 
  CheckCircle,
  Pin,
  Plus,
  Search,
  Filter,
  Users,
  TrendingUp,
  MessageCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CommunityPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "unanswered">("recent");
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);

  // Form state for new discussion
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const discussions = useQuery(api.discussions.getDiscussions, {
    tag: selectedTag || undefined,
    sortBy,
    limit: 20,
  });

  const createDiscussion = useMutation(api.discussions.createDiscussion);
  const voteDiscussion = useMutation(api.discussions.voteDiscussion);

  const handleCreateDiscussion = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      await createDiscussion({
        title: newTitle,
        content: newContent,
        tags: newTags,
      });
      
      setNewTitle("");
      setNewContent("");
      setNewTags([]);
      setShowNewDiscussion(false);
    } catch (error) {
      console.error("Failed to create discussion:", error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newTags.includes(tagInput.trim())) {
      setNewTags([...newTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewTags(newTags.filter(tag => tag !== tagToRemove));
  };

  const handleVote = async (discussionId: string, voteType: "up" | "down") => {
    try {
      await voteDiscussion({ discussionId: discussionId as any, voteType });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  // Popular tags (this could be cached or computed)
  const popularTags = [
    "javascript", "python", "react", "nodejs", "css", "html", 
    "backend", "frontend", "databases", "algorithms", "debugging", "career"
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Community Discussions</h1>
            <p className="text-muted-foreground mt-2">
              Connect with fellow learners, ask questions, and share knowledge
            </p>
          </div>
          
          <Dialog open={showNewDiscussion} onOpenChange={setShowNewDiscussion}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Start Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="What's your question or topic?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Description</Label>
                  <Textarea
                    id="content"
                    placeholder="Provide more details about your question or topic..."
                    rows={6}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Tags</Label>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="Add tags (press Enter)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {newTags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewDiscussion(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDiscussion}>
                    Create Discussion
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Discussions</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold">567</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Questions Answered</p>
                  <p className="text-2xl font-bold">89%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">+42</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="unanswered">Unanswered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Popular Tags */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Popular Tags:</p>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedTag === "" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag("")}
            >
              All
            </Badge>
            {popularTags.map((tag) => (
              <Badge 
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions?.map((discussion) => (
          <Card key={discussion._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={discussion.author?.imageUrl} />
                  <AvatarFallback>
                    {discussion.author?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {discussion.isPinned && (
                          <Pin className="h-4 w-4 text-yellow-500" />
                        )}
                        {discussion.isResolved && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer">
                          {discussion.title}
                        </h3>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {discussion.content.substring(0, 200)}...
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        by {discussion.author?.name} • {formatDistanceToNow(new Date(discussion.createdAt))} ago
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(discussion._id, "up")}
                          className="h-8 px-2"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span className="ml-1">{discussion.upvotes}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(discussion._id, "down")}
                          className="h-8 px-2"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span className="ml-1">{discussion.downvotes}</span>
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span>{discussion.replyCount}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{discussion.viewCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {discussions?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a discussion in this topic!
              </p>
              <Button onClick={() => setShowNewDiscussion(true)}>
                Start Discussion
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
