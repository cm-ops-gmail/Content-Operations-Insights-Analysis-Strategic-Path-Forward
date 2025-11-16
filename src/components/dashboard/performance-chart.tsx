"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "July", views: 186000, engagement: 4.5, growth: 1500 },
  { month: "August", views: 305000, engagement: 5.2, growth: 2100 },
  { month: "September", views: 237000, engagement: 4.8, growth: 1400 },
]

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
  engagement: {
    label: "Engagement",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Q3 Performance Overview</CardTitle>
        <CardDescription>July - September 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) =>
                typeof value === 'number' && value > 1000
                  ? `${value / 1000}k`
                  : `${value}`
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="views" fill="var(--color-views)" radius={4} />
            <Bar dataKey="engagement" fill="var(--color-engagement)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
