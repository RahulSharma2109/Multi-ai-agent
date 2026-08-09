"use client";

import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div id="loading-state" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="rounded-2xl border border-border/50 p-6 glass">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-2">
            <div className="h-7 w-72 rounded-lg animate-shimmer" />
            <div className="h-4 w-56 rounded-md animate-shimmer" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 p-5"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg animate-shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded-md animate-shimmer" />
                <div className="h-8 w-12 rounded-md animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-lg animate-shimmer" />
          <div className="space-y-1.5">
            <div className="h-5 w-48 rounded-md animate-shimmer" />
            <div className="h-3 w-36 rounded-md animate-shimmer" />
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 rounded-xl border border-border/40 p-3">
              <div className="w-[180px] h-[100px] rounded-lg animate-shimmer shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-full rounded-md animate-shimmer" />
                <div className="h-4 w-3/4 rounded-md animate-shimmer" />
                <div className="h-3 w-24 rounded-md animate-shimmer" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-14 rounded-md animate-shimmer" />
                  <div className="h-5 w-14 rounded-md animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-lg animate-shimmer" />
          <div className="space-y-1.5">
            <div className="h-5 w-32 rounded-md animate-shimmer" />
            <div className="h-3 w-44 rounded-md animate-shimmer" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border/40 overflow-hidden">
              <div className="h-[160px] w-full animate-shimmer" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-full rounded-md animate-shimmer" />
                <div className="h-4 w-2/3 rounded-md animate-shimmer" />
                <div className="h-3 w-full rounded-md animate-shimmer" />
                <div className="h-3 w-20 rounded-md animate-shimmer mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
          <span>AI agents are analyzing content opportunities...</span>
        </div>
        <p className="text-xs text-muted-foreground/60">
          This may take 10-20 seconds on the first load
        </p>
      </div>
    </div>
  );
}
