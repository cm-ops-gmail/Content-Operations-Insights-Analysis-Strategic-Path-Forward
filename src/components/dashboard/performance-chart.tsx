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

const chartConfig = {
  fileCount: {
    label: "File Count",
  },
  SMD: {
    label: "SMD",
    color: "hsl(var(--chart-1))",
  },
  CM: {
    label: "CM",
    color: "hsl(var(--chart-2))",
  },
  QAC: {
    label: "QAC",
    color: "hsl(var(--chart-3))",
  },
  "Class Ops": {
    label: "Class Ops",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function PerformanceChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall File Count by Team</CardTitle>
        <CardDescription>Total files processed by each team</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <XAxis
              dataKey="team"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              dataKey="fileCount"
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) =>
                typeof value === 'number' && value >= 1000
                  ? `${value / 1000}k`
                  : `${value}`
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="fileCount"
              radius={4}
              fill="hsl(var(--chart-1))"
            >
              {data.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey="fileCount"
                  fill={chartConfig[entry.team as keyof typeof chartConfig]?.color || 'hsl(var(--chart-1))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
