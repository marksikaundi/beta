"use client";

import { useState } from "react";
import Split from "@uiw/react-split";
import { executeCode } from "@/lib/code-execution";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeEditor from "@/components/playground/code-editor";
import OutputPanel from "@/components/playground/output-panel";

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
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))`,
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

export default function Playground() {
  const [language, setLanguage] = useState<string>("typescript");
  const [code, setCode] = useState(
    defaultCode[language as keyof typeof defaultCode]
  );
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    try {
      const result = await executeCode(code, language);
      setOutput(result.output || result.error || "No output");
    } catch (error: any) {
      setOutput(`Error: ${error?.message || "An unknown error occurred"}`);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage as keyof typeof defaultCode]);
    setOutput("");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="go">Go</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRunCode}>Run Code</Button>
        </div>
      </div>

      <Split 
        className="flex-grow" 
        style={{ height: "calc(100vh - 72px)" }}
        lineBar={true}
      >
        <div className="h-full w-3/5 overflow-hidden">
          <CodeEditor
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
          />
        </div>
        <div className="h-full w-2/5 overflow-hidden border-l border-gray-200 dark:border-gray-800">
          <OutputPanel output={output} />
        </div>
      </Split>
    </div>
  );
}
