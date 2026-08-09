"use client";

import { TrendingUp, Newspaper, Lightbulb } from "lucide-react";

interface StatsProps {
  videos: number;
  news: number;
  opportunities: number;
}

interface StatCardProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
  iconBg: string;
  delay: string;
}

function StatCard({ id, icon, label, value, gradient, iconBg, delay }: StatCardProps) {
  return (
    <div
      id={id}
      className="group relative overflow-hidden rounded-xl border border-border/50 p-5 card-hover animate-float-up"
      style={{ animationDelay: delay }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBg} shadow-lg`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Stats({ videos, news, opportunities }: StatsProps) {
  return (
    <section id="stats-section" className="grid gap-4 sm:grid-cols-3">
      <StatCard
        id="stat-videos"
        icon={<TrendingUp className="h-5 w-5 text-white" />}
        label="Trending Videos"
        value={videos}
        gradient="from-rose-500/5 to-orange-500/5"
        iconBg="bg-gradient-to-br from-rose-500 to-orange-500 shadow-rose-500/25"
        delay="0s"
      />

      <StatCard
        id="stat-news"
        icon={<Newspaper className="h-5 w-5 text-white" />}
        label="Latest News"
        value={news}
        gradient="from-blue-500/5 to-cyan-500/5"
        iconBg="bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/25"
        delay="0.1s"
      />

      <StatCard
        id="stat-opportunities"
        icon={<Lightbulb className="h-5 w-5 text-white" />}
        label="AI Opportunities"
        value={opportunities}
        gradient="from-violet-500/5 to-fuchsia-500/5"
        iconBg="bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-violet-500/25"
        delay="0.2s"
      />
    </section>
  );
}