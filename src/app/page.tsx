import DashboardHeader from '@/components/dashboard/header';
import KpiCard from '@/components/dashboard/kpi-card';
import PerformanceChart from '@/components/dashboard/performance-chart';
import ComparativeAnalysis from '@/components/dashboard/comparative-analysis';
import { TrendingUp, Users, Zap, Activity, RectangleHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    { name: "Study Material Design", icon: <RectangleHorizontal className="h-6 w-6 text-accent" /> },
    { name: "Content Quality Assurance", icon: <RectangleHorizontal className="h-6 w-6 text-accent" /> },
    { name: "Content Management", icon: <RectangleHorizontal className="h-6 w-6 text-accent" /> },
    { name: "Class Operations", icon: <RectangleHorizontal className="h-6 w-6 text-accent" /> },
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teams.map((team) => (
                    <Card key={team.name} className="border-accent/50 hover:border-accent transition-colors">
                      <CardContent className="flex items-center justify-center p-6 gap-4">
                        {team.icon}
                        <h3 className="text-base font-bold text-center">{team.name}</h3>
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
