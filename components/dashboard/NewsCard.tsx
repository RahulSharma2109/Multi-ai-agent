"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Clock, Newspaper } from "lucide-react";
import type { NewsArticle } from "@/types";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  articles: NewsArticle[];
}

function ArticleItem({
  article,
  index,
}: {
  article: NewsArticle;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = article.image && !imgError;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      id={`news-${index}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/40 card-hover cursor-pointer animate-float-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative h-[160px] w-full overflow-hidden">
        {hasImage ? (
          <Image
            src={article.image}
            alt={`Image for ${article.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
            <Newspaper className="h-10 w-10 text-blue-400/50" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            {article.source}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors duration-200">
            {article.title}
          </h3>
          {article.description && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {article.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {formatDate(article.publishedAt)}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Read more
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function NewsCard({ articles }: NewsCardProps) {
  if (articles.length === 0) {
    return (
      <section id="news-section" className="rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Newspaper className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold">Latest News</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          News data is temporarily unavailable.
        </p>
      </section>
    );
  }

  return (
    <section id="news-section" className="rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
          <Newspaper className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Latest News</h2>
          <p className="text-xs text-muted-foreground">
            {articles.length} breaking stories from around the world
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <ArticleItem
            key={`${article.url}-${index}`}
            article={article}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}