"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Code,
  FileText,
  Video,
  HelpCircle,
  Trophy,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  executeCode,
  type TestCase,
  type ExecutionResult,
} from "@/lib/code-execution";

interface Lesson {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  type: "reading" | "coding" | "quiz" | "project" | "video";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  experiencePoints: number;
  starterCode?: string;
  solutionCode?: string;
  language?: string;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
    description: string;
  }>;
  questions?: Array<{
    question: string;
    type: "multiple-choice" | "true-false" | "code-completion";
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    points: number;
  }>;
  videoUrl?: string;
  videoDuration?: number;
}

function getLessonIcon(type: string) {
  switch (type) {
    case "reading":
      return FileText;
    case "coding":
      return Code;
    case "quiz":
      return HelpCircle;
    case "video":
      return Video;
    case "project":
      return Trophy;
    default:
      return BookOpen;
  }
}

function CodingChallenge({
  lesson,
  onSubmit,
  isSubmitting,
}: {
  lesson: Lesson;
  onSubmit: (code: string) => void;
  isSubmitting: boolean;
}) {
  const [code, setCode] = useState(lesson.starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running code...");

    try {
      const result = await executeCode(
        code,
        lesson.language || "javascript",
        lesson.testCases as TestCase[]
      );

      setExecutionResult(result);

      if (result.error) {
        setOutput(`Error: ${result.error}`);
      } else {
        setOutput(result.output);
      }
    } catch (error) {
      setOutput(`Execution failed: ${error}`);
      setExecutionResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(lesson.starterCode || "");
    setOutput("");
    setExecutionResult(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Code Editor</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
              >
                <Terminal className="h-4 w-4 mr-1" />
                Run
              </Button>
            </div>
          </div>

          <div className="relative">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Write your code here..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Output</h3>
          <Card>
            <CardContent className="p-4">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {output || "Run your code to see the output"}
              </pre>
            </CardContent>
          </Card>

          {lesson.testCases && (
            <div className="space-y-2">
              <h4 className="font-medium">Test Cases</h4>
              {lesson.testCases.map((testCase, index) => {
                const testResult = executionResult?.testResults?.[index];
                return (
                  <Card
                    key={index}
                    className={`text-sm ${
                      testResult
                        ? testResult.passed
                          ? "ring-2 ring-green-200 bg-green-50"
                          : "ring-2 ring-red-200 bg-red-50"
                        : ""
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {testCase.description}
                        </div>
                        {testResult && (
                          <Badge
                            variant={
                              testResult.passed ? "default" : "destructive"
                            }
                          >
                            {testResult.passed ? "✅ PASS" : "❌ FAIL"}
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground mt-1">
                        Input:{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          {testCase.input}
                        </code>
                      </div>
                      <div className="text-muted-foreground">
                        Expected:{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          {testCase.expectedOutput}
                        </code>
                      </div>
                      {testResult && (
                        <div className="text-muted-foreground">
                          Actual:{" "}
                          <code
                            className={`px-1 rounded ${
                              testResult.passed ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {testResult.actual}
                          </code>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => onSubmit(code)}
          disabled={isSubmitting}
          className="min-w-24"
        >
          {isSubmitting ? "Submitting..." : "Submit Solution"}
        </Button>
      </div>
    </div>
  );
}

function QuizChallenge({
  lesson,
  onSubmit,
  isSubmitting,
}: {
  lesson: Lesson;
  onSubmit: (answers: Record<number, any>) => void;
  isSubmitting: boolean;
}) {
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const handleAnswerChange = (questionIndex: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const allAnswered =
    lesson.questions?.every((_, index) => answers[index] !== undefined) ||
    false;

  return (
    <div className="space-y-6">
      {lesson.questions?.map((question, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium">Question {index + 1}</h3>
                <Badge variant="secondary">{question.points} points</Badge>
              </div>

              <p className="text-muted-foreground">{question.question}</p>

              {question.type === "multiple-choice" && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={optionIndex}
                        checked={answers[index] === optionIndex}
                        onChange={() => handleAnswerChange(index, optionIndex)}
                        className="text-primary"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "true-false" && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="true"
                      checked={answers[index] === true}
                      onChange={() => handleAnswerChange(index, true)}
                      className="text-primary"
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="false"
                      checked={answers[index] === false}
                      onChange={() => handleAnswerChange(index, false)}
                      className="text-primary"
                    />
                    <span>False</span>
                  </label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button
          onClick={() => onSubmit(answers)}
          disabled={isSubmitting || !allAnswered}
          className="min-w-24"
        >
          {isSubmitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      </div>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const trackSlug = params.slug as string;
  const lessonSlug = params.lessonSlug as string;

  const [startTime] = useState(Date.now());

  // Get lesson data
  const lessonData = useQuery(api.lessons.getLessonBySlug, {
    slug: lessonSlug,
    clerkId: user?.id,
  });

  // Mutations
  const updateProgress = useMutation(api.progress.updateLessonProgress);
  const completeLesson = useMutation(api.progress.completeLesson);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mark lesson as started
    if (lessonData?.lesson && user) {
      updateProgress({
        clerkId: user.id,
        lessonId: lessonData.lesson._id,
        status: "in-progress",
        timeSpent: 0,
      });
    }
  }, [lessonData?.lesson, user, updateProgress]);

  const handleSubmission = async (data: any) => {
    if (!lessonData?.lesson || !user) return;

    setIsSubmitting(true);
    try {
      const timeSpent = Math.round((Date.now() - startTime) / (1000 * 60)); // minutes

      await completeLesson({
        clerkId: user.id,
        lessonId: lessonData.lesson._id,
        timeSpent,
        submissionData: data,
      });

      // Redirect to next lesson or track overview
      if (lessonData.navigation.next) {
        router.push(
          `/tracks/${trackSlug}/lessons/${lessonData.navigation.next.slug}`
        );
      } else {
        router.push(`/tracks/${trackSlug}`);
      }
    } catch (error) {
      console.error("Error submitting lesson:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lessonData) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="grid gap-8 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <Skeleton className="h-80 w-full" />
              </div>
              <div>
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { lesson, track, progress, navigation } = lessonData;

  if (!lesson || !track) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The lesson you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href={`/tracks/${trackSlug}`}>Back to Track</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const LessonIcon = getLessonIcon(lesson.type);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
              href="/tracks"
              className="hover:text-foreground transition-colors"
            >
              Tracks
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/tracks/${trackSlug}`}
              className="hover:text-foreground transition-colors"
            >
              {track.title}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{lesson.title}</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href={`/tracks/${trackSlug}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Track
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: track.color }}
                >
                  <LessonIcon className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{lesson.title}</h1>
                  <p className="text-muted-foreground">{lesson.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Lesson {navigation.current} of {navigation.total || "?"}
              </div>
              <div className="flex space-x-2">
                {navigation.previous && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/tracks/${trackSlug}/lessons/${navigation.previous.slug}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {navigation.next && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/tracks/${trackSlug}/lessons/${navigation.next.slug}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  {lesson.type === "reading" && (
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          code({ className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {lesson.content}
                      </ReactMarkdown>

                      <div className="flex justify-end mt-8">
                        <Button onClick={() => handleSubmission({})}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </Button>
                      </div>
                    </div>
                  )}

                  {lesson.type === "coding" && (
                    <div className="space-y-6">
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <ReactMarkdown>{lesson.content}</ReactMarkdown>
                      </div>
                      <Separator />
                      <CodingChallenge
                        lesson={lesson}
                        onSubmit={(code) => handleSubmission({ code })}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )}

                  {lesson.type === "quiz" && (
                    <div className="space-y-6">
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <ReactMarkdown>{lesson.content}</ReactMarkdown>
                      </div>
                      <Separator />
                      <QuizChallenge
                        lesson={lesson}
                        onSubmit={(answers) => handleSubmission({ answers })}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )}

                  {lesson.type === "video" && (
                    <div className="space-y-6">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500">
                            Video content would be loaded here
                          </p>
                        </div>
                      </div>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <ReactMarkdown>{lesson.content}</ReactMarkdown>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => handleSubmission({})}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lesson Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lesson Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {lesson.estimatedMinutes}
                      </div>
                      <div className="text-muted-foreground">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {lesson.experiencePoints}
                      </div>
                      <div className="text-muted-foreground">XP</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <Badge variant="outline" className="capitalize">
                        {lesson.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty</span>
                      <Badge variant="outline" className="capitalize">
                        {lesson.difficulty}
                      </Badge>
                    </div>
                    {progress && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                          variant={
                            progress.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {progress.status.replace("-", " ")}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {navigation.previous && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link
                        href={`/tracks/${trackSlug}/lessons/${navigation.previous.slug}`}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <div className="text-left">
                          <div className="text-xs text-muted-foreground">
                            Previous
                          </div>
                          <div className="text-sm truncate">
                            {navigation.previous.title}
                          </div>
                        </div>
                      </Link>
                    </Button>
                  )}

                  {navigation.next && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link
                        href={`/tracks/${trackSlug}/lessons/${navigation.next.slug}`}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        <div className="text-left">
                          <div className="text-xs text-muted-foreground">
                            Next
                          </div>
                          <div className="text-sm truncate">
                            {navigation.next.title}
                          </div>
                        </div>
                      </Link>
                    </Button>
                  )}

                  <Button variant="ghost" className="w-full" asChild>
                    <Link href={`/tracks/${trackSlug}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Back to Track Overview
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
