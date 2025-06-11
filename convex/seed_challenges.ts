import { api } from "./_generated/api";
import { ConvexError, action } from "./_generated/server";

export const seed = action({
  handler: async (ctx) => {
    // Note: In a real app, you would need proper authentication and authorization
    // for these operations. This script is for development/demo purposes only.

    // Sample challenges
    const challenges = [
      {
        title: "Two Sum",
        difficulty: "Easy" as const,
        description:
          "Find two numbers in an array that add up to a target sum.",
        problemStatement: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
          },
        ],
        testCases: [
          {
            input: "[2,7,11,15], 9",
            expectedOutput: "[0,1]",
            description: "First example case",
          },
          {
            input: "[3,2,4], 6",
            expectedOutput: "[1,2]",
            description: "Second example case",
          },
          {
            input: "[3,3], 6",
            expectedOutput: "[0,1]",
            description: "Array with duplicate elements",
          },
        ],
        starterCode: {
          javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your code here
}

// Example usage:
// console.log(twoSum([2,7,11,15], 9)); // Should return [0,1]`,
          python: `def two_sum(nums, target):
    # Write your code here
    pass

# Example usage:
# print(two_sum([2,7,11,15], 9)) # Should return [0,1]`,
        },
        hints: [
          "The brute force approach would be to check every pair of numbers, but can you do better?",
          "Try using a hash map to keep track of elements you've seen and their indices.",
          "For each number, check if the complement (target - current number) exists in the hash map.",
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists.",
        ],
        tags: ["Array", "Hash Table"],
        points: 100,
        timeLimit: 30,
        isPublished: true,
      },
      {
        title: "Reverse String",
        difficulty: "Easy" as const,
        description: "Write a function that reverses a string.",
        problemStatement: `Write a function that reverses a string. The input string is given as an array of characters.

Do not allocate extra space for another array. You must do this by modifying the input array in-place with O(1) extra memory.`,
        examples: [
          {
            input: '["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
            explanation: "Reverse the characters in the array.",
          },
          {
            input: '["H","a","n","n","a","h"]',
            output: '["h","a","n","n","a","H"]',
            explanation: "Reverse the characters in the array.",
          },
        ],
        testCases: [
          {
            input: '["h","e","l","l","o"]',
            expectedOutput: '["o","l","l","e","h"]',
            description: "First example case",
          },
          {
            input: '["H","a","n","n","a","h"]',
            expectedOutput: '["h","a","n","n","a","H"]',
            description: "Second example case",
          },
          {
            input: '["a"]',
            expectedOutput: '["a"]',
            description: "Single character",
          },
        ],
        starterCode: {
          javascript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
  // Write your code here
}

// Example usage:
// const str = ["h","e","l","l","o"];
// reverseString(str);
// console.log(str); // Should be ["o","l","l","e","h"]`,
          python: `def reverse_string(s):
    """
    Do not return anything, modify s in-place instead.
    """
    # Write your code here
    pass

# Example usage:
# s = ["h","e","l","l","o"]
# reverse_string(s)
# print(s) # Should be ["o","l","l","e","h"]`,
        },
        hints: [
          "Try using the two-pointer technique.",
          "Initialize two pointers, one at the start and one at the end of the array.",
          "Swap the characters at the two pointers, then move the pointers toward each other.",
        ],
        constraints: [
          "1 <= s.length <= 10^5",
          "s[i] is a printable ascii character.",
        ],
        tags: ["String", "Two Pointers"],
        points: 80,
        timeLimit: 20,
        isPublished: true,
      },
      {
        title: "Valid Palindrome",
        difficulty: "Easy" as const,
        description:
          "Determine if a string is a palindrome, considering only alphanumeric characters and ignoring case.",
        problemStatement: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
        examples: [
          {
            input: '"A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
          },
          {
            input: '"race a car"',
            output: "false",
            explanation: '"raceacar" is not a palindrome.',
          },
        ],
        testCases: [
          {
            input: '"A man, a plan, a canal: Panama"',
            expectedOutput: "true",
            description: "First example case",
          },
          {
            input: '"race a car"',
            expectedOutput: "false",
            description: "Second example case",
          },
          {
            input: '" "',
            expectedOutput: "true",
            description: "Empty string is considered a palindrome",
          },
        ],
        starterCode: {
          javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Write your code here
}

// Example usage:
// console.log(isPalindrome("A man, a plan, a canal: Panama")); // Should return true`,
          python: `def is_palindrome(s):
    # Write your code here
    pass

# Example usage:
# print(is_palindrome("A man, a plan, a canal: Panama")) # Should return True`,
        },
        hints: [
          "First, convert the string to lowercase and remove non-alphanumeric characters.",
          "You can use regular expressions or character-by-character processing to clean the string.",
          "Once you have a clean string, check if it's equal to its reverse.",
        ],
        constraints: [
          "1 <= s.length <= 2 * 10^5",
          "s consists only of printable ASCII characters.",
        ],
        tags: ["String", "Two Pointers"],
        points: 90,
        timeLimit: 25,
        isPublished: true,
      },
    ];

    try {
      // Check if we already have challenges
      const existingChallenges = await ctx.runQuery(api.labs.list);

      if (existingChallenges.length > 0) {
        console.log(
          `Database already has ${existingChallenges.length} challenges. Skipping seed.`
        );
        return {
          success: true,
          message: "Challenges already exist, skipping seed",
        };
      }

      // Insert challenges
      for (const challenge of challenges) {
        const now = new Date().toISOString();
        await ctx.runMutation(api.labs_admin.createLab, {
          ...challenge,
          createdAt: now,
          updatedAt: now,
        });
      }

      return {
        success: true,
        message: `Created ${challenges.length} sample challenges`,
      };
    } catch (error) {
      console.error("Error seeding challenges:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
