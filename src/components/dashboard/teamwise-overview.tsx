
"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import { Calendar as CalendarIcon, Wand2 } from "lucide-react"
import { format } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const teamMap: Record<string, string> = {
  "Study Material Design": "SMD Analysis [Monthwise]",
  "Content Quality Assurance": "QAC Analysis [Monthwise]",
  "Content Management": "CM Analysis [Monthwise]",
  "Class Operations": "Class_OPS Analysis [Monthwise]",
};

const teams = Object.keys(teamMap);

const months = ["July", "August", "September"];

const chartConfig = {
  month1: { label: "Month 1", color: "hsl(var(--chart-1))" },
  month2: { label: "Month 2", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const Scoreboard = ({ title, value }: { title: string; value: string }) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background/20 border border-cyan-500/30">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const FilterDropdowns = ({ teamAndProductOptions, materialVerticalOptions, filters, setFilters }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
    <Select value={filters.month} onValueChange={(value) => setFilters((prev: any) => ({ ...prev, month: value }))}>
      <SelectTrigger className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent className="border-cyan-500/80">
        {months.map((month) => (
          <SelectItem key={month} value={month}>
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select value={filters.teamAndProduct} onValueChange={(value) => setFilters((prev: any) => ({ ...prev, teamAndProduct: value }))}>
      <SelectTrigger className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
        <SelectValue placeholder="Team [Product]" />
      </SelectTrigger>
      <SelectContent className="border-cyan-500/80">
        {teamAndProductOptions.map((category: string) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select value={filters.materialVertical} onValueChange={(value) => setFilters((prev: any) => ({ ...prev, materialVertical: value }))}>
      <SelectTrigger className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
        <SelectValue placeholder="Material Vertical" />
      </SelectTrigger>
      <SelectContent className="border-cyan-500/80 max-h-60">
        {materialVerticalOptions.map((option: string) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const ComparisonSection = () => {
    const [month1, setMonth1] = useState<Date | undefined>(new Date(2025, 6, 1));
    const [month2, setMonth2] = useState<Date | undefined>(new Date(2025, 7, 1));
    
    const chartData = [
        { month: format(month1 || new Date(), 'LLL'), fileCount: 1200, fill: "var(--color-month1)" },
        { month: format(month2 || new Date(), 'LLL'), fileCount: 1500, fill: "var(--color-month2)" },
    ]

    return (
        <Card className="bg-slate-900/60 border-teal-500/50 mt-4">
            <CardHeader>
                <CardTitle className="text-center">Comparison</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 items-center">
                <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-36 justify-start text-left font-normal bg-cyan-900/50 border-cyan-500 hover:bg-cyan-900/80 text-xs",
                                    !month1 && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {month1 ? format(month1, "LLL yyyy") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={month1}
                                onSelect={setMonth1}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <span className="text-sm font-medium text-muted-foreground">VS</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-36 justify-start text-left font-normal bg-purple-900/50 border-purple-500 hover:bg-purple-900/80 text-xs",
                                    !month2 && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {month2 ? format(month2, "LLL yyyy") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={month2}
                                onSelect={setMonth2}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="w-full h-80">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                      <BarChart 
                          accessibilityLayer 
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                          <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={10}
                              tickFormatter={(value) =>
                                  typeof value === 'number' && value >= 1000
                                      ? `${value / 1000}k`
                                      : `${value}`
                              }
                          />
                          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                          <Bar dataKey="fileCount" radius={4}>
                            <LabelList dataKey="fileCount" position="top" offset={10} className="fill-foreground font-semibold" />
                          </Bar>
                      </BarChart>
                  </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
};

const Section = ({ title, sheetData, detailsData }: { title: string; sheetData: Record<string, any[][]>; detailsData: any[][] }) => {
    const [selectedTeam, setSelectedTeam] = useState(teams[0]);
    const [filters, setFilters] = useState({ month: '', teamAndProduct: '', materialVertical: '' });

    const teamAndProductOptions = useMemo(() => {
        if (!detailsData || detailsData.length <= 1) return [];
        const header = detailsData[0];
        const columnIndex = header.indexOf('Team [Product]');
        if (columnIndex === -1) return [];
        return [...new Set(detailsData.slice(1).map(row => row[columnIndex]).filter(Boolean))];
    }, [detailsData]);

    const materialVerticalOptions = useMemo(() => {
        if (!detailsData || detailsData.length <= 1) return [];
        const header = detailsData[0];
        const columnIndex = header.indexOf('Material Vertical');
        if (columnIndex === -1) return [];
        return [...new Set(detailsData.slice(1).map(row => row[columnIndex]).filter(Boolean))];
    }, [detailsData]);

    const currentTeamSheetName = teamMap[selectedTeam];
    const currentTeamData = sheetData[currentTeamSheetName] || [];

    const { fileCount, budget, payment, highlights, lowlights, insights } = useMemo(() => {
        if (currentTeamData.length < 2) { // Ensure there's at least a header and one data row
            return { fileCount: '0', budget: '$0', payment: '$0', highlights: [], lowlights: [], insights: '' };
        }

        const dataRows = currentTeamData.slice(1); // Skip header row

        const fileCountValue = dataRows.reduce((sum, row) => sum + (parseInt(row[4], 10) || 0), 0);
        const budgetValue = dataRows.reduce((sum, row) => sum + (parseFloat(String(row[5]).replace(/[^0-9.-]+/g,"")) || 0), 0);
        const paymentValue = dataRows.reduce((sum, row) => sum + (parseFloat(String(row[6]).replace(/[^0-9.-]+/g,"")) || 0), 0);
        
        // Assuming Highlights, Lowlights, Insights are not aggregated per row but are in specific cells
        // This part might need adjustment if these are per-row values.
        // For now, let's assume they are not present in the new structure or need a different logic.
        const highlightsText = ''; // Placeholder
        const lowlightsText = ''; // Placeholder
        const insightsText = ''; // Placeholder

        return {
            fileCount: fileCountValue.toLocaleString(),
            budget: `$${budgetValue.toLocaleString()}`,
            payment: `$${paymentValue.toLocaleString()}`,
            highlights: highlightsText.split('\n').filter(Boolean),
            lowlights: lowlightsText.split('\n').filter(Boolean),
            insights: insightsText,
        };

    }, [currentTeamData]);

    return (
        <Card className="border-cyan-500/50 bg-background/50 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div className="w-full">
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                        <SelectTrigger className="w-full border-cyan-500/80 focus:ring-cyan-500">
                            <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                        <SelectContent className="border-cyan-500/80">
                            {teams.map((team) => (
                                <SelectItem key={team} value={team}>
                                    {team}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <FilterDropdowns 
                  teamAndProductOptions={teamAndProductOptions}
                  materialVerticalOptions={materialVerticalOptions}
                  filters={filters}
                  setFilters={setFilters}
                />
                <Separator className="bg-cyan-500/30 my-2" />
                <div className="grid grid-cols-3 gap-4">
                    <Scoreboard title="File Count" value={fileCount} />
                    <Scoreboard title="Budget" value={budget} />
                    <Scoreboard title="Payment" value={payment} />
                </div>
                <Separator className="bg-cyan-500/30 my-4" />
                <ComparisonSection />
                <Separator className="bg-cyan-500/30 my-4" />
                <div className="space-y-4">
                    <Card className="bg-slate-900/60 border-green-500/50">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-green-400">Highlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {highlights.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                                {highlights.length === 0 && <li>Data not available in this structure.</li>}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/60 border-red-500/50">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-red-400">Lowlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {lowlights.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                                {lowlights.length === 0 && <li>Data not available in this structure.</li>}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/60 border-purple-500/50">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-base font-bold text-purple-400">
                             <Wand2 className="h-5 w-5" />
                             Strategic Insights
                           </CardTitle>
                           <CardDescription className="text-xs text-purple-400/80 pt-1">
                            Key strategic initiatives and recommendations by team, for the selected month.
                           </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {insights || 'Data not available in this structure.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TeamwiseOverview({ sheetData }: { sheetData: Record<string, any[][]> }) {
    const detailsData = sheetData['Details'] || [];
    return (
        <Card className="bg-card/50 border-cyan-500/50">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <CardTitle>Teamwise Overview</CardTitle>
                    <CardDescription>
                        Select a team in each section to view specific details.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Section title="Section 1" sheetData={sheetData} detailsData={detailsData} />
                    <Section title="Section 2" sheetData={sheetData} detailsData={detailsData} />
                </div>
            </CardContent>
        </Card>
    );
}
