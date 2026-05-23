"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { TextAnalyzerCloudWord } from "@/lib/demo/types";
import {
  layoutSpiralCloud,
  layoutTagCloud,
  normalizeCloudWords,
  weightColorClass,
  type PlacedCloudWord,
} from "@/lib/demo/text-analyzer-spiral-cloud";

const CLOUD_HEIGHT_PX = 400;
const DEFAULT_WORD_LIMIT = 80;

type Props = {
  words: TextAnalyzerCloudWord[];
  wordLimit?: number;
  emptyLabel?: string;
};

type LayoutMode = "spiral" | "tag";

export function TextAnalyzerSpiralCloud({
  words,
  wordLimit = DEFAULT_WORD_LIMIT,
  emptyLabel = "Нет слов для облака",
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const measureHostRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<PlacedCloudWord[]>([]);
  const [mode, setMode] = useState<LayoutMode>("spiral");

  const normalized = useMemo(() => normalizeCloudWords(words, wordLimit), [words, wordLimit]);

  useLayoutEffect(() => {
    if (normalized.length === 0) {
      setPlaced([]);
      return;
    }

    const host = hostRef.current;
    const measureHost = measureHostRef.current;
    if (!host || !measureHost) return;

    const hostW = Math.max(260, host.clientWidth);
    const hostH = CLOUD_HEIGHT_PX;

    const measure = (text: string, fontSizePx: number) => {
      const span = document.createElement("span");
      span.style.position = "absolute";
      span.style.visibility = "hidden";
      span.style.whiteSpace = "nowrap";
      span.style.fontWeight = "500";
      span.style.lineHeight = "1.1";
      span.style.fontSize = `${fontSizePx}px`;
      span.textContent = text;
      measureHost.appendChild(span);
      const rect = { w: span.offsetWidth, h: span.offsetHeight };
      measureHost.removeChild(span);
      return rect;
    };

    try {
      const spiral = layoutSpiralCloud(normalized, hostW, hostH, measure);
      if (spiral.length >= Math.min(8, normalized.length * 0.45)) {
        setMode("spiral");
        setPlaced(spiral);
        return;
      }
    } catch {
      // fallback below
    }

    setMode("tag");
    setPlaced(layoutTagCloud(normalized));
  }, [normalized]);

  if (normalized.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-slate-200 bg-[#f8fafc] px-4 text-center text-sm text-slate-500"
        style={{ height: CLOUD_HEIGHT_PX }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className="relative w-full overflow-hidden rounded-md border border-slate-200 bg-[#f8fafc] px-[1.125rem] py-4"
      style={{ height: CLOUD_HEIGHT_PX, minHeight: CLOUD_HEIGHT_PX, maxHeight: CLOUD_HEIGHT_PX }}
    >
      <div ref={measureHostRef} className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden" aria-hidden />

      {mode === "spiral" ? (
        <div className="relative h-full w-full min-h-full">
          {placed.map((word) => (
            <span
              key={`${word.text}-${word.left}-${word.top}`}
              className={`absolute z-[1] -translate-x-1/2 -translate-y-1/2 cursor-default whitespace-nowrap font-medium leading-[1.1] transition-colors duration-150 hover:z-20 ${weightColorClass(word.weightClass)}`}
              style={{ left: word.left, top: word.top, fontSize: word.fontSizePx }}
              title={word.tip}
            >
              {word.text}
            </span>
          ))}
        </div>
      ) : (
        <div
          className="flex h-full min-h-full flex-wrap content-center items-center justify-center gap-x-[0.65rem] gap-y-[0.35rem] p-4 leading-[1.2]"
        >
          {placed.map((word) => (
            <span
              key={word.text}
              className="cursor-default whitespace-nowrap font-medium text-[#627d98] transition-colors duration-150 hover:text-[#516678]"
              style={{ fontSize: word.fontSizePx }}
              title={word.tip}
            >
              {word.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
