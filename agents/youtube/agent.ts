import { getTrendingVideos } from "./tool";
import type { YouTubeReport } from "@/types";

export async function youtubeAgent(): Promise<YouTubeReport> {
  const videos = await getTrendingVideos();

  return {
    generatedAt: new Date().toISOString(),
    totalVideos: videos.length,
    videos,
  };
}