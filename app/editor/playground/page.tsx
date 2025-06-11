"use client";

import { useState, useEffect } from "react";
import { executeCode } from "@/lib/code-execution";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "@/components/playground/code-editor";
import {
  Play,
  Send,
  Eye,
  Volume2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const defaultCode = {
  typescript: `// TypeScript Example
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
  javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  python: `# Python Example
def find_minimum(nums):
    pass`,
  go: `// Go Example
package main

import "fmt"

func main() {
    fibonacci := make([]int, 10)
    fibonacci[0], fibonacci[1] = 0, 1
    
    for i := 2; i < len(fibonacci); i++ {
        fibonacci[i] = fibonacci[i-1] + fibonacci[i-2]
    }
    
    fmt.Println(fibonacci)
}`,
};

const testCode = {
  python: `# Test file
def test_find_minimum():
    assert find_minimum([7, 4, 3, 100, 2343243, 343434, 1, 2, 32]) == 1
    assert find_minimum([12, 12, 12]) == 12
    print("All tests passed!")`,
  javascript: `// Test file
function testFindMinimum() {
    console.assert(findMinimum([7, 4, 3, 100, 2343243, 343434, 1, 2, 32]) === 1);
    console.assert(findMinimum([12, 12, 12]) === 12);
    console.log("All tests passed!");
}`,
  typescript: `// Test file
function testFindMinimum(): void {
    console.assert(findMinimum([7, 4, 3, 100, 2343243, 343434, 1, 2, 32]) === 1);
    console.assert(findMinimum([12, 12, 12]) === 12);
    console.log("All tests passed!");
}`,
  go: `// Test file
package main

import (
    "fmt"
    "testing"
)

func TestFindMinimum(t *testing.T) {
    result1 := findMinimum([]int{7, 4, 3, 100, 2343243, 343434, 1, 2, 32})
    if result1 != 1 {
        t.Errorf("Expected 1, got %d", result1)
    }
    
    result2 := findMinimum([]int{12, 12, 12})
    if result2 != 12 {
        t.Errorf("Expected 12, got %d", result2)
    }
    
    fmt.Println("All tests passed!")
}`,
};

const sampleProblem = {
  title: "Find Minimum",
  description: `As mentioned, an "algorithm" is just a set of instructions that can be carried out to solve a problem.

It's not anymore magical than that.`,
  assignment: {
    title: "Assignment",
    content: `In this course, we'll be building pieces of a pretend social network: LinkedIn. LinkedIn is a place for professionals to virtue signal about how all the for-profit work they do is actually an altruistic endeavor. Think Facebook meets a job fair. It includes tools for influencers to track their growth.

We need to show our users the accounts they follow with the lowest follower counts. This will help them know who they follow that isn't popular enough to be worth following anymore.

Implement the "find minimum" algorithm in Python by completing the find_minimum() function. It accepts a list of integers nums and returns the smallest number in the list.`,
    steps: [
      { step: 1, text: 'Set minimum to positive infinity: float("inf").' },
      { step: 2, text: "If the list is empty, return None." },
      {
        step: 3,
        text: "For each number in the list nums, compare it to minimum. If the number is smaller than minimum, set minimum to that number.",
      },
      {
        step: 4,
        text: "minimum is now set to the smallest number in the list. Return it.",
      },
    ],
  },
};

export default function Playground() {
  const [language, setLanguage] = useState<string>("python");
  const [code, setCode] = useState(
    defaultCode[language as keyof typeof defaultCode]
  );
  const [testFileCode, setTestFileCode] = useState(
    testCode[language as keyof typeof testCode]
  );
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState<"vs-dark" | "vs-light">("vs-dark");
  const [activeFile, setActiveFile] = useState("main");
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [showSolution, setShowSolution] = useState(false);

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput("Running tests...");

      // Combine main code with test code for execution
      const combinedCode = `${code}\n\n${testFileCode}`;
      const result = await executeCode(combinedCode, language);

      setOutput(result.output || result.error || "No output");

      // Simulate test results based on execution
      if (result.error) {
        setExecutionResults([
          {
            input: "[7, 4, 3, 100, 2343243, 343434, 1, 2, 32]",
            expected: "1",
            actual: "Error",
            status: "fail",
          },
          {
            input: "[12, 12, 12]",
            expected: "12",
            actual: "Error",
            status: "fail",
          },
        ]);
      } else if (result.output?.includes("All tests passed")) {
        setExecutionResults([
          {
            input: "[7, 4, 3, 100, 2343243, 343434, 1, 2, 32]",
            expected: "1",
            actual: "1",
            status: "pass",
          },
          {
            input: "[12, 12, 12]",
            expected: "12",
            actual: "12",
            status: "pass",
          },
        ]);
      } else {
        setExecutionResults([
          {
            input: "[7, 4, 3, 100, 2343243, 343434, 1, 2, 32]",
            expected: "1",
            actual: "None",
            status: "fail",
          },
          {
            input: "[12, 12, 12]",
            expected: "12",
            actual: "None",
            status: "fail",
          },
        ]);
      }
    } catch (error: any) {
      setOutput(`Error: ${error?.message || "An unknown error occurred"}`);
      setExecutionResults([
        {
          input: "[7, 4, 3, 100, 2343243, 343434, 1, 2, 32]",
          expected: "1",
          actual: "Error",
          status: "fail",
        },
        {
          input: "[12, 12, 12]",
          expected: "12",
          actual: "Error",
          status: "fail",
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage as keyof typeof defaultCode]);
    setTestFileCode(testCode[newLanguage as keyof typeof testCode]);
    setOutput("");
    setExecutionResults([]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert("Code submitted successfully!");
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    const solutions = {
      python: `def find_minimum(nums):
    if not nums:
        return None
    
    minimum = float("inf")
    for num in nums:
        if num < minimum:
            minimum = num
    
    return minimum`,
      javascript: `function findMinimum(nums) {
    if (nums.length === 0) {
        return null;
    }
    
    let minimum = Infinity;
    for (let num of nums) {
        if (num < minimum) {
            minimum = num;
        }
    }
    
    return minimum;
}`,
      typescript: `function findMinimum(nums: number[]): number | null {
    if (nums.length === 0) {
        return null;
    }
    
    let minimum = Infinity;
    for (let num of nums) {
        if (num < minimum) {
            minimum = num;
        }
    }
    
    return minimum;
}`,
      go: `func findMinimum(nums []int) *int {
    if len(nums) == 0 {
        return nil
    }
    
    minimum := nums[0]
    for _, num := range nums {
        if num < minimum {
            minimum = num
        }
    }
    
    return &minimum
}`,
    };

    setCode(solutions[language as keyof typeof solutions]);
  };

  const getFileExtension = () => {
    switch (language) {
      case "python":
        return "py";
      case "javascript":
        return "js";
      case "typescript":
        return "ts";
      case "go":
        return "go";
      default:
        return "txt";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white">
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="go">Go</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full bg-slate-800 border-r border-slate-700">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold mb-4">
                      {sampleProblem.title}
                    </h1>
                    <p className="text-slate-300 leading-relaxed">
                      {sampleProblem.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      {sampleProblem.assignment.title}
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      {sampleProblem.assignment.content}
                    </p>

                    <ol className="space-y-3">
                      {sampleProblem.assignment.steps.map((step) => (
                        <li key={step.step} className="flex gap-3">
                          <Badge
                            variant="outline"
                            className="bg-slate-700 border-slate-600 text-white shrink-0"
                          >
                            {step.step}
                          </Badge>
                          <span className="text-slate-300">{step.text}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Code Editor */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col">
              {/* File Tabs */}
              <div className="flex border-b border-slate-700 bg-slate-800">
                <Tabs
                  value={activeFile}
                  onValueChange={setActiveFile}
                  className="w-full"
                >
                  <TabsList className="bg-transparent border-0 h-12 w-full justify-start rounded-none">
                    <TabsTrigger
                      value="main"
                      className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-400 border-0 rounded-none"
                    >
                      main.{getFileExtension()}
                    </TabsTrigger>
                    <TabsTrigger
                      value="test"
                      className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-400 border-0 rounded-none"
                    >
                      main_test.{getFileExtension()}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Code Editor */}
              <div className="flex-1">
                <Tabs
                  value={activeFile}
                  onValueChange={setActiveFile}
                  className="h-full"
                >
                  <TabsContent value="main" className="h-full p-0 m-0">
                    <CodeEditor
                      language={language}
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      theme="vs-dark"
                    />
                  </TabsContent>
                  <TabsContent value="test" className="h-full p-0 m-0">
                    <CodeEditor
                      language={language}
                      value={testFileCode}
                      onChange={(value) => setTestFileCode(value || "")}
                      theme="vs-dark"
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-2 p-4 bg-slate-800 border-t border-slate-700">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
                <Button
                  onClick={handleShowSolution}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Solution
                </Button>
              </div>

              {/* Test Results */}
              <div className="h-48 bg-slate-900 border-t border-slate-700">
                <div className="border-b border-slate-700 px-4 py-2">
                  <h3 className="text-sm font-medium text-white">
                    Test Results
                  </h3>
                </div>
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {executionResults.length > 0 ? (
                      executionResults.map((test, index) => (
                        <Card
                          key={index}
                          className="bg-slate-800 border-slate-700"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-slate-400">
                                    Inputs:
                                  </span>
                                  <code className="text-sm text-white bg-slate-700 px-2 py-1 rounded">
                                    {test.input}
                                  </code>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-slate-400">
                                    Expecting:
                                  </span>
                                  <code className="text-sm text-white bg-slate-700 px-2 py-1 rounded">
                                    {test.expected}
                                  </code>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-slate-400">
                                    Actual:
                                  </span>
                                  <code
                                    className={`text-sm px-2 py-1 rounded ${
                                      test.status === "pass"
                                        ? "text-green-400 bg-green-900/20"
                                        : "text-red-400 bg-red-900/20"
                                    }`}
                                  >
                                    {test.actual}
                                  </code>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {test.status === "fail" ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    test.status === "fail"
                                      ? "text-red-500"
                                      : "text-green-500"
                                  }`}
                                >
                                  {test.status === "fail" ? "Fail" : "Pass"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Run your code to see test results</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Footer with output */}
      {output && (
        <div className="border-t border-slate-700 bg-slate-800 p-4">
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-slate-300">Output:</span>
            <pre className="text-sm text-slate-400 whitespace-pre-wrap flex-1">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
