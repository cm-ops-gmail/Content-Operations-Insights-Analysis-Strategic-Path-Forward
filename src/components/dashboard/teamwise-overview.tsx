
"use client";

import { useState, useMemo } from "react";
import { Wand2 } from "lucide-react"

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
import { Label } from "@/components/ui/label";


const teamMap: Record<string, string> = {
  "Study Material Design": "SMD Analysis [Monthwise]",
  "Content Quality Assurance": "QAC Analysis [Monthwise]",
  "Content Management": "CM Analysis [Monthwise]",
  "Class Operations": "Class_OPS Analysis [Monthwise]",
};

const teams = Object.keys(teamMap);

const monthOptions = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];


const teamAndProductOptions = [
  "Academics [Junior Segment]",
  "Academics [Senior Segment]",
  "Book Project",
  "Skills & English",
];

const materialVerticalOptionsList = [
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
    "Math Excercise Solve",
    "Book",
    "Practice Sheet"
];

const Scoreboard = ({ title, value }: { title: string; value: string }) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background/20 border border-cyan-500/30">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const FilterDropdowns = ({ materialVerticalOptions, filters, setFilters }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="space-y-2">
      <Label htmlFor="start-month" className="text-xs text-muted-foreground">Start Month</Label>
      <Select value={filters.startMonth} onValueChange={(value) => setFilters((prev: any) => ({ ...prev, startMonth: value }))}>
        <SelectTrigger id="start-month" className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
          <SelectValue placeholder="Start Month" />
        </SelectTrigger>
        <SelectContent className="border-cyan-500/80">
          {monthOptions.map(month => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="end-month" className="text-xs text-muted-foreground">End Month</Label>
      <Select value={filters.endMonth} onValueChange={(value) => setFilters((prev: any) => ({ ...prev, endMonth: value }))}>
        <SelectTrigger id="end-month" className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
          <SelectValue placeholder="End Month" />
        </SelectTrigger>
        <SelectContent className="border-cyan-500/80">
          {monthOptions.map(month => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="team-product" className="text-xs text-muted-foreground">Team [Product]</Label>
      <Select value={filters.teamAndProduct} onValueChange={(value) => setFilters((prev: any) => ({ ...prev, teamAndProduct: value }))}>
        <SelectTrigger id="team-product" className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
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
    </div>
    <div className="space-y-2">
      <Label htmlFor="material-vertical" className="text-xs text-muted-foreground">Material Vertical</Label>
      <Select value={filters.materialVertical} onValueChange={(value) => setFilters((prev: any) => ({ ...prev, materialVertical: value }))}>
        <SelectTrigger id="material-vertical" className="w-full border-cyan-500/80 focus:ring-cyan-500 text-xs">
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
  </div>
);

const Section = ({ title, sheetData, detailsData }: { title: string; sheetData: Record<string, any[][]>; detailsData: any[][] }) => {
    const [selectedTeam, setSelectedTeam] = useState(teams[0]);
    const [filters, setFilters] = useState({ startMonth: 'July', endMonth: 'September', teamAndProduct: '', materialVertical: '' });

    const materialVerticalOptions = materialVerticalOptionsList;

    const currentTeamSheetName = teamMap[selectedTeam];
    const currentTeamData = sheetData[currentTeamSheetName] || [];

    const { fileCount, budget, payment, highlights, lowlights, insights } = useMemo(() => {
      if (currentTeamData.length < 2) {
          return { fileCount: '0', budget: '$0', payment: '$0', highlights: [], lowlights: [], insights: '' };
      }
  
      const headerRow = currentTeamData[0].map(h => String(h).trim().toLowerCase());
      let dataRows = currentTeamData.slice(1);
  
      const getIndex = (name: string) => headerRow.findIndex(h => h === name.toLowerCase().trim());
  
      const monthIndex = getIndex('month');
      const teamAndProductIndex = getIndex('team [product]');
      const materialVerticalIndex = getIndex('material vertical');
      const fileCountIndex = getIndex('file count');
      const budgetIndex = getIndex('budget');
      const paymentIndex = getIndex('payment [paid]');
      const highlightsIndex = getIndex('highlights');
      const lowlightsIndex = getIndex('lowlights');
      const insightsIndex = getIndex('strategic path forward');

      const { startMonth, endMonth, teamAndProduct, materialVertical } = filters;

      if (teamAndProduct && teamAndProductIndex !== -1) {
        dataRows = dataRows.filter(row => String(row[teamAndProductIndex]).trim().toLowerCase() === teamAndProduct.toLowerCase());
      }
      if (materialVertical && materialVerticalIndex !== -1) {
        dataRows = dataRows.filter(row => String(row[materialVerticalIndex]).trim().toLowerCase() === materialVertical.toLowerCase());
      }

      if (startMonth && endMonth && monthIndex !== -1) {
          const startIndex = monthOptions.indexOf(startMonth);
          const endIndex = monthOptions.indexOf(endMonth);

          if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
              const validMonths = monthOptions.slice(startIndex, endIndex + 1).map(m => m.toLowerCase());
              dataRows = dataRows.filter(row => {
                  const rowMonth = String(row[monthIndex]).trim().toLowerCase();
                  return validMonths.includes(rowMonth);
              });
          }
      }
  
      const sumColumn = (index: number, isCurrency: boolean = false) => {
          if (index === -1) return 0;
          return dataRows.reduce((sum, row) => {
              if(row.length <= index) return sum;
              const cellValue = row[index];
              if (isCurrency) {
                  return sum + (parseFloat(String(cellValue).replace(/[^0-9.-]+/g, "")) || 0);
              }
              return sum + (parseInt(String(cellValue).replace(/,/g, ''), 10) || 0);
          }, 0);
      };
      
      const fileCountValue = sumColumn(fileCountIndex);
      const budgetValue = sumColumn(budgetIndex, true);
      const paymentValue = sumColumn(paymentIndex, true);
      
      const getColumnText = (index: number): string[] => {
          if (index === -1) return [];
          return dataRows.map(row => row.length > index ? String(row[index]).trim() : null).filter(Boolean).join('\n').split('\n').filter(Boolean);
      };

      return {
          fileCount: fileCountValue.toLocaleString(),
          budget: `$${budgetValue.toLocaleString()}`,
          payment: `$${paymentValue.toLocaleString()}`,
          highlights: getColumnText(highlightsIndex),
          lowlights: getColumnText(lowlightsIndex),
          insights: getColumnText(insightsIndex).join(' '),
      };

  }, [currentTeamData, filters]);


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
                <div className="space-y-4">
                    <Card className="bg-slate-900/60 border-green-500/50">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-green-400">Highlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {highlights.length > 0 ? highlights.map((item, index) => (
                                    <li key={index}>{item}</li>
                                )) : <li>Data not available.</li>}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/60 border-red-500/50">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-red-400">Lowlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {lowlights.length > 0 ? lowlights.map((item, index) => (
                                    <li key={index}>{item}</li>
                                )) : <li>Data not available.</li>}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/60 border-purple-500/50">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-base font-bold text-purple-400">
                             <Wand2 className="h-5 w-5" />
                             Insights
                           </CardTitle>
                           <CardDescription className="text-xs text-purple-400/80 pt-1">
                            Key insights and takeaways for the selected period.
                           </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {insights || 'Data not available.'}
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
