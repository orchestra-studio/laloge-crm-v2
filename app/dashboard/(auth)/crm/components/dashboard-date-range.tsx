"use client";

import * as React from "react";
import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths
} from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

const dateFilterPresets = [
  { name: "Aujourd’hui", value: "today" },
  { name: "Hier", value: "yesterday" },
  { name: "Cette semaine", value: "thisWeek" },
  { name: "7 jours", value: "last7Days" },
  { name: "28 jours", value: "last28Days" },
  { name: "Ce mois", value: "thisMonth" },
  { name: "Mois dernier", value: "lastMonth" }
] as const;

export function DashboardDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();
  const today = new Date();
  const initialFrom = startOfDay(subDays(today, 27));

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialFrom,
    to: endOfDay(today)
  });
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(today);

  const handleQuickSelect = React.useCallback((from: Date, to: Date) => {
    setDate({ from, to });
    setCurrentMonth(from);
  }, []);

  const handlePresetChange = React.useCallback(
    (type: string) => {
      const referenceDate = new Date();

      switch (type) {
        case "today":
          handleQuickSelect(startOfDay(referenceDate), endOfDay(referenceDate));
          break;
        case "yesterday": {
          const yesterday = subDays(referenceDate, 1);
          handleQuickSelect(startOfDay(yesterday), endOfDay(yesterday));
          break;
        }
        case "thisWeek": {
          const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
          handleQuickSelect(startOfDay(weekStart), endOfDay(referenceDate));
          break;
        }
        case "last7Days":
          handleQuickSelect(startOfDay(subDays(referenceDate, 6)), endOfDay(referenceDate));
          break;
        case "last28Days":
          handleQuickSelect(startOfDay(subDays(referenceDate, 27)), endOfDay(referenceDate));
          break;
        case "thisMonth":
          handleQuickSelect(startOfMonth(referenceDate), endOfDay(referenceDate));
          break;
        case "lastMonth": {
          const lastMonth = subMonths(referenceDate, 1);
          handleQuickSelect(startOfMonth(lastMonth), endOfMonth(lastMonth));
          break;
        }
        default:
          break;
      }
    },
    [handleQuickSelect]
  );

  const dateLabel = date?.from
    ? date.to
      ? `${format(date.from, "dd MMM yyyy", { locale: fr })} — ${format(date.to, "dd MMM yyyy", {
          locale: fr
        })}`
      : format(date.from, "dd MMM yyyy", { locale: fr })
    : "Choisir une période";

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {isMobile ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{dateLabel}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon />
              {dateLabel}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto" align="end">
          <div className="flex flex-col lg:flex-row">
            <div className="me-0 lg:me-4">
              <ToggleGroup
                type="single"
                defaultValue="last28Days"
                className="hidden w-36 flex-col lg:block">
                {dateFilterPresets.map((item) => (
                  <ToggleGroupItem
                    key={item.value}
                    className="text-muted-foreground w-full"
                    value={item.value}
                    onClick={() => handlePresetChange(item.value)}
                    asChild>
                    <Button className="justify-start rounded-md">{item.name}</Button>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Select defaultValue="last28Days" onValueChange={handlePresetChange}>
                <SelectTrigger className="mb-4 flex w-full lg:hidden" size="sm">
                  <SelectValue placeholder="28 derniers jours" />
                </SelectTrigger>
                <SelectContent>
                  {dateFilterPresets.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Calendar
              locale={fr}
              className="border-s-0 py-0! ps-0! pe-0! lg:border-s lg:ps-4!"
              mode="range"
              month={currentMonth}
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate?.from) {
                  setCurrentMonth(newDate.from);
                }
              }}
              onMonthChange={setCurrentMonth}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
