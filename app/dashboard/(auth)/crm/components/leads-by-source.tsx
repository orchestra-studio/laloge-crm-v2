"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { dashboardPipeline, formatInteger } from "@/app/dashboard/(auth)/crm/data";

const chartConfig = {
  count: {
    label: "Salons"
  },
  nouveau: {
    label: "Nouveau",
    color: dashboardPipeline[0].color
  },
  contacte: {
    label: "Contacté",
    color: dashboardPipeline[1].color
  },
  interesse: {
    label: "Intéressé",
    color: dashboardPipeline[2].color
  },
  rdv_planifie: {
    label: "RDV planifié",
    color: dashboardPipeline[3].color
  },
  negociation: {
    label: "Négociation",
    color: dashboardPipeline[4].color
  },
  gagne: {
    label: "Gagné",
    color: dashboardPipeline[5].color
  }
} satisfies ChartConfig;

export function LeadBySourceCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Pipeline mini</CardTitle>
            <CardDescription>
              Répartition des salons par statut sur la période sélectionnée.
            </CardDescription>
          </div>
          <CardAction>
            <Badge variant="outline">6 étapes suivies</Badge>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart
            accessibilityLayer
            data={dashboardPipeline}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 12, bottom: 4 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="label"
              type="category"
              width={96}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => {
                    const payload = item.payload as (typeof dashboardPipeline)[number];

                    return (
                      <div className="flex min-w-32 items-center justify-between gap-3">
                        <span className="text-muted-foreground">{payload.label}</span>
                        <span className="font-medium">{formatInteger(Number(value))}</span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="count" radius={8}>
              {dashboardPipeline.map((stage) => (
                <Cell key={stage.status} fill={stage.color} />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                offset={10}
                className="fill-foreground text-xs font-medium"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
