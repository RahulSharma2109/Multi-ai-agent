import { youtubeAgent } from "../youtube/agent";
import { newsAgent } from "../news/agent";
import { opportunityAgent } from "../opportunity/agent";
import type {
  DashboardData,
  YouTubeReport,
  NewsReport,
} from "@/types";

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

interface CacheEntry {
  data: DashboardData;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let cache: CacheEntry | null = null;

function isCacheValid(): boolean {
  if (!cache) return false;
  return Date.now() - cache.timestamp < CACHE_TTL_MS;
}

// ---------------------------------------------------------------------------
// Empty report factories
// ---------------------------------------------------------------------------

function emptyYouTubeReport(): YouTubeReport {
  return { generatedAt: new Date().toISOString(), totalVideos: 0, videos: [] };
}

function emptyNewsReport(): NewsReport {
  return { generatedAt: new Date().toISOString(), totalArticles: 0, articles: [] };
}

// ---------------------------------------------------------------------------
// Agent Manager
// ---------------------------------------------------------------------------

export const agentManager = {
  async dashboard(): Promise<DashboardData> {
    if (isCacheValid() && cache) {
      console.log("[Manager] Returning cached dashboard data");
      return cache.data;
    }

    console.log("[Manager] Fetching fresh dashboard data...");

    // Fetch YouTube and News in parallel — each agent already returns safe
    // fallbacks internally, but we add an outer safety net so one failure
    // never prevents the other from being used.
    const [youtube, news] = await Promise.all([
      youtubeAgent().catch((error) => {
        console.error("[Manager] YouTube agent failed:", error);
        return emptyYouTubeReport();
      }),
      newsAgent().catch((error) => {
        console.error("[Manager] News agent failed:", error);
        return emptyNewsReport();
      }),
    ]);

    const opportunity = await opportunityAgent(youtube, news);

    const data: DashboardData = {
      youtube,
      news,
      opportunity,
    };

    cache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  },

  clearCache(): void {
    cache = null;
    console.log("[Manager] Cache cleared");
  },
};