
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
            <CardContent className="flex-1">
              <p className="text-muted-foreground">
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
            <CardContent className="flex-1">
              <p className="text-muted-foreground">
                {teamData[selectedTeam2].box2}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
