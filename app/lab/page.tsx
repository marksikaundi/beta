"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { executeCode, type TestCase, type ExecutionResult } from "@/lib/code-execution";

// Coding Challenge Interface
interface Challenge {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  problemStatement: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: TestCase[];
  starterCode: {
    javascript: string;
    python: string;
  };
  hints: string[];
  constraints: string[];
  tags: string[];
  points: number;
  timeLimit: number; // in minutes
}

// Sample challenges data
const sampleChallenges: Challenge[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "beginner",
    description: "Find two numbers in an array that add up to a target sum.",
    problemStatement: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    testCases: [
      {
        input: "[[2,7,11,15], 9]",
        expectedOutput: "[0,1]",
        description: "Basic case with solution at beginning"
      },
      {
        input: "[[3,2,4], 6]",
        expectedOutput: "[1,2]",
        description: "Solution not at beginning"
      },
      {
        input: "[[3,3], 6]",
        expectedOutput: "[0,1]",
        description: "Duplicate numbers"
      }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`
    },
    hints: [
      "Try using a hash map to store numbers you've seen",
      "For each number, check if (target - number) exists in your hash map",
      "Don't forget to return the indices, not the values"
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists."
    ],
    tags: ["Array", "Hash Table"],
    points: 100,
    timeLimit: 30
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "beginner",
    description: "Write a function that reverses a string.",
    problemStatement: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    testCases: [
      {
        input: '[["h","e","l","l","o"]]',
        expectedOutput: '["o","l","l","e","h"]',
        description: "Basic string reversal"
      },
      {
        input: '[["H","a","n","n","a","h"]]',
        expectedOutput: '["h","a","n","n","a","H"]',
        description: "Palindrome-like string"
      }
    ],
    starterCode: {
      javascript: `function reverseString(s) {
    // Your code here
    
}`,
      python: `def reverse_string(s):
    # Your code here
    pass`
    },
    hints: [
      "Use two pointers, one at the start and one at the end",
      "Swap characters and move pointers towards each other",
      "Stop when pointers meet in the middle"
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁵",
      "s[i] is a printable ascii character."
    ],
    tags: ["Two Pointers", "String"],
    points: 80,
    timeLimit: 20
  },
  {
    id: "fibonacci",
    title: "Fibonacci Number",
    difficulty: "beginner", 
    description: "Calculate the nth Fibonacci number.",
    problemStatement: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.

Given n, calculate F(n).`,
    examples: [
      {
        input: "n = 2",
        output: "1",
        explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1."
      },
      {
        input: "n = 3", 
        output: "2",
        explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2."
      },
      {
        input: "n = 4",
        output: "3",
        explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3."
      }
    ],
    testCases: [
      {
        input: "[2]",
        expectedOutput: "1",
        description: "Small fibonacci number"
      },
      {
        input: "[3]",
        expectedOutput: "2", 
        description: "Another small case"
      },
      {
        input: "[4]",
        expectedOutput: "3",
        description: "Slightly larger case"
      }
    ],
    starterCode: {
      javascript: `function fib(n) {
    // Your code here
    
}`,
      python: `def fib(n):
    # Your code here
    pass`
    },
    hints: [
      "Try the iterative approach for better performance",
      "You only need to keep track of the last two numbers",
      "Handle the base cases n=0 and n=1 first"
    ],
    constraints: [
      "0 ≤ n ≤ 30"
    ],
    tags: ["Math", "Dynamic Programming", "Recursion", "Memoization"],
    points: 90,
    timeLimit: 25
  }
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "advanced":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200";
  }
}

