
"use client";

import { useState } from "react";
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
                {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
            </SelectContent>
        </Select>
        <Select>
            <SelectTrigger className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
                <SelectValue placeholder="Team [Product]" />
            </SelectTrigger>
            <SelectContent className="border-cyan-500/80">
                {teamAndProductOptions.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
            </SelectContent>
        </Select>
        <Select>
            <SelectTrigger className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
                <SelectValue placeholder="Material Vertical" />
            </SelectTrigger>
            <SelectContent className="border-cyan-500/80 max-h-60">
                {materialVerticalOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
)


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
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
