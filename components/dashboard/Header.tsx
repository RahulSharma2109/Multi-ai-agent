"use client";

import { RefreshCw, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export default function Header({ onRefresh, isLoading }: HeaderProps) {
  return (
    <header id="dashboard-header" className="relative">
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-500/10 to-cyan-400/10 animate-gradient" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-2xl border border-border/50 glass">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              AI Content Opportunity Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Discover YouTube opportunities before everyone else
            </p>
          </div>
        </div>

        <Button
          id="refresh-button"
          variant="outline"
          size="lg"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2 border-violet-500/30 hover:bg-violet-500/10 hover:border-violet-500/50 transition-all duration-300"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "Analyzing..." : "Refresh"}
        </Button>
      </div>
    </header>
  );
}