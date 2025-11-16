import DashboardHeader from '@/components/dashboard/header';
import KpiCard from '@/components/dashboard/kpi-card';
import PerformanceChart from '@/components/dashboard/performance-chart';
import ComparativeAnalysis from '@/components/dashboard/comparative-analysis';
import { TrendingUp, Users, Zap, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TeamIcon = ({ abbreviation }: { abbreviation: string }) => (
  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 border border-accent/50">
    <span className="text-sm font-bold text-accent">{abbreviation}</span>
  </div>
);

export default function Home() {
  const kpiData = [
    {
      title: "Total Views",
      value: "1.2M",
      change: "+12.5%",
      icon: <TrendingUp className="text-accent" />,
    },
    {
      title: "Audience Growth",
      value: "4,802",
      change: "+8.2%",
      icon: <Users className="text-accent" />,
    },
    {
      title: "Engagement Rate",
      value: "4.8%",
      change: "-0.2%",
      icon: <Zap className="text-accent" />,
    },
    {
      title: "Content Interactions",
      value: "257k",
      change: "+21.9%",
      icon: <Activity className="text-accent" />,
    },
  ];

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  icon={kpi.icon}
                />
              ))}
            </div>
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
