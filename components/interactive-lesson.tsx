"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeSubmissionResult {
  success: boolean;
  output: string;
  error?: string;
}

interface InteractiveLessonProps {
  title: string;
  description: string;
  initialCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  onComplete: () => void;
}

export function InteractiveLesson({
  title,
  description,
  initialCode,
  testCases,
  onComplete,
}: InteractiveLessonProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<CodeSubmissionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const evaluateCode = async () => {
    setIsRunning(true);
    try {
      // TODO: Add actual code evaluation logic here
      const mockResult: CodeSubmissionResult = {
        success: true,
        output: "Test cases passed successfully!",
      };
      setOutput(mockResult);
      if (mockResult.success) {
        onComplete();
      }
    } catch (error) {
      setOutput({
        success: false,
        output: "",
        error: "Failed to evaluate code",
      });
    }
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-medium mb-3">Code Editor</h3>
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[300px] font-mono text-sm p-4 bg-gray-50 rounded-md"
              spellCheck={false}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={evaluateCode}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                "Running..."
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Code
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-3">Output</h3>
          <ScrollArea className="h-[300px] rounded-md bg-gray-50 p-4">
            {output ? (
              <div className="space-y-4">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded",
                    output.success
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  )}
                >
                  {output.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="font-medium">
                    {output.success ? "Success!" : "Error"}
                  </span>
                </div>
                {output.success ? (
                  <pre className="text-sm">{output.output}</pre>
                ) : (
                  <pre className="text-sm text-red-600">{output.error}</pre>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Run your code to see the output
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
