"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Eye, Clock, TrendingUp } from "lucide-react";
import type { YouTubeVideo } from "@/types";
import { formatViews, formatDate } from "@/lib/utils";

interface YoutubeCardProps {
  videos: YouTubeVideo[];
}

function VideoItem({ video, index }: { video: YouTubeVideo; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      id={`video-${video.id}`}
      className="group relative flex gap-4 rounded-xl border border-border/40 p-3 card-hover cursor-pointer animate-float-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative shrink-0 overflow-hidden rounded-lg w-[180px] h-[100px]">
        {video.thumbnail && !imgError ? (
          <Image
            src={video.thumbnail}
            alt={`Thumbnail for ${video.title}`}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-500/20 to-orange-500/20">
            <Play className="h-8 w-8 text-rose-400/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play className="h-4 w-4 text-zinc-900 ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
        <div>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-violet-400 transition-colors duration-200">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {formatViews(video.views)}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {formatDate(video.publishedAt)}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400">
            {video.category}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function YoutubeCard({ videos }: YoutubeCardProps) {
  if (videos.length === 0) {
    return (
      <section id="youtube-section" className="rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500">
            <TrendingUp className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold">Trending YouTube Videos</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          No trending videos available at the moment.
        </p>
      </section>
    );
  }

  return (
    <section id="youtube-section" className="rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/20">
          <TrendingUp className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Trending YouTube Videos</h2>
          <p className="text-xs text-muted-foreground">
            {videos.length} trending videos from YouTube India
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {videos.map((video, index) => (
          <VideoItem key={video.id} video={video} index={index} />
        ))}
      </div>
    </section>
  );
}