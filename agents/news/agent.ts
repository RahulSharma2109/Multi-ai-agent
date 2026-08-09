import { getLatestNews } from "./tool";
import type { NewsReport } from "@/types";

export async function newsAgent(): Promise<NewsReport> {
  const articles = await getLatestNews();

  return {
    generatedAt: new Date().toISOString(),
    totalArticles: articles.length,
    articles,
  };
}