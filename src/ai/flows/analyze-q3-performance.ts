
'use server';

/**
 * @fileOverview An AI-powered tool to analyze performance data between two months and provide insights on trends and significant changes.
 *
 * - analyzeQ3Performance - A function that handles the performance analysis process.
 * - AnalyzeQ3PerformanceInput - The input type for the analyzeQ3Performance function.
 * - AnalyzeQ3PerformanceOutput - The return type for the analyzeQ3Performance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MonthlyPerformanceDataSchema = z.object({
  month: z.string(),
  fileCount: z.string(),
  budget: z.string(),
  payment: z.string(),
});

const AnalyzeQ3PerformanceInputSchema = z.object({
  startMonthData: MonthlyPerformanceDataSchema.describe('Performance data for the start month.'),
  endMonthData: MonthlyPerformanceDataSchema.describe('Performance data for the end month.'),
  teamAndProduct: z.string().optional().describe('The selected Team [Product] filter.'),
  materialVertical: z.string().optional().describe('The selected Material Vertical filter.'),
});
export type AnalyzeQ3PerformanceInput = z.infer<typeof AnalyzeQ3PerformanceInputSchema>;

const AnalyzeQ3PerformanceOutputSchema = z.object({
  summary: z.string().describe('A brief, one-sentence summary of the file count change.'),
  insights: z.string().describe('2-3 bullet points identifying the most likely reasons for the change.'),
  recommendations: z.string().optional().describe('1-2 actionable recommendations in bullet points.'),
});
export type AnalyzeQ3PerformanceOutput = z.infer<typeof AnalyzeQ3PerformanceOutputSchema>;

export async function analyzeQ3Performance(input: AnalyzeQ3PerformanceInput): Promise<AnalyzeQ3PerformanceOutput> {
  return analyzeQ3PerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeQ3PerformancePrompt',
  input: {schema: AnalyzeQ3PerformanceInputSchema},
  output: {schema: AnalyzeQ3PerformanceOutputSchema},
  prompt: `You are an expert performance analyst. Compare the file count between two months and provide a concise, 3-4 point summary.

User has filtered by:
- Team [Product]: {{{teamAndProduct}}}
- Material Vertical: {{{materialVertical}}}

Data:
- {{{startMonthData.month}}}: {{{startMonthData.fileCount}}} files | Budget: {{{startMonthData.budget}}} | Payment: {{{startMonthData.payment}}}
- {{{endMonthData.month}}}: {{{endMonthData.fileCount}}} files | Budget: {{{endMonthData.budget}}} | Payment: {{{endMonthData.payment}}}

Provide the following, keeping each section very brief:
1.  **Summary**: A single sentence stating if file count increased, decreased, or stayed the same, and by how much.
2.  **Insights**: 2-3 bullet points on the *most likely* causes. Be specific. (e.g., "Shift in focus to 'Daily Quiz' material, which has a higher volume," or "Reduced output in 'Lecture Slides' impacted the total.")
3.  **Recommendations**: 1-2 actionable bullet points. (e.g., "Allocate more resources to 'Daily Quiz' to sustain growth," or "Investigate 'Lecture Slide' workflow for bottlenecks.")
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
