import { ModuleVideoGallery, type GalleryVideo } from "@/components/ModuleVideoGallery";
import { youtubeVideoId } from "@/lib/youtube";

type Props = {
  title?: string;
  lead?: string;
  videos: string[];
};

export function ModuleVideos({ title, lead, videos }: Props) {
  if (!videos.length) return null;

  const items: GalleryVideo[] = videos
    .map((embedUrl, i) => {
      const id = youtubeVideoId(embedUrl);
      if (!id) return null;
      return {
        embedUrl,
        title: `Обучающее видео ${i + 1}`,
      };
    })
    .filter((x): x is GalleryVideo => x != null);

  return <ModuleVideoGallery title={title} lead={lead} items={items} />;
}
