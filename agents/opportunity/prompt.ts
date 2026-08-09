import type { YouTubeReport, NewsReport } from "@/types";

export function opportunityPrompt(
  youtubeReport: YouTubeReport,
  newsReport: NewsReport
): string {
  return `You are an expert AI Content Strategist.

You have access to two datasets of current trending content.

=========================================
TRENDING YOUTUBE VIDEOS
=========================================

${JSON.stringify(youtubeReport.videos, null, 2)}

=========================================
LATEST NEWS ARTICLES
=========================================

${JSON.stringify(newsReport.articles, null, 2)}

Your task:
1. Compare BOTH datasets.
2. Discover content opportunities — news stories or trending topics that are NOT yet well represented on YouTube.
3. For each opportunity, provide actionable insights.

RULES:
- Return ONLY valid JSON. No markdown. No text before or after the JSON.
- Generate between 3 and 8 opportunities.
- Each opportunity must follow this exact schema:

{
  "opportunities": [
    {
      "title": "string - a compelling content title",
      "description": "string - brief explanation of the opportunity",
      "reason": "string - why this is an opportunity now",
      "difficulty": "Easy" | "Medium" | "Hard",
      "score": number between 0 and 100,
      "estimatedViews": "string - estimated view range like '50K-200K'",
      "keywords": ["string array of 3-5 relevant keywords"]
    }
  ]
}

Return ONLY the JSON object. Nothing else.`;
}