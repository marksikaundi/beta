"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
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

        <Card className="mb-8 shadow-sm border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardContent className="p-0">
            {/* Header with status badge */}
            {discussion.isResolved && (
              <div className="px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-100 dark:border-green-800">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Resolved
                </Badge>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-white shadow-md dark:border-gray-700">
                    <AvatarImage src={discussion.author?.imageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {discussion.author?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full dark:border-gray-800"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                      {discussion.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          {discussion.author?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(discussion.createdAt))}{" "}
                          ago
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        <span>{discussion.viewCount} views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.replyCount} replies</span>
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-gray dark:prose-invert max-w-none mb-6 text-gray-700 dark:text-gray-300">
                    <p className="whitespace-pre-wrap leading-relaxed text-base">
                      {discussion.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {discussion.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVoteDiscussion("up")}
                      className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:border-green-700 dark:hover:text-green-400 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-medium">{discussion.upvotes}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVoteDiscussion("down")}
                      className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span className="font-medium">
                        {discussion.downvotes}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {discussion.replyCount}{" "}
                {discussion.replyCount === 1 ? "Reply" : "Replies"}
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
          </div>

          {discussion.replies?.length > 0 ? (
            <div className="space-y-4">
              {discussion.replies.map((reply, index) => (
                <Card
                  key={reply._id}
                  className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-0">
                    {reply.isAccepted && (
                      <div className="px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-100 dark:border-green-800">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1.5 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Accepted Answer
                        </Badge>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm dark:border-gray-700">
                            <AvatarImage src={reply.author?.imageUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
                              {reply.author?.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -left-1 h-4 w-4 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {reply.author?.name}
                              </span>
                              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                  {formatDistanceToNow(
                                    new Date(reply.createdAt)
                                  )}{" "}
                                  ago
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="prose prose-gray dark:prose-invert max-w-none mb-4">
                            <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
                              {reply.content}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVoteReply(reply._id, "up")}
                              className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span className="font-medium">
                                {reply.upvotes}
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVoteReply(reply._id, "down")}
                              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                            >
                              <ThumbsDown className="h-4 w-4" />
                              <span className="font-medium">
                                {reply.downvotes}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-sm border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No replies yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Be the first to respond to this discussion and help the
                    community!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Share Your Thoughts
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Join the conversation and help the community
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSignedIn ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm dark:border-gray-700">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                        {user?.firstName?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Share your thoughts, ask questions, or provide helpful answers..."
                        rows={6}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="resize-none border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {replyContent.length > 0 && (
                            <span>{replyContent.length} characters</span>
                          )}
                        </div>
                        <Button
                          onClick={handleCreateReply}
                          disabled={!replyContent.trim() || isSubmitting}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          {isSubmitting ? "Posting..." : "Post Reply"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Join the Discussion
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Sign in to share your thoughts and help the community grow.
                  </p>
                  <Button
                    onClick={() => router.push("/sign-in")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign In to Reply
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
