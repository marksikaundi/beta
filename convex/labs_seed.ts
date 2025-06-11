import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Sample challenges for seeding the database
const sampleChallenges = [
  {
    title: "Array Sum",
    difficulty: "Easy",
    description: "Calculate the sum of all elements in an array",
    problemStatement:
      "Write a function that calculates the sum of all numbers in an array. The function should return the total sum.",
    examples: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: "15",
        explanation: "1 + 2 + 3 + 4 + 5 = 15",
      },
      {
        input: "[-1, -2, 10]",
        output: "7",
        explanation: "-1 + (-2) + 10 = 7",
      },
    ],
    testCases: [
      {
        input: "[1, 2, 3, 4, 5]",
        expectedOutput: "15",
        description: "Positive numbers",
      },
      {
        input: "[-1, -2, 10]",
        expectedOutput: "7",
        description: "Mixed positive and negative numbers",
      },
      {
        input: "[]",
        expectedOutput: "0",
        description: "Empty array",
      },
    ],
    starterCode: {
      javascript: `/**
 * Calculate the sum of an array of numbers
 * @param {number[]} arr - The input array of numbers
 * @return {number} - The sum of all numbers
 */
function arraySum(arr) {
  // Your code here
}

// Example usage:
// arraySum([1, 2, 3, 4, 5]); // Should return 15`,
      python: `def array_sum(arr):
    """
    Calculate the sum of an array of numbers
    Args:
        arr: A list of numbers
    Returns:
        The sum of all numbers in the array
    """
    # Your code here
    pass

# Example usage:
# array_sum([1, 2, 3, 4, 5]) # Should return 15`,
    },
    hints: [
      "Consider using a loop to iterate through each element",
      "You can initialize a sum variable to 0 and add each element to it",
      "For an empty array, the sum should be 0",
    ],
    constraints: [
      "The array can contain positive and negative integers",
      "The array can be empty",
      "The length of the array will not exceed 10,000",
    ],
    tags: ["Array", "Math", "Loop"],
    category: "Arrays",
    order: 1,
    points: 50,
    timeLimit: 300,
    isPublished: true,
  },
  {
    title: "Palindrome Check",
    difficulty: "Easy",
    description: "Determine if a string is a palindrome",
    problemStatement:
      "Write a function that checks if a given string is a palindrome. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward (ignoring spaces, punctuation, and capitalization).",
    examples: [
      {
        input: '"racecar"',
        output: "true",
        explanation: '"racecar" reads the same forward and backward',
      },
      {
        input: '"hello"',
        output: "false",
        explanation: '"hello" does not read the same backward',
      },
    ],
    testCases: [
      {
        input: '"racecar"',
        expectedOutput: "true",
        description: "Simple palindrome",
      },
      {
        input: '"A man, a plan, a canal: Panama"',
        expectedOutput: "true",
        description: "Palindrome with spaces and punctuation",
      },
      {
        input: '"hello"',
        expectedOutput: "false",
        description: "Not a palindrome",
      },
    ],
    starterCode: {
      javascript: `/**
 * Check if a string is a palindrome
 * @param {string} str - The input string
 * @return {boolean} - True if the string is a palindrome, false otherwise
 */
function isPalindrome(str) {
  // Your code here
}

// Example usage:
// isPalindrome("racecar"); // Should return true`,
      python: `def is_palindrome(str):
    """
    Check if a string is a palindrome
    Args:
        str: The input string
    Returns:
        True if the string is a palindrome, False otherwise
    """
    # Your code here
    pass

# Example usage:
# is_palindrome("racecar") # Should return True`,
    },
    hints: [
      "Consider converting the string to lowercase first",
      "Remove all non-alphanumeric characters",
      "You can compare the string with its reverse",
    ],
    constraints: [
      "The input string may contain uppercase and lowercase letters",
      "Ignore all non-alphanumeric characters when determining if it's a palindrome",
      "The length of the string will not exceed 10,000 characters",
    ],
    tags: ["String", "Two Pointers"],
    category: "Strings",
    order: 1,
    points: 50,
    timeLimit: 300,
    isPublished: true,
  },
  {
    title: "Find Maximum Value",
    difficulty: "Easy",
    description: "Find the maximum value in an array",
    problemStatement:
      "Write a function that finds the maximum value in an array of numbers. If the array is empty, return null or None (depending on the language).",
    examples: [
      {
        input: "[3, 7, 2, 9, 1]",
        output: "9",
        explanation: "9 is the largest number in the array",
      },
      {
        input: "[-5, -10, -2, -1]",
        output: "-1",
        explanation: "-1 is the largest number among negative numbers",
      },
    ],
    testCases: [
      {
        input: "[3, 7, 2, 9, 1]",
        expectedOutput: "9",
        description: "Positive numbers",
      },
      {
        input: "[-5, -10, -2, -1]",
        expectedOutput: "-1",
        description: "Negative numbers",
      },
      {
        input: "[]",
        expectedOutput: "null",
        description: "Empty array",
      },
    ],
    starterCode: {
      javascript: `/**
 * Find the maximum value in an array
 * @param {number[]} arr - The input array of numbers
 * @return {number|null} - The maximum value, or null if the array is empty
 */
function findMax(arr) {
  // Your code here
}

// Example usage:
// findMax([3, 7, 2, 9, 1]); // Should return 9`,
      python: `def find_max(arr):
    """
    Find the maximum value in an array
    Args:
        arr: A list of numbers
    Returns:
        The maximum value, or None if the array is empty
    """
    # Your code here
    pass

# Example usage:
# find_max([3, 7, 2, 9, 1]) # Should return 9`,
    },
    hints: [
      "Consider using a variable to keep track of the maximum value seen so far",
      "Initialize this variable with the first element of the array, or a very small number",
      "Check for empty array as a special case",
    ],
    constraints: [
      "The array can contain positive and negative integers",
      "The array can be empty",
      "The length of the array will not exceed 10,000",
    ],
    tags: ["Array", "Math"],
    category: "Arrays",
    order: 2,
    points: 40,
    timeLimit: 300,
    isPublished: true,
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    description: "Reverse a string",
    problemStatement:
      "Write a function that reverses a string. The input string is given as an array of characters.",
    examples: [
      {
        input: '"hello"',
        output: '"olleh"',
        explanation: 'The reversed form of "hello" is "olleh"',
      },
      {
        input: '"coding"',
        output: '"gnidoc"',
        explanation: 'The reversed form of "coding" is "gnidoc"',
      },
    ],
    testCases: [
      {
        input: '"hello"',
        expectedOutput: '"olleh"',
        description: "Basic string",
      },
      {
        input: '"programming"',
        expectedOutput: '"gnimmargorp"',
        description: "Longer string",
      },
      {
        input: '"a"',
        expectedOutput: '"a"',
        description: "Single character",
      },
      {
        input: '""',
        expectedOutput: '""',
        description: "Empty string",
      },
    ],
    starterCode: {
      javascript: `/**
 * Reverse a string
 * @param {string} str - The input string
 * @return {string} - The reversed string
 */
function reverseString(str) {
  // Your code here
}

// Example usage:
// reverseString("hello"); // Should return "olleh"`,
      python: `def reverse_string(str):
    """
    Reverse a string
    Args:
        str: The input string
    Returns:
        The reversed string
    """
    # Your code here
    pass

# Example usage:
# reverse_string("hello") # Should return "olleh"`,
    },
    hints: [
      "You can convert the string to an array, reverse it, and join it back",
      "Alternatively, you can build the reversed string character by character",
      "Think about using two-pointers approach for an in-place solution",
    ],
    constraints: [
      "The input string will only contain ASCII characters",
      "The length of the string will not exceed 10,000 characters",
    ],
    tags: ["String", "Two Pointers"],
    category: "Strings",
    order: 2,
    points: 40,
    timeLimit: 300,
    isPublished: true,
  },
  {
    title: "Fizz Buzz",
    difficulty: "Easy",
    description: "Implement the classic FizzBuzz problem",
    problemStatement:
      "Write a function that returns an array of strings for numbers from 1 to n, where for multiples of 3 it returns 'Fizz', for multiples of 5 it returns 'Buzz', and for multiples of both 3 and 5 it returns 'FizzBuzz'. For all other numbers, it should return the number as a string.",
    examples: [
      {
        input: "15",
        output:
          '["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]',
        explanation:
          "Numbers divisible by 3 are replaced with 'Fizz', numbers divisible by 5 are replaced with 'Buzz', and numbers divisible by both 3 and 5 are replaced with 'FizzBuzz'",
      },
    ],
    testCases: [
      {
        input: "15",
        expectedOutput:
          '["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]',
        description: "Standard test case",
      },
      {
        input: "5",
        expectedOutput: '["1", "2", "Fizz", "4", "Buzz"]',
        description: "Small input",
      },
    ],
    starterCode: {
      javascript: `/**
 * Implement the FizzBuzz algorithm
 * @param {number} n - The upper limit
 * @return {string[]} - Array of strings based on FizzBuzz rules
 */
function fizzBuzz(n) {
  // Your code here
}

// Example usage:
// fizzBuzz(15); // Should return ["1", "2", "Fizz", "4", "Buzz", ...]`,
      python: `def fizz_buzz(n):
    """
    Implement the FizzBuzz algorithm
    Args:
        n: The upper limit
    Returns:
        Array of strings based on FizzBuzz rules
    """
    # Your code here
    pass

# Example usage:
# fizz_buzz(15) # Should return ["1", "2", "Fizz", "4", "Buzz", ...]`,
    },
    hints: [
      "Use the modulo operator (%) to check if a number is divisible by another",
      "Check for divisibility by both 3 and 5 first, then check for each individually",
      "Consider using a loop to iterate from 1 to n",
    ],
    constraints: [
      "1 <= n <= 10,000",
      "Return the numbers as strings, not integers",
    ],
    tags: ["Array", "Math", "String"],
    category: "Algorithms",
    order: 1,
    points: 30,
    timeLimit: 300,
    isPublished: true,
  },
];

// Mutation to seed the database with sample challenges
export const seedChallenges = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false, message: "Not authenticated" };
    }

    try {
      // Check if we already have challenges to avoid duplicates
      const existingChallenges = await ctx.db.query("labs").collect();
      if (existingChallenges.length > 0) {
        return {
          success: true,
          message: `Database already has ${existingChallenges.length} challenges. No new challenges were added to avoid duplicates.`,
        };
      }

      // Add all sample challenges
      const now = new Date().toISOString();
      const results = [];

      for (const challenge of sampleChallenges) {
        const labId = await ctx.db.insert("labs", {
          ...challenge,
          createdAt: now,
          updatedAt: now,
          createdBy: identity.tokenIdentifier,
        });
        results.push(labId);
      }

      return {
        success: true,
        message: `Successfully added ${results.length} sample challenges to the database.`,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  },
});
