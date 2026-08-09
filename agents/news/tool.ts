import axios, { AxiosError } from "axios";
import type {
  NewsArticle,
  CurrentsApiResponse,
  CurrentsApiArticle,
  GNewsApiResponse,
  GNewsArticle,
} from "@/types";

// ---------------------------------------------------------------------------
// Provider config
// ---------------------------------------------------------------------------

const CURRENTS_API_KEY = process.env.CURRENTS_API_KEY;
const CURRENTS_API_URL = "https://api.currentsapi.services/v1/latest-news";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_API_URL = "https://gnews.io/api/v4/top-headlines";

const REQUEST_TIMEOUT = 10_000;
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 2000;

function getRetryDelay(attempt: number, isRateLimit: boolean): number {
  if (isRateLimit) {
    return BASE_DELAY_MS * Math.pow(3, attempt);
  }
  return BASE_DELAY_MS * Math.pow(2, attempt);
}

function parseRetryAfter(error: AxiosError): number | null {
  const retryAfter = error.response?.headers?.["retry-after"];
  if (typeof retryAfter === "string") {
    const seconds = parseInt(retryAfter, 10);
    if (!isNaN(seconds) && seconds > 0 && seconds <= 120) {
      return seconds * 1000;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Currents API — primary provider
// ---------------------------------------------------------------------------

function mapCurrentsArticle(article: CurrentsApiArticle): NewsArticle {
  return {
    title: article.title,
    description: article.description,
    source: article.author ?? "Unknown",
    url: article.url,
    image: article.image ?? "",
    publishedAt: article.published,
  };
}

async function fetchCurrents(attempt: number = 0): Promise<NewsArticle[]> {
  if (!CURRENTS_API_KEY) {
    console.warn("[News Tool] CURRENTS_API_KEY is missing, skipping Currents provider");
    return [];
  }

  try {
    const { data } = await axios.get<CurrentsApiResponse>(CURRENTS_API_URL, {
      params: {
        language: "en",
        page_size: 10,
      },
      headers: {
        Authorization: CURRENTS_API_KEY,
      },
      timeout: REQUEST_TIMEOUT,
    });

    if (data.status !== "ok" || !Array.isArray(data.news)) {
      throw new Error(`Currents API returned status: ${data.status}`);
    }

    return data.news.map(mapCurrentsArticle);
  } catch (error) {
    const isRateLimit =
      error instanceof AxiosError && error.response?.status === 429;

    if (attempt < MAX_RETRIES) {
      const retryAfterMs =
        error instanceof AxiosError ? parseRetryAfter(error) : null;
      const delay = retryAfterMs ?? getRetryDelay(attempt, isRateLimit);

      console.warn(
        `[News Tool] Currents API ${isRateLimit ? "rate limited" : "failed"} (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay / 1000}s...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchCurrents(attempt + 1);
    }
    console.error("[News Tool] Currents API failed after retries:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// GNews API — fallback provider
// ---------------------------------------------------------------------------

function mapGNewsArticle(article: GNewsArticle): NewsArticle {
  return {
    title: article.title,
    description: article.description,
    source: article.source.name,
    url: article.url,
    image: article.image,
    publishedAt: article.publishedAt,
  };
}

async function fetchGNews(attempt: number = 0): Promise<NewsArticle[]> {
  if (!GNEWS_API_KEY) {
    console.warn("[News Tool] GNEWS_API_KEY is missing, skipping GNews fallback");
    return [];
  }

  try {
    const { data } = await axios.get<GNewsApiResponse>(GNEWS_API_URL, {
      params: {
        country: "in",
        lang: "en",
        max: 10,
        token: GNEWS_API_KEY,
      },
      timeout: REQUEST_TIMEOUT,
    });

    if (!data || !Array.isArray(data.articles)) {
      throw new Error("GNews API returned invalid response structure");
    }

    return data.articles.map(mapGNewsArticle);
  } catch (error) {
    const isRateLimit =
      error instanceof AxiosError && error.response?.status === 429;

    if (attempt < MAX_RETRIES) {
      const retryAfterMs =
        error instanceof AxiosError ? parseRetryAfter(error) : null;
      const delay = retryAfterMs ?? getRetryDelay(attempt, isRateLimit);

      console.warn(
        `[News Tool] GNews API ${isRateLimit ? "rate limited" : "failed"} (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay / 1000}s...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchGNews(attempt + 1);
    }
    console.error("[News Tool] GNews API failed after retries:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Public API — primary → fallback, never throws
// ---------------------------------------------------------------------------

export async function getLatestNews(): Promise<NewsArticle[]> {
  try {
    // Try Currents API first
    const articles = await fetchCurrents();
    if (articles.length > 0) {
      console.log(`[News Tool] Currents API returned ${articles.length} articles`);
      return articles;
    }

    // Fallback to GNews
    console.warn("[News Tool] Currents returned 0 articles, falling back to GNews...");
    const fallbackArticles = await fetchGNews();
    if (fallbackArticles.length > 0) {
      console.log(`[News Tool] GNews fallback returned ${fallbackArticles.length} articles`);
      return fallbackArticles;
    }

    console.error("[News Tool] All providers returned 0 articles");
    return [];
  } catch (error) {
    console.error("[News Tool] Unexpected error in getLatestNews:", error);
    return [];
  }
}