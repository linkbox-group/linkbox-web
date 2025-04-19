import { WaterfallItem } from "@/components/Slidebar/WaterfallFlow";

export interface CardItem extends WaterfallItem {
  title: string;
  favoriteTime: string;
  tags: string[];
  folderPath: string;
  link: string;
}
