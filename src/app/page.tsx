import DashboardHeader from '@/components/dashboard/header';
import PerformanceChart from '@/components/dashboard/performance-chart';
import ComparativeAnalysis from '@/components/dashboard/comparative-analysis';
import TeamwiseOverview from '@/components/dashboard/teamwise-overview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TeamIcon = ({ abbreviation }: { abbreviation: string }) => (
  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 border border-accent/50">
    <span className="text-sm font-bold text-accent">{abbreviation}</span>
  </div>
);

export default function Home() {
  const teams = [
    { name: "Study Material Design", abbreviation: "SMD", total: 1240, current: 450 },
    { name: "Content Quality Assurance", abbreviation: "QAC", total: 980, current: 320 },
    { name: "Content Management", abbreviation: "CM", total: 1530, current: 510 },
    { name: "Class Operations", abbreviation: "CO", total: 720, current: 240 },
  ];

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

            <TeamwiseOverview />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <PerformanceChart />
              </div>
              <div className="lg:col-span-2">
                <ComparativeAnalysis />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
