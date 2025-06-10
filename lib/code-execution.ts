// Code execution service for running user code in challenges
export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  passed: boolean;
  executionTime: number;
  testResults?: Array<{
    passed: boolean;
    input: string;
    expectedOutput: string;
    actual: string;
    description: string;
  }>;
}

// Simple JavaScript code execution simulation
// In a real implementation, this would be a secure sandbox service
export async function executeJavaScript(
  code: string,
  testCases?: TestCase[]
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    // Basic security check - prevent dangerous operations
    const dangerousPatterns = [
      /require\(/,
      /import\s+/,
      /fetch\(/,
      /XMLHttpRequest/,
      /localStorage/,
      /sessionStorage/,
      /document\./,
      /window\./,
      /global\./,
      /process\./,
      /fs\./,
      /child_process/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error("Unsafe operation detected");
      }
    }

    // Create a safe execution context
    const safeEval = (code: string) => {
      let consoleOutput: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          consoleOutput.push(
            args
              .map((arg) =>
                typeof arg === "object"
                  ? JSON.stringify(arg, null, 2)
                  : String(arg)
              )
              .join(" ")
          );
        },
        error: (...args: any[]) => {
          consoleOutput.push(
            "❌ Error: " +
              args
                .map((arg) =>
                  typeof arg === "object"
                    ? JSON.stringify(arg, null, 2)
                    : String(arg)
                )
                .join(" ")
          );
        },
        warn: (...args: any[]) => {
          consoleOutput.push(
            "⚠️ Warning: " +
              args
                .map((arg) =>
                  typeof arg === "object"
                    ? JSON.stringify(arg, null, 2)
                    : String(arg)
                )
                .join(" ")
          );
        },
      };

      const func = new Function(
        "console",
        `
        "use strict";
        ${code}
        
        // If there's a main function, call it
        if (typeof main === 'function') {
          return main();
        }
        
        // If there's a solution function, return it
        if (typeof solution === 'function') {
          return solution();
        }
      `
      );

      let result;
      try {
        result = func(mockConsole);
      } catch (error: unknown) {
        if (error instanceof Error) {
          consoleOutput.push(`❌ Runtime Error: ${error.message}`);
        } else {
          consoleOutput.push(`❌ Runtime Error: ${String(error)}`);
        }
        throw error;
      }

      return {
        result,
        consoleOutput: consoleOutput.join("\n"),
      };
    };

    const { result, consoleOutput } = safeEval(code);

    const executionTime = Date.now() - startTime;
    const output = [
      "=== Program Output ===",
      consoleOutput,
      "",
      result !== undefined
        ? `=== Return Value ===\n${JSON.stringify(result, null, 2)}`
        : "",
      "",
      `=== Execution Time ===\n${executionTime}ms`,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      output,
      passed: true,
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    return {
      output: "",
      error: error instanceof Error ? error.message : String(error),
      passed: false,
      executionTime,
    };
  }
}

// Python code execution simulation with advanced features
export async function executePython(
  code: string,
  testCases?: TestCase[]
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    // Parse and simulate Python code execution
    const simulatePython = (code: string) => {
      let output: string[] = [];
      let variables: Record<string, any> = {};

      // Simple Python expression evaluator
      const evalPythonExpr = (expr: string): any => {
        // Handle basic arithmetic
        if (/^[\d\s+\-*\/().,]+$/.test(expr)) {
          return eval(expr);
        }
        // Handle string literals
        if (/^["'].*["']$/.test(expr)) {
          return expr.slice(1, -1);
        }
        // Handle list literals
        if (expr.startsWith("[") && expr.endsWith("]")) {
          try {
            return JSON.parse(expr.replace(/'/g, '"'));
          } catch {
            return `<list: ${expr}>`;
          }
        }
        // Handle variable references
        if (variables[expr] !== undefined) {
          return variables[expr];
        }
        return `<${expr}>`;
      };

      // Parse lines and simulate execution
      const lines = code.split("\n");
      for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith("#")) {
          continue;
        }

        // Handle print statements
        if (trimmedLine.startsWith("print(")) {
          const args = trimmedLine
            .slice(6, -1)
            .split(",")
            .map((arg) => evalPythonExpr(arg.trim()));
          output.push(args.join(" "));
          continue;
        }

        // Handle basic variable assignment
        const assignMatch = trimmedLine.match(/^(\w+)\s*=\s*(.+)$/);
        if (assignMatch) {
          const [_, varName, value] = assignMatch;
          variables[varName] = evalPythonExpr(value);
          continue;
        }

        // Handle function definitions
        if (trimmedLine.startsWith("def ")) {
          output.push(
            `Defined function: ${trimmedLine.slice(4).split("(")[0]}`
          );
          continue;
        }

        // Handle for loops (basic simulation)
        if (trimmedLine.startsWith("for ")) {
          output.push(`Simulated loop: ${trimmedLine}`);
          continue;
        }
      }

      return output.join("\n");
    };

    const simulatedOutput = simulatePython(code);
    const executionTime = Date.now() - startTime;

    return {
      output: [
        "=== Python Simulation ===",
        simulatedOutput || "No output",
        "",
        `=== Execution Time ===\n${executionTime}ms`,
      ]
        .filter(Boolean)
        .join("\n"),
      passed: true,
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    return {
      output: "",
      error: error instanceof Error ? error.message : String(error),
      passed: false,
      executionTime,
    };
  }
}

// Main execution function that routes to appropriate language executor
import { runInPythonWorker } from "./python-worker";

import { executeGo } from "./go-execution";

export async function executeCode(
  code: string,
  language: string,
  testCases?: TestCase[]
): Promise<ExecutionResult> {
  switch (language.toLowerCase()) {
    case "javascript":
    case "typescript":
    case "js":
    case "ts":
      return executeJavaScript(code, testCases);
    case "python":
    case "py":
      return executePython(code, testCases);
    case "go":
      return executeGo(code, testCases);
    default:
      return {
        output: "",
        error: `Language ${language} not supported`,
        passed: false,
        executionTime: 0,
      };
  }
}
