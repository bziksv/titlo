"use client";

import { useState } from "react";
import {
  youtubeEmbedUrl,
  youtubeThumbUrl,
  youtubeVideoId,
  youtubeWatchUrl,
} from "@/lib/youtube";

export type GalleryVideo = {
  embedUrl: string;
  title: string;
  description?: string;
};

type Props = {
  title?: string;
  lead?: string;
  items: GalleryVideo[];
};

function PlayIcon() {
  return (
    <svg className="h-14 w-14 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function ModuleVideoGallery({
  title = "Обучающие видео",
  lead,
  items,
}: Props) {
  const parsed = items
    .map((item) => {
      const id = youtubeVideoId(item.embedUrl);
      return id ? { ...item, id } : null;
    })
    .filter((x): x is GalleryVideo & { id: string } => x != null);

  const [activeId, setActiveId] = useState(parsed[0]?.id ?? "");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const active = parsed.find((v) => v.id === activeId) ?? parsed[0];

  if (!parsed.length || !active) return null;

  const showEmbed = playingId === active.id;

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {lead && <p className="mt-2 max-w-2xl text-slate-600">{lead}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-lg ring-1 ring-slate-200">
            <div className="relative aspect-video w-full">
              {showEmbed ? (
                <iframe
                  key={active.id}
                  src={youtubeEmbedUrl(active.id)}
                  title={active.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayingId(active.id)}
                  className="group absolute inset-0 flex h-full w-full items-center justify-center bg-slate-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={youtubeThumbUrl(active.id)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    width={480}
                    height={360}
                  />
                  <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/20" aria-hidden />
                  <PlayIcon />
                  <span className="sr-only">Воспроизвести: {active.title}</span>
                </button>
              )}
            </div>
            <div className="border-t border-slate-700/50 bg-slate-800 px-4 py-3 text-white sm:px-5 sm:py-4">
              <p className="font-semibold">{active.title}</p>
              {active.description && (
                <p className="mt-1 text-sm text-slate-300">{active.description}</p>
              )}
            </div>
          </div>
          <a
            href={youtubeWatchUrl(active.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Открыть на YouTube ↗
          </a>
        </div>

        <ul className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {parsed.map((video) => {
            const isActive = video.id === active.id;
            return (
              <li key={video.id} className="w-[min(100%,240px)] shrink-0 lg:w-full">
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(video.id);
                    if (playingId !== null && playingId !== video.id) {
                      setPlayingId(null);
                    }
                  }}
                  className={`flex w-full gap-3 rounded-xl border p-2 text-left transition ${
                    isActive
                      ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200"
                      : "border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="relative block h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={youtubeThumbUrl(video.id)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={112}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-black/25 text-white"
                      aria-hidden
                    >
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                  <span className="min-w-0 py-0.5">
                    <span className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {video.title}
                    </span>
                    {video.description && (
                      <span className="mt-1 line-clamp-2 hidden text-xs text-slate-500 sm:block">
                        {video.description}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
