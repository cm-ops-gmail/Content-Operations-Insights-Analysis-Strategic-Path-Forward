
"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, Legend } from "recharts";
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

const comparisonChartData = [
  { team: "SMD", july: 1200, august: 1500 },
  { team: "QAC", july: 950, august: 1100 },
  { team: "CM", july: 1600, august: 1450 },
  { team: "Class Ops", july: 700, august: 850 },
];

const chartConfig = {
  july: { label: "July", color: "hsl(var(--chart-1))" },
  august: { label: "August", color: "hsl(var(--chart-2))" },
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

const ComparisonSection = () => (
    <Card className="bg-slate-900/60 border-teal-500/50 mt-4">
      <CardHeader>
        <CardTitle className="text-center">Comparison</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 items-center">
        <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-cyan-900/50 border-cyan-500 hover:bg-cyan-900/80">July</Button>
            <span className="text-sm font-medium text-muted-foreground">VS</span>
            <Button variant="outline" className="bg-purple-900/50 border-purple-500 hover:bg-purple-900/80">August</Button>
        </div>
        <div className="w-full h-64">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart accessibilityLayer data={comparisonChartData}>
              <XAxis
                dataKey="team"
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
              <Legend />
              <Bar dataKey="july" fill="var(--color-july)" radius={4} />
              <Bar dataKey="august" fill="var(--color-august)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );

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
