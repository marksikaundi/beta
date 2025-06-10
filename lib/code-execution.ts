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
            args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
          );
        },
        error: (...args: any[]) => {
          consoleOutput.push(
            '❌ Error: ' + args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
          );
        },
        warn: (...args: any[]) => {
          consoleOutput.push(
            '⚠️ Warning: ' + args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
          );
        }
      };

      const func = new Function('console', `
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
      `);

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
        consoleOutput: consoleOutput.join('\n')
      };
    };

    const { result, consoleOutput } = safeEval(code);
    
    const executionTime = Date.now() - startTime;
    const output = [
      '=== Program Output ===',
      consoleOutput,
      '',
      result !== undefined ? `=== Return Value ===\n${JSON.stringify(result, null, 2)}` : '',
      '',
      `=== Execution Time ===\n${executionTime}ms`
    ].filter(Boolean).join('\n');

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
  // Suppress unused parameter warnings - these are intentionally unused in demo mode
  void code;
  void testCases;
  const startTime = Date.now();

  // This is a simplified simulation
  // In production, you'd use a secure Python execution service
  const executionTime = Date.now() - startTime;

  return {
    output:
      "Python execution not implemented yet. This would run in a secure sandbox.",
    passed: false,
    executionTime,
    error: "Python execution service not available in demo mode",
  };
}

// Main execution function that routes to appropriate language executor
export async function executeCode(
  code: string,
  language: string,
  testCases?: TestCase[]
): Promise<ExecutionResult> {
  switch (language.toLowerCase()) {
    case "javascript":
    case "js":
      return executeJavaScript(code, testCases);
    case "python":
    case "py":
      return executePython(code, testCases);
    default:
      return {
        output: "",
        error: `Language ${language} not supported`,
        passed: false,
        executionTime: 0,
      };
  }
}
