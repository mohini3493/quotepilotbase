"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import {
  HelpCircle,
  Settings,
  FileText,
  TrendingUp,
  Calendar as CalendarIcon,
  Activity,
  ArrowUpRight,
  Clock,
  Link2Icon,
  Briefcase,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--primary)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--secondary)",
    },
  } satisfies ChartConfig;

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("desktop");
  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [],
  );

  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with QuotePilot.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {mounted ? currentTime.toLocaleTimeString() : "--:--:--"}
        </div>
      </div>

      {/*Introduction Card*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary/10">
          <CardContent className="p-6 flex flex-colgap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Hi, QuotePilot Admin 👋
              </h2>
              <p className="text-muted-foreground">
                Manage your products, view analytics, and oversee customer
                interactions all in one place.
              </p>
              <Link
                href="mailto:admin@quotepilot.com"
                className="flex items-center gap-3 rounded-lg py-3 font-medium group"
              >
                <Briefcase className="w-5 h-5 flex-shrink-0 text-primary" />
                <span className="truncate">admin@quotepilot.com</span>
              </Link>
            </div>
            <img
              src="https://shadcnuikit.com/images/avatars/01.png"
              alt="Admin Avatar"
              className="h-24 w-24 rounded-full"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Total Door Types"
            value="1,234"
            change="+12%"
            changeType="positive"
            icon={FileText}
            gradient="from-primary/20 via-primary/10 to-transparent"
          />
          <StatsCard
            title="Total Panel Styles"
            value="24"
            change="+3"
            changeType="positive"
            icon={Settings}
            gradient="from-secondary/20 via-secondary/10 to-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Actions */}

        <Card className="py-0">
          <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
              <CardTitle>Interactive Bar Chart</CardTitle>
            </div>
            <div className="flex">
              {["desktop", "mobile"].map((key) => {
                const chart = key as keyof typeof chartConfig;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-muted-foreground text-xs">
                      {chartConfig[chart].label}
                    </span>
                    <span className="text-lg leading-none font-bold sm:text-xl">
                      {total[key as keyof typeof total].toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full border rounded-xl"
            >
              <BarChart accessibilityLayer data={chartData}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Table Box */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              All Lead details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      {invoice.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MiniCalendar />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: any;
  gradient: string;
}) {
  const changeColor =
    changeType === "positive"
      ? "text-primary"
      : changeType === "negative"
        ? "text-red-600"
        : "text-muted-foreground";

  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs ${changeColor} flex items-center gap-1`}>
              {changeType === "positive" && <TrendingUp className="w-3 h-3" />}
              {change}
            </p>
          </div>
          <div className="p-3 bg-background/80 rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
  gradient,
}: {
  title: string;
  description: string;
  href: string;
  icon: any;
  gradient: string;
}) {
  return (
    <Link href={href} className="block group">
      <Card
        className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-0 ${gradient}`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-foreground/70" />
                <h3 className="font-semibold text-lg">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityItem({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time: string;
  type: "quote" | "rule" | "question";
}) {
  const icons = {
    quote: FileText,
    rule: Settings,
    question: HelpCircle,
  };
  const Icon = icons[type];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="p-1.5 bg-primary/10 rounded-md">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground shrink-0">{time}</p>
    </div>
  );
}

function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const days = [];
  const currentDateObj = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDateObj));
    currentDateObj.setDate(currentDateObj.getDate() + 1);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                1,
              ),
            )
          }
          className="p-1 hover:bg-muted rounded"
        >
          ←
        </button>
        <h3 className="font-semibold text-sm">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={() =>
            setCurrentDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1,
              ),
            )
          }
          className="p-1 hover:bg-muted rounded"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={`${day}-${index}`} // ✅ UNIQUE & STABLE
            className="p-2 text-center font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === today.toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`p-2 text-center text-xs rounded hover:bg-muted transition-colors ${
                !isCurrentMonth
                  ? "text-muted-foreground/50"
                  : isToday
                    ? "bg-primary text-primary-foreground"
                    : isSelected
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-muted"
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
