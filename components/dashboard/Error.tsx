"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  message: string;
  onRetry: () => void;
}

export default function Error({ message, onRetry }: ErrorProps) {
  return (
    <div
      id="error-state"
      className="flex flex-col items-center justify-center py-20 gap-6"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>

      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      <Button
        id="retry-button"
        variant="outline"
        onClick={onRetry}
        className="gap-2 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
