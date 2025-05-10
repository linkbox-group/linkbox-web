import { WaterfallItem } from "@/components/WaterfallFlow";

export interface CardItem extends WaterfallItem {
  title: string;
  favoriteTime: string;
  tags: string[];
  tag_names: string[];
  folderPath: string;
  link: string;
}

export interface CreateItemRequest {
  type: number;
  url: string;
  organization_id: string;
  title: string;
  description: string;
  note: string;
}
