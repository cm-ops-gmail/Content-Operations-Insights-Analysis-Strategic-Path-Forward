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
  summary: z.string().describe('A summary of the performance comparison, including key trends and significant changes.'),
  insights: z.string().describe('Detailed insights on performance drivers, causality, and areas for improvement.'),
  recommendations: z.string().optional().describe('Specific, actionable recommendations for optimizing performance based on the analysis.'),
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

You will analyze and compare the provided performance data for two months to identify key trends, significant changes, and areas for improvement.

The user has filtered the data by:
{{#if teamAndProduct}}
- Team [Product]: {{{teamAndProduct}}}
{{/if}}
{{#if materialVertical}}
- Material Vertical: {{{materialVertical}}}
{{/if}}

Compare the following data:

Start Month ({{{startMonthData.month}}}):
- File Count: {{{startMonthData.fileCount}}}
- Budget: {{{startMonthData.budget}}}
- Payment: {{{startMonthData.payment}}}

End Month ({{{endMonthData.month}}}):
- File Count: {{{endMonthData.fileCount}}}
- Budget: {{{endMonthData.budget}}}
- Payment: {{{endMonthData.payment}}}

Based on the comparison, provide:
1.  **Summary**: A brief summary of the changes in file count between the two months.
2.  **Insights**: Analyze the data to provide possible causes for any increase or decrease. Consider factors like team performance, operational changes, or new initiatives that might have influenced the numbers.
3.  **Recommendations**: Offer actionable advice based on your analysis. Suggest strategies to improve performance or sustain growth.
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
