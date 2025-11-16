"use client"

import { Bell, Zap, TrendingDown, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const alerts = [
    { icon: <Zap className="h-4 w-4 text-accent" />, text: "Engagement dropped by 15% yesterday." },
    { icon: <TrendingDown className="h-4 w-4 text-destructive" />, text: "Video views are down 20% week-over-week." },
    { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, text: "High API error rate detected." },
]

export default function Alerts() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Recent Alerts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {alerts.map((alert, index) => (
          <DropdownMenuItem key={index} className="flex items-start gap-3">
            {alert.icon}
            <span className="text-sm text-muted-foreground flex-1">{alert.text}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