export default function LabPage() {
  const { user } = useUser();
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [language, setLanguage] = useState<"javascript" | "python">("javascript");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  const currentChallenge = sampleChallenges[currentChallengeIndex];

  // Load starter code when challenge or language changes
  useEffect(() => {
    setCode(currentChallenge.starterCode[language]);
    setExecutionResult(null);
  }, [currentChallenge, language]);

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const result = await executeCode(code, language, currentChallenge.testCases);
      setExecutionResult(result);
      
      // Mark challenge as completed if all tests pass
      if (result.passed && result.testResults?.every(t => t.passed)) {
        setCompletedChallenges(prev => new Set([...prev, currentChallenge.id]));
      }
    } catch (error) {
      setExecutionResult({
        output: "",
        error: error instanceof Error ? error.message : "Unknown error",
        passed: false,
        executionTime: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(currentChallenge.starterCode[language]);
    setExecutionResult(null);
  };

  const goToChallenge = (index: number) => {
    if (index >= 0 && index < sampleChallenges.length) {
      setCurrentChallengeIndex(index);
    }
  };

  const isCompleted = completedChallenges.has(currentChallenge.id);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Coding Lab</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Challenge</span>
                <span className="text-sm font-medium">
                  {currentChallengeIndex + 1} of {sampleChallenges.length}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Challenge Navigation */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToChallenge(currentChallengeIndex - 1)}
                  disabled={currentChallengeIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToChallenge(currentChallengeIndex + 1)}
                  disabled={currentChallengeIndex === sampleChallenges.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Language Selector */}
              <Select value={language} onValueChange={(value: "javascript" | "python") => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Problem Statement Panel */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="border-b p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold">{currentChallenge.title}</h2>
                    {isCompleted && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(currentChallenge.difficulty)} variant="outline">
                      {currentChallenge.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Target className="h-3 w-3 mr-1" />
                      {currentChallenge.points} pts
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentChallenge.timeLimit}m
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {currentChallenge.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {currentChallenge.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  {/* Problem Statement */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Problem Statement
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                        {currentChallenge.problemStatement}
                      </div>
                    </div>
                  </div>

                  {/* Examples */}
                  <div>
                    <h3 className="font-medium mb-3">Examples</h3>
                    <div className="space-y-4">
                      {currentChallenge.examples.map((example, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="font-medium text-sm mb-2">Example {index + 1}:</div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Input:</span>
                              <code className="ml-2 bg-muted px-2 py-1 rounded">{example.input}</code>
                            </div>
                            <div>
                              <span className="font-medium">Output:</span>
                              <code className="ml-2 bg-muted px-2 py-1 rounded">{example.output}</code>
                            </div>
                            {example.explanation && (
                              <div>
                                <span className="font-medium">Explanation:</span>
                                <span className="ml-2 text-muted-foreground">{example.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="font-medium mb-2">Constraints</h3>
                    <ul className="text-sm space-y-1">
                      {currentChallenge.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-muted-foreground mr-2">•</span>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">{constraint}</code>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hints */}
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                      className="mb-3"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      {showHints ? "Hide" : "Show"} Hints ({currentChallenge.hints.length})
                    </Button>
                    {showHints && (
                      <div className="space-y-2">
                        {currentChallenge.hints.map((hint, index) => (
                          <div key={index} className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <div className="text-sm">
                              <span className="font-medium text-blue-700 dark:text-blue-300">Hint {index + 1}:</span>
                              <span className="ml-2 text-blue-600 dark:text-blue-400">{hint}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Code Editor Panel */}
          <ResizablePanel defaultSize={55} minSize={40}>
            <div className="h-full flex flex-col">
              <div className="border-b p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4" />
                    <span className="font-medium">Code Editor</span>
                    <Badge variant="outline" className="text-xs">
                      {language}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetCode}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isRunning ? "Running..." : "Run Code"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Code Input */}
                <div className="flex-1 border-b">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`Write your ${language} code here...`}
                    className="h-full resize-none border-0 rounded-none font-mono text-sm"
                    style={{ minHeight: "300px" }}
                  />
                </div>

                {/* Results Panel */}
                <div className="h-1/2 flex flex-col">
                  <Tabs defaultValue="output" className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="output">Output</TabsTrigger>
                      <TabsTrigger value="tests">Test Results</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="output" className="flex-1 mt-0">
                      <ScrollArea className="h-full">
                        <div className="p-4">
                          {executionResult ? (
                            <div className="space-y-3">
                              {executionResult.error ? (
                                <div className="flex items-start space-x-2 text-red-600">
                                  <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                  <div>
                                    <div className="font-medium">Error</div>
                                    <pre className="text-sm mt-1 whitespace-pre-wrap">{executionResult.error}</pre>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start space-x-2 text-green-600">
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

                    <TabsContent value="tests" className="flex-1 mt-0">
                      <ScrollArea className="h-full">
                        <div className="p-4">
                          {executionResult?.testResults ? (
                            <div className="space-y-3">
                              {executionResult.testResults.map((result, index) => (
                                <div
                                  key={index}
                                  className={`border rounded-lg p-3 ${
                                    result.passed
                                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                                      : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">{result.description}</span>
                                    <div className="flex items-center space-x-1">
                                      {result.passed ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                      )}
                                      <span className={`text-xs font-medium ${
                                        result.passed ? "text-green-600" : "text-red-600"
                                      }`}>
                                        {result.passed ? "PASS" : "FAIL"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="space-y-1 text-sm">
                                    <div>
                                      <span className="font-medium">Input:</span>
                                      <code className="ml-2 bg-background px-2 py-1 rounded text-xs">
                                        {result.input}
                                      </code>
                                    </div>
                                    <div>
                                      <span className="font-medium">Expected:</span>
                                      <code className="ml-2 bg-background px-2 py-1 rounded text-xs">
                                        {result.expected}
                                      </code>
                                    </div>
                                    <div>
                                      <span className="font-medium">Actual:</span>
                                      <code className={`ml-2 px-2 py-1 rounded text-xs ${
                                        result.passed ? "bg-background" : "bg-red-100 dark:bg-red-900/20"
                                      }`}>
                                        {result.actual}
                                      </code>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <Separator />
                              
                              <div className="text-center">
                                <div className={`text-sm font-medium ${
                                  executionResult.passed ? "text-green-600" : "text-red-600"
                                }`}>
                                  {executionResult.testResults.filter(t => t.passed).length} of{" "}
                                  {executionResult.testResults.length} tests passed
                                </div>
                                {executionResult.passed && (
                                  <div className="mt-2 flex items-center justify-center text-green-600">
                                    <Award className="h-4 w-4 mr-2" />
                                    <span className="text-sm">Challenge completed! +{currentChallenge.points} points</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground py-8">
                              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>Run your code to see test results</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Challenge Progress Bar */}
      <div className="border-t bg-background p-2">
        <div className="container mx-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Progress:</span>
              <div className="flex space-x-1">
                {sampleChallenges.map((challenge, index) => (
                  <Button
                    key={challenge.id}
                    variant={index === currentChallengeIndex ? "default" : "outline"}
                    size="sm"
                    className={`w-8 h-8 p-0 ${
                      completedChallenges.has(challenge.id)
                        ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
                        : ""
                    }`}
                    onClick={() => goToChallenge(index)}
                  >
                    {completedChallenges.has(challenge.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-muted-foreground">
              {completedChallenges.size} of {sampleChallenges.length} completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
