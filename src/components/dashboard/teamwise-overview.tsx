
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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';


const teamMap: Record<string, string> = {
  "Study Material Design": "SMD Analysis [Monthwise]",
  "Content Quality Assurance": "QAC Analysis [Monthwise]",
  "Content Management": "CM Analysis [Monthwise]",
  "Class Operations": "Class_OPS Analysis [Monthwise]",
};

const teams = Object.keys(teamMap);

const monthOptions = [
    "July", "August", "September"
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

const AiInsightSection = ({ data, isSection1 }: { data: any, isSection1: boolean }) => {
  const [analysis, setAnalysis] = useState<AnalyzeQ3PerformanceOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialState, setInitialState] = useState(true);

  const handleAnalyze = async () => {
    if (!isSection1) return;
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
    <Card className="bg-slate-900/60 border-purple-500/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-base font-bold text-purple-400">
            Insights
          </CardTitle>
        </div>
        {isSection1 && (
           <Button onClick={handleAnalyze} disabled={loading} size="sm" variant="outline" className="border-purple-500/80 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
             {loading ? "Analyzing..." : "Analyze"}
           </Button>
        )}
      </CardHeader>
      <CardContent>
        {initialState ? (
            <p className="text-sm text-muted-foreground">
              {isSection1 ? "Click 'Analyze' to generate AI-powered insights comparing your selected start and end months." : (data.insights || "Data not available.")}
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
  breakdownData,
  startMonth,
  endMonth
}: {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  breakdownData: any[];
  startMonth: string;
  endMonth: string;
}) => {
  if (!isOpen) return null;

  const chartData = breakdownData.map(item => ({
    name: item.materialVertical,
    efficiency: item.efficiency
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-slate-800 text-white rounded-md border border-slate-700 shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          <p className="intro text-sm">{`Efficiency : ${payload[0].value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (efficiency: number) => {
    if (efficiency < 0) return 'hsl(var(--destructive))'; // Red
    if (efficiency >= 100) return 'hsl(var(--chart-2))'; // Green
    return 'hsl(var(--chart-4))'; // Yellow/Orange
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] bg-slate-900/90 border-cyan-500/50 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 text-xl">Detailed Breakdown for {teamName}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full py-4">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-foreground mb-2">Raw Data Table</h3>
            <div className="flex-grow overflow-auto border border-cyan-500/30 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-800">
                    <TableHead className="text-cyan-400">Material Vertical</TableHead>
                    <TableHead className="text-cyan-400 text-center">{startMonth}</TableHead>
                    <TableHead className="text-cyan-400 text-center">{endMonth}</TableHead>
                    <TableHead className="text-cyan-400 text-center">Efficiency (MoM %)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breakdownData.length > 0 ? breakdownData.map((item, index) => (
                    <TableRow key={index} className="hover:bg-slate-800/50">
                      <TableCell className="font-medium text-muted-foreground text-xs">{item.materialVertical}</TableCell>
                      <TableCell className="text-foreground text-center">{item.startMonthCount}</TableCell>
                      <TableCell className="text-foreground text-center">{item.endMonthCount}</TableCell>
                      <TableCell className={`text-center font-bold ${item.efficiency >= 0 ? "text-green-400" : "text-red-400"}`}>
                        <div className="flex items-center justify-center gap-1">
                            {item.efficiency >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                            {item.efficiency.toFixed(1)}%
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">Data not available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Efficiency Chart</h3>
            <div className="flex-grow border border-cyan-500/30 rounded-lg p-4">
                {breakdownData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 50, left: 50, bottom: 5 }}>
                            <XAxis type="number" stroke="#94a3b8" tickFormatter={(tick) => `${tick}%`} domain={['auto', 'auto']} />
                            <YAxis type="category" dataKey="name" stroke="#94a3b8" width={150} tick={{ fontSize: 10 }} interval={0}/>
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.3)' }}/>
                            <Bar dataKey="efficiency" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Bar key={`cell-${index}`} fill={getBarColor(entry.efficiency)} />
                                ))}
                                <LabelList dataKey="efficiency" position="right" formatter={(value: number) => `${value.toFixed(1)}%`} fontSize={10} fill="white" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">Chart not available.</div>
                )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};



const Section = ({ title, sheetData, detailsData, isSection1 = false }: { title: string; sheetData: Record<string, any[][]>; detailsData: any[][]; isSection1?: boolean; }) => {
    const [selectedTeam, setSelectedTeam] = useState(teams[0]);
    const [filters, setFilters] = useState({ startMonth: 'July', endMonth: 'September', teamAndProduct: '', materialVertical: '' });
    const [isPopupOpen, setPopupOpen] = useState(false);

    const materialVerticalOptions = materialVerticalOptionsList;

    const currentTeamSheetName = teamMap[selectedTeam];
    const currentTeamData = sheetData[currentTeamSheetName] || [];

    const { fileCount, budget, payment, highlights, lowlights, insights, startMonthTotals, endMonthTotals, breakdownData } = useMemo(() => {
      if (currentTeamData.length < 2) {
          return { fileCount: '0', budget: '$0', payment: '$0', highlights: [], lowlights: [], insights: '', startMonthTotals: {}, endMonthTotals: {}, breakdownData: [] };
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

      const { teamAndProduct, materialVertical } = filters;

      let preFilteredRows = dataRows;
      if (teamAndProduct && teamAndProductIndex !== -1) {
        preFilteredRows = preFilteredRows.filter(row => String(row[teamAndProductIndex]).trim().toLowerCase() === teamAndProduct.toLowerCase());
      }
      if (materialVertical && materialVerticalIndex !== -1) {
        preFilteredRows = preFilteredRows.filter(row => String(row[materialVerticalIndex]).trim().toLowerCase() === materialVertical.toLowerCase());
      }
      
      const calculateTotals = (rows: any[][]) => {
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
            fileCount: fileCountValue.toLocaleString(),
            budget: `$${budgetValue.toLocaleString()}`,
            payment: `$${paymentValue.toLocaleString()}`,
            highlights: getColumnText(highlightsIndex),
            lowlights: getColumnText(lowlightsIndex),
            insights: getColumnText(insightsIndex).join(' '),
        }
      }

      const { startMonth, endMonth } = filters;
      let rangedFilteredRows = preFilteredRows;
      if (startMonth && endMonth && monthIndex !== -1) {
          const startIndex = monthOptions.indexOf(startMonth);
          const endIndex = monthOptions.indexOf(endMonth);

          if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
              const validMonths = monthOptions.slice(startIndex, endIndex + 1).map(m => m.toLowerCase());
              rangedFilteredRows = rangedFilteredRows.filter(row => {
                  const rowMonth = String(row[monthIndex]).trim().toLowerCase();
                  return validMonths.includes(rowMonth);
              });
          }
      }
      
      const overallTotals = calculateTotals(rangedFilteredRows);
      
      const startMonthRows = preFilteredRows.filter(row => String(row[monthIndex]).trim().toLowerCase() === startMonth.toLowerCase());
      const endMonthRows = preFilteredRows.filter(row => String(row[monthIndex]).trim().toLowerCase() === endMonth.toLowerCase());

      const verticals = Array.from(new Set(preFilteredRows.map(row => row[materialVerticalIndex]).filter(Boolean)));

      const breakdown = verticals.map(vertical => {
          const startRows = startMonthRows.filter(row => row[materialVerticalIndex] === vertical);
          const endRows = endMonthRows.filter(row => row[materialVerticalIndex] === vertical);

          const startCount = calculateTotals(startRows).fileCount.replace(/,/g, '');
          const endCount = calculateTotals(endRows).fileCount.replace(/,/g, '');

          const startNum = parseInt(startCount, 10) || 0;
          const endNum = parseInt(endCount, 10) || 0;

          let efficiency = 0;
          if (startNum > 0) {
              efficiency = ((endNum - startNum) / startNum) * 100;
          } else if (endNum > 0) {
              efficiency = 100;
          }

          return {
              materialVertical: vertical,
              startMonthCount: startNum,
              endMonthCount: endNum,
              efficiency: efficiency,
          };
      });

      return {
          ...overallTotals,
          startMonthTotals: calculateTotals(startMonthRows),
          endMonthTotals: calculateTotals(endMonthRows),
          breakdownData: breakdown,
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
                
                <div className="mt-2">
                    <Button onClick={() => setPopupOpen(true)} className="w-full" variant="outline">
                        View Breakdown
                    </Button>
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
                    <AiInsightSection 
                        isSection1={isSection1}
                        data={{ filters, startMonthTotals, endMonthTotals, insights }}
                    />
                </div>
            </CardContent>
            <BreakdownPopup 
                isOpen={isPopupOpen}
                onClose={() => setPopupOpen(false)}
                teamName={selectedTeam}
                breakdownData={breakdownData}
                startMonth={filters.startMonth}
                endMonth={filters.endMonth}
            />
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
                    <Section title="Section 1" sheetData={sheetData} detailsData={detailsData} isSection1={true} />
                    <Section title="Section 2" sheetData={sheetData} detailsData={detailsData} />
                </div>
            </CardContent>
        </Card>
    );
}

    