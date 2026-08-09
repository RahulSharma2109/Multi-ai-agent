import axios, { AxiosError } from "axios";
import type {
  YouTubeVideo,
  YouTubeApiResponse,
  YouTubeApiItem,
} from "@/types";
import { YOUTUBE_CATEGORIES } from "@/types";

const API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos";

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 2000;
const REQUEST_TIMEOUT = 10_000;

function getRetryDelay(attempt: number, isRateLimit: boolean): number {
  if (isRateLimit) {
    // Longer backoff for 429 — don't make it worse
    return BASE_DELAY_MS * Math.pow(3, attempt);
  }
  return BASE_DELAY_MS * Math.pow(2, attempt);
}

async function fetchWithRetry(attempt: number = 0): Promise<YouTubeApiResponse> {
  try {
    const { data } = await axios.get<YouTubeApiResponse>(YOUTUBE_API_URL, {
      params: {
        part: "snippet,statistics",
        chart: "mostPopular",
        regionCode: "IN",
        maxResults: 10,
        key: API_KEY,
      },
      timeout: REQUEST_TIMEOUT,
    });

    if (!data || !Array.isArray(data.items)) {
      throw new Error("YouTube API returned invalid response structure");
    }

    return data;
  } catch (error) {
    const isRateLimit =
      error instanceof AxiosError && error.response?.status === 429;

    if (attempt < MAX_RETRIES) {
      const delay = getRetryDelay(attempt, isRateLimit);
      console.warn(
        `[YouTube Tool] ${isRateLimit ? "Rate limited" : "Failed"} (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay / 1000}s...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(attempt + 1);
    }
    throw error;
  }
}

function mapVideoItem(item: YouTubeApiItem): YouTubeVideo {
  const thumbnailUrl =
    item.snippet.thumbnails?.high?.url ??
    item.snippet.thumbnails?.default?.url ??
    "";

  return {
    id: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    views: Number(item.statistics?.viewCount ?? 0),
    category: YOUTUBE_CATEGORIES[item.snippet.categoryId] ?? "Other",
    thumbnail: thumbnailUrl,
    url: `https://www.youtube.com/watch?v=${item.id}`,
  };
}

export async function getTrendingVideos(): Promise<YouTubeVideo[]> {
  if (!API_KEY) {
    console.error("[YouTube Tool] YOUTUBE_API_KEY is not configured");
    return [];
  }

  try {
    const data = await fetchWithRetry();
    return data.items.map(mapVideoItem);
  } catch (error) {
    console.error("[YouTube Tool] Failed to fetch trending videos:", error);
    return [];
  }
}