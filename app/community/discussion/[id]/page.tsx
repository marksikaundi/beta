"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  CheckCircle,
  ArrowLeft,
  Clock,
  User,
  Send,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function DiscussionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isSignedIn } = useUser();
  const discussionId = params.id as string;

  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discussion = useQuery(api.discussions.getDiscussion, {
    discussionId: discussionId as any,
  });

  const incrementViewCount = useMutation(api.discussions.incrementViewCount);
  const createReply = useMutation(api.discussions.createReply);
  const voteDiscussion = useMutation(api.discussions.voteDiscussion);
  const voteReply = useMutation(api["discussions-reply"].voteReply);

  // Increment view count on page load
  useEffect(() => {
    if (discussionId) {
      incrementViewCount({ discussionId: discussionId as any });
    }
  }, [discussionId, incrementViewCount]);

  const handleCreateReply = async () => {
    if (!replyContent.trim()) return;

    if (!isSignedIn) {
      toast.error("You must be signed in to reply");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReply({
        discussionId: discussionId as any,
        content: replyContent,
      });
      setReplyContent("");
      toast.success("Reply posted successfully!");
    } catch (error) {
      console.error("Failed to post reply:", error);
      toast.error("Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteDiscussion = async (voteType: "up" | "down") => {
    if (!isSignedIn) {
      toast.error("You must be signed in to vote");
      return;
    }

    try {
      await voteDiscussion({
        discussionId: discussionId as any,
        voteType,
      });
    } catch (error) {
      console.error("Failed to vote:", error);
      toast.error("Failed to vote. Please try again.");
    }
  };

  const handleVoteReply = async (replyId: string, voteType: "up" | "down") => {
    if (!isSignedIn) {
      toast.error("You must be signed in to vote");
      return;
    }

    try {
      await voteReply({
        replyId: replyId as any,
        voteType,
      });
    } catch (error) {
      console.error("Failed to vote on reply:", error);
      toast.error("Failed to vote on reply. Please try again.");
    }
  };

  if (!discussion) {
    return (
      <>
        <MainNavigation />
        <div className="container mx-auto py-12">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavigation />
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => router.push("/community")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to discussions
        </Button>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={discussion.author?.imageUrl} />
                <AvatarFallback>
                  {discussion.author?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    {discussion.isResolved && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Resolved
                      </Badge>
                    )}
                    <h1 className="text-2xl font-bold">{discussion.title}</h1>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{discussion.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(discussion.createdAt))}{" "}
                        ago
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{discussion.viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{discussion.replyCount} replies</span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                  <p className="whitespace-pre-wrap">{discussion.content}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-6">
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoteDiscussion("up")}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{discussion.upvotes}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoteDiscussion("down")}
                    className="flex items-center gap-1"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{discussion.downvotes}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {discussion.replyCount} Replies
          </h2>

          {discussion.replies?.length > 0 ? (
            <div className="space-y-4">
              {discussion.replies.map((reply) => (
                <Card key={reply._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={reply.author?.imageUrl} />
                        <AvatarFallback>
                          {reply.author?.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {reply.author?.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              • {formatDistanceToNow(new Date(reply.createdAt))}{" "}
                              ago
                            </span>
                            {reply.isAccepted && (
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Accepted Answer
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                          <p className="whitespace-pre-wrap">{reply.content}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVoteReply(reply._id, "up")}
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{reply.upvotes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVoteReply(reply._id, "down")}
                            className="flex items-center gap-1"
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span>{reply.downvotes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No replies yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to respond to this discussion!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post a Reply</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSignedIn ? (
              <>
                <Textarea
                  placeholder="Share your thoughts or answer the question..."
                  rows={6}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleCreateReply}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Post Reply
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  You need to be signed in to reply to discussions.
                </p>
                <Button onClick={() => router.push("/sign-in")}>
                  Sign In to Reply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
