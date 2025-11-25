
"use client";

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/header';
import PerformanceChart from '@/components/dashboard/performance-chart';
import TeamwiseOverview from '@/components/dashboard/teamwise-overview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const TeamIcon = ({ abbreviation }: { abbreviation: string }) => (
  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 border border-accent/50">
    <span className="text-sm font-bold text-accent">{abbreviation}</span>
  </div>
);

export default function Home() {
  const [data, setData] = useState<Record<string, any[][]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/sheets');
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch data');
        }
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  const teams = [
    { name: "Study Material Design", abbreviation: "SMD", sheet: "SMD Analysis [Monthwise]", total: 0, current: 0 },
    { name: "Content Quality Assurance", abbreviation: "QAC", sheet: "QAC Analysis [Monthwise]", total: 0, current: 0 },
    { name: "Content Management", abbreviation: "CM", sheet: "CM Analysis [Monthwise]", total: 0, current: 0 },
    { name: "Class Operations", abbreviation: "CO", sheet: "Class_OPS Analysis [Monthwise]", total: 0, current: 0 },
  ];
  
  const getTeamTotal = (teamData: any[][], columnName: string): number => {
    if (!teamData || teamData.length < 2) return 0;
    
    const headerRow = teamData[0].map(h => String(h).trim().toLowerCase());
    const columnIndex = headerRow.findIndex(h => h === columnName.trim().toLowerCase());
    
    if (columnIndex === -1) return 0;
    
    return teamData.slice(1).reduce((sum, row) => {
        const cellValue = row[columnIndex];
        const fileCount = parseInt(String(cellValue).replace(/,/g, ''), 10) || 0;
        return sum + fileCount;
    }, 0);
  };
  
  const getTeamCurrentMonthTotal = (teamData: any[][], month: string): number => {
    if (!teamData || teamData.length < 2) return 0;
    
    const headerRow = teamData[0].map(h => String(h).trim().toLowerCase());
    const fileCountIndex = headerRow.findIndex(h => h === 'file count');
    const monthIndex = headerRow.findIndex(h => h === 'month');
    
    if (fileCountIndex === -1 || monthIndex === -1) return 0;
    
    return teamData.slice(1).reduce((sum, row) => {
        if (row[monthIndex] && String(row[monthIndex]).trim().toLowerCase() === month.toLowerCase()) {
            const cellValue = row[fileCountIndex];
            const fileCount = parseInt(String(cellValue).replace(/,/g, ''), 10) || 0;
            return sum + fileCount;
        }
        return sum;
    }, 0);
  }

  const updatedTeams = teams.map(team => {
      const teamData = data[team.sheet] || [];
      return {
          ...team,
          total: getTeamTotal(teamData, 'File Count'),
          current: getTeamCurrentMonthTotal(teamData, 'September'),
      }
  });
  
  const chartData = updatedTeams.map(t => ({ team: t.abbreviation, fileCount: t.total }));


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="grid gap-6">
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
                  </div>
                </CardContent>
              </Card>
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="container mx-auto">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Fetching Data</AlertTitle>
              <AlertDescription>
                <p>Could not load data from Google Sheets.</p>
                <p className="font-mono text-xs mt-2">{error}</p>
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="grid gap-6">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-primary">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {updatedTeams.map((team) => (
                    <Card key={team.name} className="border-accent/50 hover:border-accent transition-colors flex flex-col">
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <TeamIcon abbreviation={team.abbreviation} />
                        <h3 className="text-base font-bold flex-1">{team.name}</h3>
                      </CardHeader>
                      <CardContent className="flex-1 flex justify-between items-center p-4 pt-2">
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground">Total Contents (Last 3 Months)</p>
                          <p className="text-2xl font-bold text-foreground">{team.total.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Current Month Content Count</p>
                          <p className="text-2xl font-bold text-foreground">{team.current.toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <TeamwiseOverview sheetData={Object.keys(data).length > 0 ? data : {}} />

            <PerformanceChart data={chartData} />

          </div>
        </div>
      </main>
    </div>
  );
}
