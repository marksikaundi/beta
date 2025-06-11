"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Terminal,
  BookOpen,
  Target,
  Lightbulb,
  Zap,
} from "lucide-react";
import { type TestCase, type ExecutionResult } from "@/lib/code-execution";

export default function LabPage() {
  const searchParams = useSearchParams();
  const labId = searchParams.get("id");
  const lab = useQuery(
    api.labs.getById,
    // Only pass the id if it looks like a valid Convex ID
    labId && labId.length > 0 && labId.includes("_")
      ? { id: labId as Id<"labs"> }
      : "skip"
  );
  const validateSolution = useMutation(api.labs.validateSolution);
  const router = useRouter();

  const [language, setLanguage] = useState<"javascript" | "python">(
    "javascript"
  );
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Navigate back to challenges page
  const handleBackToChallenges = () => {
    router.push("/challenges");
  };

  // Loading and error states
  if (!labId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">No challenge ID provided</p>
          <Button onClick={handleBackToChallenges}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Challenges
          </Button>
        </div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Load starter code when lab or language changes
  useEffect(() => {
    if (lab) {
      setCode(lab.starterCode[language]);
      setExecutionResult(null);
    }
  }, [lab, language]);

  const handleRunCode = async () => {
    if (!lab) return;

    setIsRunning(true);
    try {
      const result = await validateSolution({
        labId: lab._id,
        code,
        language,
      });

      setExecutionResult(result);

      // Mark lab as completed if all tests pass
      if (result.passed) {
        setIsCompleted(true);
      }
    } catch (error) {
      const errorResult: ExecutionResult = {
        output: "",
        error: error instanceof Error ? error.message : "Unknown error",
        passed: false,
        executionTime: 0,
        testResults: [
          {
            passed: false,
            input: "",
            expectedOutput: "",
            actual: error instanceof Error ? error.message : "Unknown error",
            description: "Execution failed",
          },
        ],
      };
      setExecutionResult(errorResult);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    if (!lab) return;
    setCode(lab.starterCode[language]);
    setExecutionResult(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToChallenges}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Challenges
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h1 className="font-semibold">{lab.title}</h1>
            </div>
            <Badge
              variant="outline"
              className={getDifficultyColor(lab.difficulty)}
            >
              {lab.difficulty}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Award className="h-4 w-4 mr-1" />
              <span>{lab.points} points</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={language}
              onValueChange={(value: "javascript" | "python") =>
                setLanguage(value)
              }
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              size="sm"
              className="h-8"
            >
              {isRunning ? (
                <>Running...</>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  Run Tests
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Problem Statement Panel */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="border-b p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lab.timeLimit}m
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Target className="h-3.5 w-3.5" />
                    {lab.points} pts
                  </Badge>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Problem Statement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-sm whitespace-pre-wrap">
                          {lab.problemStatement}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Examples */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Examples
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {lab.examples.map((example, index) => (
                        <div key={index} className="text-sm space-y-2">
                          <div className="font-medium">
                            Example {index + 1}:
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div>
                              <span className="font-mono">Input:</span>
                              <code className="ml-2 font-mono text-xs">
                                {example.input}
                              </code>
                            </div>
                            <div>
                              <span className="font-mono">Output:</span>
                              <code className="ml-2 font-mono text-xs">
                                {example.output}
                              </code>
                            </div>
                            {example.explanation && (
                              <div className="text-muted-foreground text-xs">
                                {example.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Constraints */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Constraints
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1.5">
                        {lab.constraints.map((constraint, index) => (
                          <li key={index} className="flex items-baseline gap-2">
                            <span className="text-muted-foreground">•</span>
                            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                              {constraint}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Hints Section */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-sm font-medium">Hints</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowHints(!showHints)}
                          className="h-7"
                        >
                          <Lightbulb className="h-4 w-4 mr-1" />
                          {showHints ? "Hide" : "Show"}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    {showHints && (
                      <CardContent className="pt-2">
                        <div className="space-y-2">
                          {lab.hints.map((hint, index) => (
                            <div
                              key={index}
                              className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 text-sm"
                            >
                              <span className="text-blue-700 dark:text-blue-300 font-medium">
                                Hint {index + 1}:
                              </span>
                              <span className="ml-2 text-blue-600 dark:text-blue-400">
                                {hint}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Code Editor and Output Panel */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col">
              {/* Code Editor */}
              <div className="flex-1 flex flex-col">
                <div className="border-b p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="font-medium">Solution</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetCode}
                    className="h-8"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Reset
                  </Button>
                </div>

                <div className="flex-1">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="h-full resize-none rounded-none border-0 bg-background font-mono text-sm p-4"
                    placeholder={`Write your ${language} solution here...`}
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Output Panel */}
              <div className="h-[40%] border-t">
                <Tabs defaultValue="tests" className="h-full flex flex-col">
                  <div className="border-b px-2">
                    <TabsList className="h-10">
                      <TabsTrigger value="tests" className="h-8">
                        Test Results
                      </TabsTrigger>
                      <TabsTrigger value="output" className="h-8">
                        Output
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="tests" className="flex-1 p-0 mt-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-3">
                        {executionResult?.testResults ? (
                          <>
                            {executionResult.testResults.map(
                              (result, index) => (
                                <div
                                  key={index}
                                  className={`border rounded-lg p-3 ${
                                    result.passed
                                      ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                                      : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                      Test Case {index + 1}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={
                                        result.passed
                                          ? "border-green-500 text-green-600"
                                          : "border-red-500 text-red-600"
                                      }
                                    >
                                      {result.passed ? (
                                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                      ) : (
                                        <XCircle className="h-3.5 w-3.5 mr-1" />
                                      )}
                                      {result.passed ? "Pass" : "Fail"}
                                    </Badge>
                                  </div>
                                  <div className="space-y-1.5 text-sm">
                                    <div className="font-mono text-xs">
                                      <span className="text-muted-foreground">
                                        Input:
                                      </span>
                                      <code className="ml-2 bg-muted px-1.5 py-0.5 rounded">
                                        {result.input}
                                      </code>
                                    </div>
                                    <div className="font-mono text-xs">
                                      <span className="text-muted-foreground">
                                        Expected:
                                      </span>
                                      <code className="ml-2 bg-muted px-1.5 py-0.5 rounded">
                                        {result.expectedOutput}
                                      </code>
                                    </div>
                                    <div className="font-mono text-xs">
                                      <span className="text-muted-foreground">
                                        Actual:
                                      </span>
                                      <code
                                        className={`ml-2 px-1.5 py-0.5 rounded ${
                                          result.passed
                                            ? "bg-muted"
                                            : "bg-red-100 dark:bg-red-950/30"
                                        }`}
                                      >
                                        {result.actual}
                                      </code>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}

                            <div className="text-center pt-2">
                              <div
                                className={`text-sm font-medium ${
                                  executionResult.passed
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {
                                  executionResult.testResults.filter(
                                    (t) => t.passed
                                  ).length
                                }{" "}
                                of {executionResult.testResults.length} tests
                                passed
                              </div>
                              {executionResult.passed && (
                                <div className="mt-4 p-4 border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 rounded-lg">
                                  <div className="flex items-center justify-center gap-2 text-green-600 mb-3">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="font-medium">
                                      Challenge completed! +{lab.points} points
                                    </span>
                                  </div>
                                  <div className="flex justify-center gap-3">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={handleBackToChallenges}
                                    >
                                      <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                                      Back to Challenges
                                    </Button>
                                    <Button size="sm">
                                      Next Challenge
                                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Run your code to see test results</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="output" className="flex-1 p-0 mt-0">
                    <ScrollArea className="h-full">
                      <div className="p-4">
                        {executionResult ? (
                          <div className="space-y-3">
                            {executionResult.error ? (
                              <div className="flex items-start gap-2 text-red-600">
                                <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                <div>
                                  <div className="font-medium">Error</div>
                                  <pre className="text-sm mt-1 whitespace-pre-wrap">
                                    {executionResult.error}
                                  </pre>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                <div>
                                  <div className="font-medium">Success</div>
                                  <pre className="text-sm mt-1 whitespace-pre-wrap bg-muted p-3 rounded">
                                    {executionResult.output || "No output"}
                                  </pre>
                                </div>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              Execution time: {executionResult.executionTime}ms
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Run your code to see the output</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "text-green-600 border-green-300";
    case "Medium":
      return "text-yellow-600 border-yellow-300";
    case "Hard":
      return "text-red-600 border-red-300";
    default:
      return "text-gray-600 border-gray-300";
  }
}
