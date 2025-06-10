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

// Python code execution simulation
export async function executePython(
  code: string,
  testCases?: TestCase[]
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    // Format the code nicely for display
    const formattedOutput = [
      "=== Python Code ===",
      code,
      "",
      "=== Output ===",
      "Code execution would happen on a backend server.",
      "For now, this is a simulation of Python execution.",
      "",
      "Example output:",
    ].join('\n');

    // Extract print statements for simulation
    const printMatches = code.match(/print\((.*?)\)/g) || [];
    const prints = printMatches.map(match => {
      try {
        // Basic evaluation of print arguments
        const arg = match.slice(6, -1).trim();
        if (arg.startsWith('"') || arg.startsWith("'")) {
          return arg.slice(1, -1);
        }
        return `<simulated: ${arg}>`;
      } catch {
        return '<could not evaluate>';
      }
    });

    const executionTime = Date.now() - startTime;
    return {
      output: formattedOutput + prints.map(p => `> ${p}`).join('\n'),
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
import { runInPythonWorker } from './python-worker';

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
      return {
        output: "Go execution is coming soon! For now, try JavaScript, TypeScript, or Python.",
        error: "Go execution not yet implemented",
        passed: false,
        executionTime: 0,
      };
    default:
      return {
        output: "",
        error: `Language ${language} not supported`,
        passed: false,
        executionTime: 0,
      };
  }
}
