"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Stats from "./Stats";
import YoutubeCard from "./YoutubeCard";
import NewsCard from "./NewsCard";
import OpportunityCard from "./OpportunityCard";
import Loading from "./Loading";
import Error from "./Error";
import { getDashboardData } from "@/lib/api";
import type { DashboardData } from "@/types";

/** Map raw API errors to user-friendly messages. */
function toUserFriendlyError(err: unknown): string {
  if (err instanceof globalThis.Error) {
    const msg = err.message;
    if (msg.includes("Dashboard API error")) {
      return "Unable to reach the dashboard service. Please try again in a moment.";
    }
    if (msg.includes("Failed to fetch")) {
      return "Network error — please check your connection and try again.";
    }
    return "Something went wrong while loading the dashboard. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch — runs once on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const dashboard = await getDashboardData(false);
        if (!cancelled) setData(dashboard);
      } catch (err) {
        if (!cancelled) setError(toUserFriendlyError(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Manual refresh handler — triggered by user action, not by an effect
  async function fetchDashboard(forceRefresh: boolean) {
    setIsLoading(true);
    setError(null);

    try {
      const dashboard = await getDashboardData(forceRefresh);
      setData(dashboard);
    } catch (err) {
      setError(toUserFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !data) {
    return <Loading />;
  }

  if (error && !data) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={() => fetchDashboard(true)} />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main
      id="dashboard"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
    >
      <Header onRefresh={() => fetchDashboard(true)} isLoading={isLoading} />

      <Stats
        videos={data.youtube.totalVideos}
        news={data.news.totalArticles}
        opportunities={data.opportunity.opportunities.length}
      />

      <YoutubeCard videos={data.youtube.videos} />

      <NewsCard articles={data.news.articles} />

      <OpportunityCard opportunities={data.opportunity.opportunities} />

      <footer className="text-center py-6 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          Powered by Multi-Agent AI Architecture • YouTube Data API • GNews API
          • Gemini AI
        </p>
      </footer>
    </main>
  );
}