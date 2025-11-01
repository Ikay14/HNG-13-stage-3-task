import { Mastra } from "@mastra/core/mastra";
import { palindromeAgent } from "./agent";

export const mastra = new Mastra({
  agents: { palindromeAgent }
});