
"use client";

import { useState } from "react";
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

const teams = [
  "Study Material Design",
  "Content Quality Assurance",
  "Content Management",
  "Class Operations",
];

const teamData: Record<string, { box1: string; box2: string, highlights: string[], lowlights: string[], insights: string }> = {
  "Study Material Design": {
    box1: "Details for Study Material Design - Section 1",
    box2: "Details for Study Material Design - Section 2",
    highlights: ["Increased file count by 20% in August.", "Budget surplus of $2,000 this quarter."],
    lowlights: ["Payment processing delayed for 5 projects.", "Missed content deadline for 'Book Project'."],
    insights: "Focus on automating payment reminders for pending projects to improve cash flow. Explore cloud storage solutions to manage budget overruns from file storage. Consider a sprint planning session for the 'Book Project' to realign on deadlines and deliverables."
  },
  "Content Quality Assurance": {
    box1: "Details for Content Quality Assurance - Section 1",
    box2: "Details for Content Quality Assurance - Section 2",
    highlights: ["Reduced error rate by 15%.", "Achieved 99% SLA for all quality checks."],
    lowlights: ["Understaffed for the 'Academics [Senior Segment]' project.", "Higher than average bugs in 'Weekly Quiz'."],
    insights: "Leverage the success in error rate reduction by documenting best practices and sharing with other teams. Address understaffing by cross-training members from other teams or prioritizing QA tasks for the 'Academics [Senior Segment]' project. A deep-dive into the 'Weekly Quiz' bug reports could reveal a root cause."
  },
  "Content Management": {
    box1: "Details for Content Management - Section 1",
    box2: "Details for Content Management - Section 2",
    highlights: ["Streamlined the 'LIVE Class Listing / Upload' process.", "100% on-time content delivery for 'Skills & English'."],
    lowlights: ["Storage costs exceeded budget by 10%.", "Difficulty managing 'Practice Sheet' versions."],
    insights: "The streamlined 'LIVE Class' process is a major win; apply similar principles to 'Practice Sheet' versioning. For storage costs, analyze file types and sizes to identify optimization opportunities like compression or archiving older content. Negotiating with the storage provider could also yield savings."
  },
  "Class Operations": {
    box1: "Details for Class Operations - Section 1",
    box2: "Details for Class Operations - Section 2",
    highlights: ["Improved student satisfaction by 12%.", "Successfully onboarded 5 new instructors."],
    lowlights: ["Technical issues during 3 'LIVE Class' sessions.", "Low attendance for 'IELTS Mock Test Listing'."],
    insights: "The increase in student satisfaction is directly tied to the new instructors; ensure they receive ongoing support. Conduct a root cause analysis of the technical issues in 'LIVE Class' sessions to prevent recurrence. For 'IELTS Mock Test', survey students to understand the low attendance and adjust marketing or scheduling accordingly."
  },
};

const months = ["July", "August", "September"];
const teamAndProductOptions = [
  "Academics [Junior Segment]",
  "Academics [Senior Segment]",
  "Book Project",
  "Skills & English",
];
const materialVerticalOptions = [
  "Course Listing",
  "PDP Update",
  "IELTS Mock Test Listing",
  "Homework Listing / Assign",
  "Lecture Slide",
  "Lecture Sheet",
  "Daily Quiz",
  "Weekly Quiz",
  "Weekly CQ",
  "Monthly Quiz",
  "Monthly CQ",
  "Model Test Quiz",
  "Model Test CQ",
  "LIVE Class Listing / Upload",
  "Record Shoot Listing / Upload",
  "Monthly Quiz Written",
  "Workbook",
  "Math Exercise Solve",
  "Book",
  "Practice Sheet",
];

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

const FilterDropdowns = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
    <Select>
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
    <Select>
      <SelectTrigger className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
        <SelectValue placeholder="Team [Product]" />
      </SelectTrigger>
      <SelectContent className="border-cyan-500/80">
        {teamAndProductOptions.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select>
      <SelectTrigger className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
        <SelectValue placeholder="Material Vertical" />
      </SelectTrigger>
      <SelectContent className="border-cyan-500/80 max-h-60">
        {materialVerticalOptions.map((option) => (
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

const Section = ({ title, sheetData }: { title: string; sheetData: any[] }) => {
    const [selectedTeam, setSelectedTeam] = useState(teams[0]);
    // Note: This is where you would filter `sheetData` based on `selectedTeam`
    // For now, it uses mock data.
    const currentTeamData = teamData[selectedTeam];


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
                <FilterDropdowns />
                <Separator className="bg-cyan-500/30 my-2" />
                <div className="grid grid-cols-3 gap-4">
                    <Scoreboard title="File Count" value="1,280" />
                    <Scoreboard title="Budget" value="$15,230" />
                    <Scoreboard title="Payment" value="$12,890" />
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
                                {currentTeamData.highlights.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/60 border-red-500/50">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-red-400">Lowlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {currentTeamData.lowlights.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
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
                            <p className="text-sm text-muted-foreground">{currentTeamData.insights}</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TeamwiseOverview({ sheetData }: { sheetData: any[] }) {
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
                    <Section title="Section 1" sheetData={sheetData} />
                    <Section title="Section 2" sheetData={sheetData} />
                </div>
            </CardContent>
        </Card>
    );
}
