import { TitloHome } from "@/components/home/TitloHome";
import { NEWS_ITEMS } from "@/lib/content/news";

export default function HomePage() {
  return <TitloHome news={NEWS_ITEMS} />;
}
