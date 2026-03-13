"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

type DossierScoreBreakdownItem = { id: string; label: string; score: number; description: string };

const chartConfig = {
  score: {
    label: "Score",
    color: "#C5A572"
  }
} satisfies ChartConfig;

export function DossierScoreBreakdown({
  score,
  breakdown
}: {
  score: number;
  breakdown: DossierScoreBreakdownItem[];
}) {
  const chartData = breakdown.map((item) => ({
    label: item.label,
    score: item.score
  }));

  return (
    <Card className="border-[#C5A572]/12 bg-white shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Score de compatibilité</CardTitle>
            <CardDescription className="mt-1">
              Lecture détaillée des critères qui soutiennent le match salon × marque.
            </CardDescription>
          </div>
          <div className="rounded-2xl border border-[#C5A572]/20 bg-[#FBF7F1] px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8C6B2D]">Score global</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-[#7D643C]">{score}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-6 py-6">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <ChartContainer config={chartConfig} className="h-[260px] w-full aspect-auto">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid horizontal={false} strokeDasharray="4 4" />
              <YAxis
                type="category"
                dataKey="label"
                axisLine={false}
                tickLine={false}
                width={132}
                tick={{ fontSize: 12 }}
              />
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="score" fill="var(--color-score)" radius={10} />
            </BarChart>
          </ChartContainer>

          <div className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#C5A572]/12 bg-[#FCFAF6] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{item.label}</p>
                  <span className="text-sm font-semibold text-[#7D643C]">{item.score}%</span>
                </div>
                <Progress value={item.score} className="mt-3 h-2.5 bg-[#E9DECC]" indicatorColor="bg-[#C5A572]" />
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
