export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  views: number;
  thumbnail: string;
  category: string;
  publishedAt: string;
  url: string;
}

export interface YouTubeReport {
  generatedAt: string;
  totalVideos: number;
  videos: YouTubeVideo[];
}

export interface NewsArticle {
  title: string;
  description: string;
  source: string;
  image: string;
  url: string;
  publishedAt: string;
}

export interface NewsReport {
  generatedAt: string;
  totalArticles: number;
  articles: NewsArticle[];
}

export interface Opportunity {
  title: string;
  description: string;
  reason: string;
  difficulty: "Easy" | "Medium" | "Hard";
  score: number;
  estimatedViews: string;
  keywords: string[];
}

export interface OpportunityReport {
  generatedAt: string;
  opportunities: Opportunity[];
}

export interface DashboardData {
  youtube: YouTubeReport;
  news: NewsReport;
  opportunity: OpportunityReport;
}

export interface YouTubeApiItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    categoryId: string;
    thumbnails: {
      default?: {
        url: string;
      };
      high?: {
        url: string;
      };
    };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
  };
}

export interface YouTubeApiResponse {
  items: YouTubeApiItem[];
}

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  source: {
    name: string;
    url: string;
  };
  url: string;
  image: string;
  publishedAt: string;
}

export interface GNewsApiResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

export interface CurrentsApiArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  author: string | null;
  image: string | null;
  language: string;
  category: string[];
  published: string;
}

export interface CurrentsApiResponse {
  status: string;
  news: CurrentsApiArticle[];
  page: number;
}

export const YOUTUBE_CATEGORIES: Record<string, string> = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "18": "Short Movies",
  "19": "Travel & Events",
  "20": "Gaming",
  "21": "Videoblogging",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism",
  "30": "Movies",
  "31": "Anime/Animation",
  "32": "Action/Adventure",
  "33": "Classics",
  "34": "Comedy",
  "35": "Documentary",
  "36": "Drama",
  "37": "Family",
  "38": "Foreign",
  "39": "Horror",
  "40": "Sci-Fi/Fantasy",
  "41": "Thriller",
  "42": "Shorts",
  "43": "Shows",
  "44": "Trailers",
};
