import type { Metadata } from "next";
import { TitloHome } from "@/components/home/TitloHome";
import { NEWS_ITEMS } from "@/lib/content/news";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...canonicalMetadata("/"),
};

export default function HomePage() {
  return <TitloHome news={NEWS_ITEMS} />;
}
