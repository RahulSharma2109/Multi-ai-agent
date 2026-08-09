"use client";

import {
  Lightbulb,
  Target,
  Eye,
  Gauge,
  Tag,
  ArrowUpRight,
} from "lucide-react";
import type { Opportunity } from "@/types";
import { getDifficultyColor, getScoreBg, getScoreColor } from "@/lib/utils";

interface OpportunityCardProps {
  opportunities: Opportunity[];
}

function OpportunityItem({
  opportunity,
  index,
}: {
  opportunity: Opportunity;
  index: number;
}) {
  const keywords = opportunity.keywords ?? [];

  return (
    <div
      id={`opportunity-${index}`}
      className="group relative overflow-hidden rounded-xl border border-border/40 p-5 card-hover animate-float-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8">
        <div
          className={`h-full w-full rounded-full ${
            opportunity.score >= 80
              ? "bg-emerald-500/10"
              : opportunity.score >= 60
              ? "bg-amber-500/10"
              : "bg-red-500/10"
          } blur-2xl`}
        />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-sm leading-snug flex-1 group-hover:text-fuchsia-400 transition-colors duration-200">
            {opportunity.title}
          </h3>

          <div
            className={`flex items-center gap-1 shrink-0 rounded-lg border px-2.5 py-1 text-xs font-bold ${getScoreBg(
              opportunity.score
            )} ${getScoreColor(opportunity.score)}`}
            aria-label={`Opportunity score: ${opportunity.score}`}
          >
            <Gauge className="h-3 w-3" aria-hidden="true" />
            {opportunity.score}
          </div>
        </div>

        {opportunity.description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {opportunity.description}
          </p>
        )}

        {opportunity.reason && (
          <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/10">
            <Target className="h-3.5 w-3.5 text-violet-400 shrink-0" aria-hidden="true" />
            <p className="text-xs text-violet-300/80 leading-relaxed">
              {opportunity.reason}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${getDifficultyColor(
              opportunity.difficulty
            )}`}
          >
            <ArrowUpRight className="h-2.5 w-2.5" aria-hidden="true" />
            {opportunity.difficulty}
          </span>

          {opportunity.estimatedViews && (
            <span className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
              <Eye className="h-2.5 w-2.5" aria-hidden="true" />
              {opportunity.estimatedViews} views
            </span>
          )}
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((keyword, i) => (
              <span
                key={`${keyword}-${i}`}
                className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground border border-border/50"
              >
                <Tag className="h-2.5 w-2.5" aria-hidden="true" />
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OpportunityCard({
  opportunities,
}: OpportunityCardProps) {
  if (opportunities.length === 0) {
    return (
      <section id="opportunity-section" className="rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Lightbulb className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold">AI Content Opportunities</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          No content opportunities were generated yet. Try refreshing the dashboard.
        </p>
      </section>
    );
  }

  return (
    <section id="opportunity-section" className="rounded-xl border border-border/50 p-6 animate-pulse-glow">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
          <Lightbulb className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">AI Content Opportunities</h2>
          <p className="text-xs text-muted-foreground">
            {opportunities.length} opportunities discovered by AI analysis
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity, index) => (
          <OpportunityItem
            key={`${opportunity.title}-${index}`}
            opportunity={opportunity}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}