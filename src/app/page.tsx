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
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/sheets');
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 403) {
             throw new Error("Permission Denied: Please make sure the service account 'service@n8n-ocr-workflow-connection.iam.gserviceaccount.com' has 'Editor' permissions on your Google Sheet and that the Google Sheets API is enabled in your Google Cloud project.");
          }
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    // We are disabling fetching for now to prevent app crash.
    // To re-enable, uncomment the line below.
    // fetchData();
    setLoading(false);
  }, []);
  
  const teams = [
    { name: "Study Material Design", abbreviation: "SMD", total: 1240, current: 450 },
    { name: "Content Quality Assurance", abbreviation: "QAC", total: 980, current: 320 },
    { name: "Content Management", abbreviation: "CM", total: 1530, current: 510 },
    { name: "Class Operations", abbreviation: "CO", total: 720, current: 240 },
  ];

  const chartData = teams.map(t => ({ team: t.abbreviation, fileCount: t.total }));

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
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {teams.map((team) => (
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

            <TeamwiseOverview sheetData={data.length > 0 ? data : []} />

            <PerformanceChart data={chartData} />

          </div>
        </div>
      </main>
    </div>
  );
}
