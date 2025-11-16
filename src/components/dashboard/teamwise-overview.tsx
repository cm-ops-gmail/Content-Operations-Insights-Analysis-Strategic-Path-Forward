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

const teams = [
  "Study Material Design",
  "Content Quality Assurance",
  "Content Management",
  "Class Operations",
];

const teamData: Record<string, { box1: string; box2: string }> = {
  "Study Material Design": {
    box1: "Details for Study Material Design - Box 1",
    box2: "Details for Study Material Design - Box 2",
  },
  "Content Quality Assurance": {
    box1: "Details for Content Quality Assurance - Box 1",
    box2: "Details for Content Quality Assurance - Box 2",
  },
  "Content Management": {
    box1: "Details for Content Management - Box 1",
    box2: "Details for Content Management - Box 2",
  },
  "Class Operations": {
    box1: "Details for Class Operations - Box 1",
    box2: "Details for Class Operations - Box 2",
  },
};

export default function TeamwiseOverview() {
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);

  return (
    <Card className="bg-card/50 border-cyan-500/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <CardTitle>Teamwise Overview</CardTitle>
            <CardDescription>
              Select a team to view their specific details.
            </CardDescription>
          </div>
          <div className="w-full sm:w-64">
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-cyan-500/50 bg-background/50">
            <CardHeader>
              <CardTitle className="text-lg">Section 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {teamData[selectedTeam].box1}
              </p>
            </CardContent>
          </Card>
          <Card className="border-cyan-500/50 bg-background/50">
            <CardHeader>
              <CardTitle className="text-lg">Section 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {teamData[selectedTeam].box2}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}