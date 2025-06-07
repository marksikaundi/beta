"use client";

import { useState, useEffect } from "react";
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
  ArrowRight,
} from "lucide-react";
import { executeCode, type TestCase, type ExecutionResult } from "@/lib/code-execution";

// Coding Challenge Interface
interface Challenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
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

// Sample challenges data - more comprehensive and boot.dev style
const codingChallenges: Challenge[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
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
    // Write your solution here
    
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
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
    difficulty: "Easy",
    description: "Write a function that reverses a string in-place.",
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
    // Write your solution here
    
}`,
      python: `def reverse_string(s):
    # Write your solution here
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
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Determine whether an integer is a palindrome.",
    problemStatement: `Given an integer x, return true if x is palindrome integer.

An integer is a palindrome when it reads the same backward as forward.

For example, 121 is a palindrome while 123 is not.`,
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "Reads 01 from right to left. Therefore it is not a palindrome."
      }
    ],
    testCases: [
      {
        input: "[121]",
        expectedOutput: "true",
        description: "Positive palindrome"
      },
      {
        input: "[-121]",
        expectedOutput: "false",
        description: "Negative number"
      },
      {
        input: "[10]",
        expectedOutput: "false",
        description: "Number ending with 0"
      }
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
    // Write your solution here
    
}`,
      python: `def is_palindrome(x):
    # Write your solution here
    pass`
    },
    hints: [
      "Negative numbers are not palindromes",
      "You can convert to string or reverse the number mathematically",
      "Think about edge cases like numbers ending with 0"
    ],
    constraints: [
      "-2³¹ ≤ x ≤ 2³¹ - 1"
    ],
    tags: ["Math"],
    points: 90,
    timeLimit: 25
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Determine if parentheses are valid and properly nested.",
    problemStatement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: "true"
      },
      {
        input: 's = "()[]{}"',
        output: "true"
      },
      {
        input: 's = "(]"',
        output: "false"
      }
    ],
    testCases: [
      {
        input: '["()"]',
        expectedOutput: "true",
        description: "Simple valid parentheses"
      },
      {
        input: '["()[]{}" ]',
        expectedOutput: "true",
        description: "Multiple valid brackets"
      },
      {
        input: '["(]"]',
        expectedOutput: "false",
        description: "Mismatched brackets"
      }
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Write your solution here
    
}`,
      python: `def is_valid(s):
    # Write your solution here
    pass`
    },
    hints: [
      "Use a stack data structure",
      "Push opening brackets onto the stack",
      "When you see a closing bracket, check if it matches the top of the stack"
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only '()[]{}'."
    ],
    tags: ["Stack", "String"],
    points: 120,
    timeLimit: 30
  },
  {
    id: "merge-two-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: "Merge two sorted linked lists into one sorted list.",
    problemStatement: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]"
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]"
      }
    ],
    testCases: [
      {
        input: "[[1,2,4], [1,3,4]]",
        expectedOutput: "[1,1,2,3,4,4]",
        description: "Both lists have elements"
      },
      {
        input: "[[], []]",
        expectedOutput: "[]",
        description: "Both lists empty"
      },
      {
        input: "[[], [0]]",
        expectedOutput: "[0]",
        description: "One list empty"
      }
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function mergeTwoLists(list1, list2) {
    // Write your solution here
    
}`,
      python: `# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    # Write your solution here
    pass`
    },
    hints: [
      "Use a dummy node to simplify the logic",
      "Compare the values of the current nodes",
      "Link the smaller node and advance that pointer"
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 ≤ Node.val ≤ 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    tags: ["Linked List", "Recursion"],
    points: 150,
    timeLimit: 40
  }
];

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

export default function LabPage() {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [language, setLanguage] = useState<"javascript" | "python">("javascript");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  const currentChallenge = codingChallenges[currentChallengeIndex];

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
    if (index >= 0 && index < codingChallenges.length) {
      setCurrentChallengeIndex(index);
    }
  };

  const isCompleted = completedChallenges.has(currentChallenge.id);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h1 className="font-semibold">Coding Challenges</h1>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Target className="h-3.5 w-3.5" />
              Level {currentChallengeIndex + 1}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={(value: "javascript" | "python") => setLanguage(value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToChallenge(currentChallengeIndex - 1)}
                disabled={currentChallengeIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground">
                {currentChallengeIndex + 1} / {codingChallenges.length}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToChallenge(currentChallengeIndex + 1)}
                disabled={currentChallengeIndex === codingChallenges.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
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
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">{currentChallenge.title}</h2>
                  <Badge 
                    variant="outline" 
                    className={getDifficultyColor(currentChallenge.difficulty)}
                  >
                    {currentChallenge.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {currentChallenge.timeLimit}m
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Target className="h-3.5 w-3.5" />
                    {currentChallenge.points} pts
                  </Badge>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Problem Statement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-sm whitespace-pre-wrap">
                          {currentChallenge.problemStatement}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Examples */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Examples</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentChallenge.examples.map((example, index) => (
                        <div key={index} className="text-sm space-y-2">
                          <div className="font-medium">Example {index + 1}:</div>
                          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div>
                              <span className="font-mono">Input:</span>
                              <code className="ml-2 font-mono text-xs">{example.input}</code>
                            </div>
                            <div>
                              <span className="font-mono">Output:</span>
                              <code className="ml-2 font-mono text-xs">{example.output}</code>
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
                      <CardTitle className="text-sm font-medium">Constraints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1.5">
                        {currentChallenge.constraints.map((constraint, index) => (
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
                          {currentChallenge.hints.map((hint, index) => (
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetCode}
                      className="h-8"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Reset
                    </Button>
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
                            {executionResult.testResults.map((result, index) => (
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
                                    <span className="text-muted-foreground">Input:</span>
                                    <code className="ml-2 bg-muted px-1.5 py-0.5 rounded">
                                      {result.input}
                                    </code>
                                  </div>
                                  <div className="font-mono text-xs">
                                    <span className="text-muted-foreground">Expected:</span>
                                    <code className="ml-2 bg-muted px-1.5 py-0.5 rounded">
                                      {result.expected}
                                    </code>
                                  </div>
                                  <div className="font-mono text-xs">
                                    <span className="text-muted-foreground">Actual:</span>
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
                            ))}

                            <div className="text-center pt-2">
                              <div
                                className={`text-sm font-medium ${
                                  executionResult.passed
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {executionResult.testResults.filter((t) => t.passed)
                                  .length}{" "}
                                of {executionResult.testResults.length} tests passed
                              </div>
                              {executionResult.passed && (
                                <div className="mt-2 flex items-center justify-center gap-1.5 text-green-600">
                                  <Award className="h-4 w-4" />
                                  <span className="text-sm">
                                    Challenge completed! +{currentChallenge.points} points
                                  </span>
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
