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
    expected: string;
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
      const func = new Function(`
        "use strict";
        ${code}
        
        // If there's a main function, call it
        if (typeof main === 'function') {
          return main;
        }
        
        // If there's a solution function, return it
        if (typeof solution === 'function') {
          return solution;
        }
        
        // Otherwise return the last expression
        return undefined;
      `);
      
      return func();
    };

    const userFunction = safeEval(code);
    let output = "";
    let testResults: ExecutionResult['testResults'] = [];

    if (testCases && testCases.length > 0 && typeof userFunction === 'function') {
      // Run test cases
      for (const testCase of testCases) {
        try {
          const input = JSON.parse(testCase.input);
          const expected = testCase.expectedOutput;
          
          let actual;
          if (Array.isArray(input)) {
            actual = userFunction(...input);
          } else {
            actual = userFunction(input);
          }
          
          const actualStr = typeof actual === 'object' ? JSON.stringify(actual) : String(actual);
          const passed = actualStr === expected;
          
          testResults.push({
            passed,
            input: testCase.input,
            expected,
            actual: actualStr,
            description: testCase.description,
          });
          
          output += `Test: ${testCase.description}\n`;
          output += `Input: ${testCase.input}\n`;
          output += `Expected: ${expected}\n`;
          output += `Actual: ${actualStr}\n`;
          output += `Result: ${passed ? '✅ PASS' : '❌ FAIL'}\n\n`;
        } catch (error) {
          testResults.push({
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: `Error: ${error}`,
            description: testCase.description,
          });
          
          output += `Test: ${testCase.description}\n`;
          output += `Error: ${error}\n\n`;
        }
      }
    } else {
      // Simple execution without test cases
      if (typeof userFunction === 'function') {
        const result = userFunction();
        output = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
      } else {
        // Try to execute the code directly
        const func = new Function(`
          "use strict";
          let console = {
            log: function(...args) {
              return args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ');
            }
          };
          
          ${code}
        `);
        
        const result = func();
        output = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result || '');
      }
    }

    const executionTime = Date.now() - startTime;
    const allTestsPassed = testResults.length > 0 ? testResults.every(t => t.passed) : true;

    return {
      output: output || "Code executed successfully",
      passed: allTestsPassed,
      executionTime,
      testResults: testResults.length > 0 ? testResults : undefined,
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
  
  // This is a simplified simulation
  // In production, you'd use a secure Python execution service
  const executionTime = Date.now() - startTime;
  
  return {
    output: "Python execution not implemented yet. This would run in a secure sandbox.",
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
    case 'javascript':
    case 'js':
      return executeJavaScript(code, testCases);
    case 'python':
    case 'py':
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
