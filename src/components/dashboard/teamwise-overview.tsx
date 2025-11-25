
"use client";

import { useState, useMemo } from "react";
import { Wand2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { analyzePerformanceAction } from "@/app/actions/analyze";
import type { AnalyzeQ3PerformanceOutput } from "@/ai/flows/analyze-q3-performance";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";


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

const AiInsightSection = ({ data, sectionId }: { data: any, sectionId: string }) => {
  const [analysis, setAnalysis] = useState<AnalyzeQ3PerformanceOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialState, setInitialState] = useState(true);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setInitialState(false);
    try {
      const result = await analyzePerformanceAction({
        startMonthData: {
          month: data.filters.startMonth,
          fileCount: data.startMonthTotals.fileCount,
          budget: data.startMonthTotals.budget,
          payment: data.startMonthTotals.payment,
        },
        endMonthData: {
          month: data.filters.endMonth,
          fileCount: data.endMonthTotals.fileCount,
          budget: data.endMonthTotals.budget,
          payment: data.endMonthTotals.payment,
        },
        teamAndProduct: data.filters.teamAndProduct,
        materialVertical: data.filters.materialVertical,
      });
      setAnalysis(result);
    } catch (e: any) {
      setError(e.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-900/60 border-purple-500/50 dark:bg-slate-900/60 bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-base font-bold text-purple-400">
            Insights
          </CardTitle>
        </div>
        <Button onClick={handleAnalyze} disabled={loading} size="sm" variant="outline" className="border-purple-500/80 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </CardHeader>
      <CardContent>
        {initialState ? (
            <p className="text-sm text-muted-foreground">
              Click 'Analyze' to generate AI-powered insights comparing your selected start and end months.
            </p>
        ) : loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p>Error: {error}</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Summary</h4>
              <p className="text-muted-foreground">{analysis.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Insights</h4>
              <p className="text-muted-foreground">{analysis.insights}</p>
            </div>
            {analysis.recommendations && (
              <div>
                <h4 className="font-semibold text-foreground mb-1">Recommendations</h4>
                <p className="text-muted-foreground">{analysis.recommendations}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No insights generated.</p>
        )}
      </CardContent>
    </Card>
  );
};


const BreakdownPopup = ({
  isOpen,
  onClose,
  teamName,
  tableData,
  tableHeader,
}: {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  tableData: any[][];
  tableHeader: string[];
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-card border-border flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-900 dark:text-cyan-400">Sheet Data for {teamName}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  {tableHeader.map((header, index) => (
                    <TableHead key={index} className="whitespace-nowrap text-blue-900 dark:text-purple-400">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.length > 0 ? tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-muted/50">
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="text-foreground text-xs whitespace-nowrap">{cell}</TableCell>
                    ))}
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={tableHeader.length} className="text-center text-muted-foreground">Data not available for the selected period.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};



const Section = ({ title, sheetData, detailsData, sectionId }: { title: string; sheetData: Record<string, any[][]>; detailsData: any[][]; sectionId: string; }) => {
    const [selectedTeam, setSelectedTeam] = useState(teams[0]);
    const [filters, setFilters] = useState({ startMonth: 'July', endMonth: 'September', teamAndProduct: '', materialVertical: '' });
    const [isPopupOpen, setPopupOpen] = useState(false);

    const materialVerticalOptions = materialVerticalOptionsList;

    const currentTeamSheetName = teamMap[selectedTeam];
    const currentTeamData = sheetData[currentTeamSheetName] || [];

    const { fileCount, budget, payment, highlights, lowlights, insights, startMonthTotals, endMonthTotals, breakdownData, rawSheetHeader, rawSheetData } = useMemo(() => {
      if (currentTeamData.length < 2) {
          return { fileCount: '0', budget: '0', payment: '0', highlights: [], lowlights: [], insights: '', startMonthTotals: {}, endMonthTotals: {}, breakdownData: [], rawSheetHeader: [], rawSheetData: [] };
      }
  
      const headerRow = currentTeamData[0].map(h => String(h).trim());
      let dataRows = currentTeamData.slice(1);
  
      const getIndex = (name: string) => headerRow.findIndex(h => h.toLowerCase().trim() === name.toLowerCase().trim());
  
      const monthIndex = getIndex('month');
      const teamAndProductIndex = getIndex('team [product]');
      const materialVerticalIndex = getIndex('material vertical');
      const fileCountIndex = getIndex('file count');
      const budgetIndex = getIndex('budget');
      const paymentIndex = getIndex('payment [paid]');
      const highlightsIndex = getIndex('highlights');
      const lowlightsIndex = getIndex('lowlights');
      const insightsIndex = getIndex('strategic path forward');

      const { teamAndProduct, materialVertical } = filters;

      let preFilteredRows = dataRows;
      if (teamAndProduct && teamAndProductIndex !== -1) {
        preFilteredRows = preFilteredRows.filter(row => String(row[teamAndProductIndex]).trim().toLowerCase() === teamAndProduct.toLowerCase());
      }
      if (materialVertical && materialVerticalIndex !== -1) {
        preFilteredRows = preFilteredRows.filter(row => String(row[materialVerticalIndex]).trim().toLowerCase() === materialVertical.toLowerCase());
      }
      
      const { startMonth, endMonth } = filters;
      let rangedFilteredRows = preFilteredRows;
      if (startMonth && endMonth && monthIndex !== -1) {
          const startIndex = monthOptions.indexOf(startMonth);
          const endIndex = monthOptions.indexOf(endMonth);

          if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
              const validMonths = monthOptions.slice(startIndex, endIndex + 1).map(m => m.toLowerCase());
              rangedFilteredRows = rangedFilteredRows.filter(row => {
                  if (row.length <= monthIndex) return false;
                  const rowMonth = String(row[monthIndex]).trim().toLowerCase();
                  return validMonths.includes(rowMonth);
              });
          }
      }

      const calculateTotals = (rows: any[][]) => {
        if (rows.length === 0) {
            return {
                fileCount: 'no file entry for this month',
                budget: '0',
                payment: '0',
                highlights: [],
                lowlights: [],
                insights: ''
            };
        }

        const sumColumn = (index: number, isCurrency: boolean = false) => {
            if (index === -1) return 0;
            return rows.reduce((sum, row) => {
                if(row.length <= index) return sum;
                const cellValue = row[index];
                if (isCurrency) {
                    return sum + (parseFloat(String(cellValue).replace(/[^0-9.-]+/g, "")) || 0);
                }
                return sum + (parseInt(String(cellValue).replace(/,/g, ''), 10) || 0);
            }, 0);
        };
        const getColumnText = (index: number): string[] => {
          if (index === -1) return [];
          return Array.from(new Set(rows.map(row => row.length > index ? String(row[index]).trim() : null).filter(Boolean).join('\n').split('\n').filter(Boolean)));
        };

        const fileCountValue = sumColumn(fileCountIndex);
        const budgetValue = sumColumn(budgetIndex, true);
        const paymentValue = sumColumn(paymentIndex, true);

        return {
            fileCount: fileCountValue > 0 ? fileCountValue.toLocaleString() : "0",
            budget: `${budgetValue.toLocaleString()}`,
            payment: `${paymentValue.toLocaleString()}`,
            highlights: getColumnText(highlightsIndex),
            lowlights: getColumnText(lowlightsIndex),
            insights: getColumnText(insightsIndex).join(' '),
        }
      }
      
      const overallTotals = calculateTotals(rangedFilteredRows);
      if (rangedFilteredRows.length === 0) {
        overallTotals.fileCount = 'no file entry for this month';
      }
      
      const startMonthRows = preFilteredRows.filter(row => String(row[monthIndex]).trim().toLowerCase() === startMonth.toLowerCase());
      const endMonthRows = preFilteredRows.filter(row => String(row[monthIndex]).trim().toLowerCase() === endMonth.toLowerCase());
      
      const desiredColumns = ['Month', 'Team [Product]', 'Product / Course', 'Material Vertical', 'File Count', 'Budget', 'payment[paid]'];
      const desiredColumnIndices = desiredColumns.map(col => headerRow.findIndex(h => h.toLowerCase().trim() === col.toLowerCase().trim()));

      const filteredHeader = desiredColumns;
      const filteredData = rangedFilteredRows.map(row => {
          return desiredColumnIndices.map(index => index !== -1 ? row[index] : '');
      });

      return {
          ...overallTotals,
          startMonthTotals: calculateTotals(startMonthRows),
          endMonthTotals: calculateTotals(endMonthRows),
          breakdownData: [],
          rawSheetHeader: filteredHeader,
          rawSheetData: filteredData
      };

  }, [currentTeamData, filters]);


    return (
        <Card className="border-cyan-500/50 bg-background/50 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg text-cyan-400">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div className="w-full">
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                        <SelectTrigger className="w-full border-cyan-500/80 focus:ring-cyan-500">
                            <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                        <SelectContent className="border-cyan-500/80">
                            {teams.map((team) => (
                                <SelectItem key={team} value={team} className="dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-primary-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background hover:!bg-muted focus:!bg-muted dark:hover:!bg-accent dark:focus:!bg-accent">
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
                
                <div className="mt-2">
                    <Button 
                      onClick={() => setPopupOpen(true)} 
                      className="w-full bg-background border-border text-foreground hover:bg-foreground hover:text-background dark:bg-primary dark:text-primary-foreground dark:border-transparent dark:hover:bg-secondary">
                        View Breakdown
                    </Button>
                </div>
                
                <Separator className="bg-cyan-500/30 my-4" />

                <div className="space-y-4">
                    <Card className="bg-slate-900/60 border-green-500/50 dark:bg-slate-900/60 bg-card">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-green-400 dark:text-green-400 text-green-600">Highlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {highlights.length > 0 ? highlights.map((item, index) => (
                                    <li key={index}>{item}</li>
                                )) : <li>Data not available.</li>}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/60 border-red-500/50 dark:bg-slate-900/60 bg-card">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-red-400 dark:text-red-400 text-red-600">Lowlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {lowlights.length > 0 ? lowlights.map((item, index) => (
                                    <li key={index}>{item}</li>
                                )) : <li>Data not available.</li>}
                            </ul>
                        </CardContent>
                    </Card>
                    <AiInsightSection 
                        sectionId={sectionId}
                        data={{ filters, startMonthTotals, endMonthTotals, insights }}
                    />
                </div>
            </CardContent>
            <BreakdownPopup 
                isOpen={isPopupOpen}
                onClose={() => setPopupOpen(false)}
                teamName={selectedTeam}
                tableData={rawSheetData}
                tableHeader={rawSheetHeader}
            />
        </Card>
    );
}

export default function TeamwiseOverview({ sheetData }: { sheetData: Record<string, any[][]> }) {
    const detailsData = sheetData['Details'] || [];
    return (
        <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1.5">
                    <CardTitle className="text-cyan-400">Teamwise Overview</CardTitle>
                    <CardDescription>
                        Select a team in each section to view specific details.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Section title="Select the team" sectionId="section-1" sheetData={sheetData} detailsData={detailsData} />
                    <Section title="Select the team" sectionId="section-2" sheetData={sheetData} detailsData={detailsData} />
                </div>
            </CardContent>
        </Card>
    );
}

    

    

    

    

    

    
