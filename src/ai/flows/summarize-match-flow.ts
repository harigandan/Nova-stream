'use server';
/**
 * @fileOverview An AI agent for summarizing sports matches.
 *
 * - summarizeMatch - A function that handles the match summarization process.
 * - SummarizeMatchInput - The input type for the summarizeMatch function.
 * - SummarizeMatchOutput - The return type for the summarizeMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMatchInputSchema = z.object({
  title: z.string().describe("The title of the match, e.g., 'Man U vs. Chelsea'."),
  scorecard: z.string().describe("A JSON string representing the scorecard data, including teams, scores, batting, and bowling details."),
  commentary: z.string().describe("A JSON string representing the live commentary data, with timestamps and descriptions of events."),
});
export type SummarizeMatchInput = z.infer<typeof SummarizeMatchInputSchema>;

const SummarizeMatchOutputSchema = z.object({
  summary: z.string().describe("A concise and engaging summary of the match, highlighting key moments, top performers, and the final result. Should be 2-3 paragraphs long."),
});
export type SummarizeMatchOutput = z.infer<typeof SummarizeMatchOutputSchema>;


export async function summarizeMatch(input: SummarizeMatchInput): Promise<SummarizeMatchOutput> {
  return summarizeMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMatchPrompt',
  input: {schema: SummarizeMatchInputSchema},
  output: {schema: SummarizeMatchOutputSchema},
  prompt: `You are a world-class sports journalist. Your task is to write a compelling summary of a sports match based on the data provided.

Analyze the following information for the match titled "{{title}}":
- The scorecard data to understand the scores, key player statistics (runs, wickets, etc.).
- The commentary to identify pivotal moments, turning points, and exciting plays.

Based on your analysis, generate a summary that captures the narrative of the game. Mention the standout players, the final result, and what made the match exciting. The tone should be engaging and informative, as if for a news article.

Match Data:
Scorecard:
{{{scorecard}}}

Commentary:
{{{commentary}}}
`,
});

const summarizeMatchFlow = ai.defineFlow(
  {
    name: 'summarizeMatchFlow',
    inputSchema: SummarizeMatchInputSchema,
    outputSchema: SummarizeMatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
