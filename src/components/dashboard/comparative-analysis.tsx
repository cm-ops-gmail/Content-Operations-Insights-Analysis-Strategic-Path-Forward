"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzePerformanceAction } from "@/app/actions/analyze";
import type { AnalyzeQ3PerformanceOutput } from "@/ai/flows/analyze-q3-performance";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  julyData: z.string().min(10, "Please provide more detailed data for July."),
  augustData: z.string().min(10, "Please provide more detailed data for August."),
  septemberData: z.string().min(10, "Please provide more detailed data for September."),
  specificQuestions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ComparativeAnalysis() {
  const [result, setResult] = useState<AnalyzeQ3PerformanceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      julyData: "",
      augustData: "",
      septemberData: "",
      specificQuestions: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await analyzePerformanceAction(data);
      setResult(response);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing the data. Please try again.",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-accent" />
          <CardTitle>AI Comparative Analysis</CardTitle>
        </div>
        <CardDescription>
          Enter performance data to get AI-powered insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="julyData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>July Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Views: 150k, Engagement: 4.2%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="augustData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>August Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Views: 180k, Engagement: 4.5%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="septemberData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>September Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Views: 170k, Engagement: 4.3%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specificQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Questions (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Why did engagement drop in September?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Analyze Performance
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-4 space-y-4 animate-in fade-in-50 duration-500">
            <Separator />
            <h3 className="text-lg font-semibold font-headline">Analysis Results</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{result.insights}</p>
              </CardContent>
            </Card>
            {result.recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result.recommendations}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
