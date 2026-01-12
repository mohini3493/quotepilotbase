"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  HelpCircle,
  Settings,
  FileText,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  Activity,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Quotes"
          value="1,234"
          change="+12%"
          changeType="positive"
          icon={FileText}
          gradient="from-primary/20 via-primary/10 to-transparent"
        />
        <StatsCard
          title="Active Rules"
          value="24"
          change="+3"
          changeType="positive"
          icon={Settings}
          gradient="from-secondary/20 via-secondary/10 to-transparent"
        />
        <StatsCard
          title="Questions"
          value="18"
          change="2 new"
          changeType="neutral"
          icon={HelpCircle}
          gradient="from-accent/20 via-accent/10 to-transparent"
        />
        <StatsCard
          title="Avg. Response"
          value="2.3s"
          change="-0.5s"
          changeType="positive"
          icon={Activity}
          gradient="from-muted/20 via-muted/10 to-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardCard
                  title="Questions"
                  description="Manage quote questions and form fields"
                  href="/admin/questions"
                  icon={HelpCircle}
                  gradient="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
                />
                <DashboardCard
                  title="Rules"
                  description="Configure pricing logic and conditions"
                  href="/admin/rules"
                  icon={Settings}
                  gradient="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  title="New quote generated"
                  description="Quote #1234 for construction project"
                  time="2 minutes ago"
                  type="quote"
                />
                <ActivityItem
                  title="Rule updated"
                  description="Modified pricing rule for material costs"
                  time="1 hour ago"
                  type="rule"
                />
                <ActivityItem
                  title="Question added"
                  description="Added new field for project timeline"
                  time="3 hours ago"
                  type="question"
                />
              </div>
            </CardContent>
          </Card>
        </div>

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

          {/* Coming Soon Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Quote Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed insights and reporting coming soon
              </p>
              <div className="text-xs text-muted-foreground">
                Coming in v2.0
              </div>
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
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
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
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
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
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
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
