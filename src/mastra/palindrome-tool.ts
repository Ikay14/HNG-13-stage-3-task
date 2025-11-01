import { z } from "zod";
import { createTool } from "@mastra/core/tools";

export const check_palindrome = createTool({
  id: "check_palindrome",
  description: "Check whether a given text is a palindrome",
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({isPalindrome: z.boolean(),
    cleaned: z.string(),
  }),
  execute: async ({ context }) => {
    const cleaned = context.text.toLowerCase().replace(/[^a-z0-9]/g, "")
    const isPal = cleaned === cleaned.split("").reverse().join("")
    return {
      isPalindrome: isPal,
      cleaned,
    }
  },
})

