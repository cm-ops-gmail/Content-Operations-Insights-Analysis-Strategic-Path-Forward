'use server';

/**
 * @fileOverview An AI-powered tool to analyze Q3 performance data (July-September) and provide insights on trends and significant changes.
 *
 * - analyzeQ3Performance - A function that handles the Q3 performance analysis process.
 * - AnalyzeQ3PerformanceInput - The input type for the analyzeQ3Performance function.
 * - AnalyzeQ3PerformanceOutput - The return type for the analyzeQ3Performance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeQ3PerformanceInputSchema = z.object({
  julyData: z.string().describe('Key performance data for July.'),
  augustData: z.string().describe('Key performance data for August.'),
  septemberData: z.string().describe('Key performance data for September.'),
  specificQuestions: z.string().optional().describe('Specific questions or areas to focus on in the analysis.'),
});
export type AnalyzeQ3PerformanceInput = z.infer<typeof AnalyzeQ3PerformanceInputSchema>;

const AnalyzeQ3PerformanceOutputSchema = z.object({
  summary: z.string().describe('A summary of the Q3 performance analysis, including key trends and significant changes.'),
  insights: z.string().describe('Detailed insights on performance drivers and areas for improvement.'),
  recommendations: z.string().optional().describe('Specific recommendations for optimizing performance based on the analysis.'),
});
export type AnalyzeQ3PerformanceOutput = z.infer<typeof AnalyzeQ3PerformanceOutputSchema>;

export async function analyzeQ3Performance(input: AnalyzeQ3PerformanceInput): Promise<AnalyzeQ3PerformanceOutput> {
  return analyzeQ3PerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeQ3PerformancePrompt',
  input: {schema: AnalyzeQ3PerformanceInputSchema},
  output: {schema: AnalyzeQ3PerformanceOutputSchema},
  prompt: `You are an expert performance analyst specializing in content operations.

You will analyze the provided performance data for July, August, and September to identify key trends, significant changes, and areas for improvement.

Consider the following data:

July Performance Data: {{{julyData}}}
August Performance Data: {{{augustData}}}
September Performance Data: {{{septemberData}}}

{{#if specificQuestions}}
Address the following specific questions or areas of focus: {{{specificQuestions}}}
{{/if}}

Provide a summary of the Q3 performance, detailed insights on performance drivers, and recommendations for optimizing performance.
`,
});

const analyzeQ3PerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeQ3PerformanceFlow',
    inputSchema: AnalyzeQ3PerformanceInputSchema,
    outputSchema: AnalyzeQ3PerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
