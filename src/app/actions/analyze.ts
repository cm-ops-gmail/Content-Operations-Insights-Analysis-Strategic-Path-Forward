'use server';

import { 
  analyzeQ3Performance, 
  type AnalyzeQ3PerformanceInput, 
  type AnalyzeQ3PerformanceOutput 
} from '@/ai/flows/analyze-q3-performance';

export async function analyzePerformanceAction(input: AnalyzeQ3PerformanceInput): Promise<AnalyzeQ3PerformanceOutput> {
  try {
    const result = await analyzeQ3Performance(input);
    return result;
  } catch (error) {
    console.error('Error in analyzePerformanceAction:', error);
    throw new Error('Failed to analyze performance data.');
  }
}
