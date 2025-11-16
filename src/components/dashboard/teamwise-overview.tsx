
"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, Legend, LabelList } from "recharts";
import { Calendar as CalendarIcon } from "lucide-react"
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

const teamData: Record<string, { box1: string; box2: string }> = {
  "Study Material Design": {
    box1: "Details for Study Material Design - Section 1",
    box2: "Details for Study Material Design - Section 2",
  },
  "Content Quality Assurance": {
    box1: "Details for Content Quality Assurance - Section 1",
    box2: "Details for Content Quality Assurance - Section 2",
  },
  "Content Management": {
    box1: "Details for Content Management - Section 1",
    box2: "Details for Content Management - Section 2",
  },
  "Class Operations": {
    box1: "Details for Class Operations - Section 1",
    box2: "Details for Class Operations - Section 2",
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

const teamComparisonData: Record<string, { name: string; fileCount: number }[]> = {
    "SMD": [
        { name: "July", fileCount: 1200 },
        { name: "August", fileCount: 1500 },
        { name: "September", fileCount: 1300 },
    ],
    "QAC": [
        { name: "July", fileCount: 950 },
        { name: "August", fileCount: 1100 },
        { name: "September", fileCount: 1000 },
    ],
    "CM": [
        { name: "July", fileCount: 1600 },
        { name: "August", fileCount: 1450 },
        { name: "September", fileCount: 1550 },
    ],
    "Class Ops": [
        { name: "July", fileCount: 700 },
        { name: "August", fileCount: 850 },
        { name: "September", fileCount: 750 },
    ]
};

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
    const [month1, setMonth1] = useState<Date | undefined>(new Date(2024, 6, 1));
    const [month2, setMonth2] = useState<Date | undefined>(new Date(2024, 7, 1));

    const comparisonData = [
        { team: "SMD", month1: 1200, month2: 1500 },
        { team: "QAC", month1: 950, month2: 1100 },
        { team: "CM", month1: 1600, month2: 1450 },
        { team: "Class Ops", month1: 700, month2: 850 },
    ];
    
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
                <div className="flex items-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal bg-cyan-900/50 border-cyan-500 hover:bg-cyan-900/80",
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
                                    "w-[240px] justify-start text-left font-normal bg-purple-900/50 border-purple-500 hover:bg-purple-900/80",
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
                          <XAxis
                              dataKey="month"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                              stroke="hsl(var(--muted-foreground))"
                          />
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
                          <Legend content={() => (
                              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                                  <span>SMD</span>
                                  <span>QAC</span>
                                  <span>CM</span>
                                  <span>Class Ops</span>
                              </div>
                          )} />
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

export default function TeamwiseOverview() {
  const [selectedTeam1, setSelectedTeam1] = useState(teams[0]);
  const [selectedTeam2, setSelectedTeam2] = useState(teams[1]);

  return (
    <Card className="bg-card/50 border-cyan-500/50">
      <CardHeader>
        <CardTitle>Teamwise Overview</CardTitle>
        <CardDescription>
          Select a team in each section to view specific details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-cyan-500/50 bg-background/50 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Section 1</CardTitle>
              <div className="pt-2">
                <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
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
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <FilterDropdowns />
              <Separator className="bg-cyan-500/30 my-2" />
              <div className="grid grid-cols-3 gap-4">
                <Scoreboard title="File Count" value="1,280" />
                <Scoreboard title="Budget" value="$15,230" />
                <Scoreboard title="Payment" value="$12,890" />
              </div>
              <p className="text-muted-foreground mt-4">
                {teamData[selectedTeam1].box1}
              </p>
              <Separator className="bg-cyan-500/30 my-4" />
              <ComparisonSection />
            </CardContent>
          </Card>
          <Card className="border-cyan-500/50 bg-background/50 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Section 2</CardTitle>
              <div className="pt-2">
                <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
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
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <FilterDropdowns />
              <Separator className="bg-cyan-500/30 my-2" />
              <div className="grid grid-cols-3 gap-4">
                <Scoreboard title="File Count" value="950" />
                <Scoreboard title="Budget" value="$22,500" />
                <Scoreboard title="Payment" value="$19,750" />
              </div>
              <p className="text-muted-foreground mt-4">
                {teamData[selectedTeam2].box2}
              </p>
              <Separator className="bg-cyan-500/30 my-4" />
              <ComparisonSection />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

    