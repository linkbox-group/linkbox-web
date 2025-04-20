import { api } from './api';

/**
 * 项目类型
 */
export type ItemType = 'text' | 'image' | 'link' | 'all';

/**
 * 排序字段
 */
export type SortField = 'createdAt' | 'updatedAt' | 'title';

/**
 * 排序顺序
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 搜索结果项
 */
export interface SearchResultItem {
  id: string;
  type: ItemType;
  title: string;
  content?: string;
  url?: string;
  matchField: string;
  matchContent: string;
  thumbnailUrl?: string;
  collections: Array<{ id: string; name: string }>;
  createdAt: string;
}

/**
 * 分页信息
 */
export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * 搜索元数据
 */
export interface SearchMetadata {
  timeUsed: number;
  suggestionTags: Array<{ id: string; name: string; count: number }>;
}

/**
 * 全局搜索请求参数
 */
export interface GlobalSearchRequest {
  keyword: string;
  type?: ItemType;
  collectionId?: string;
  tagIds?: string[];
  sortBy?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

/**
 * 全局搜索响应
 */
export interface GlobalSearchResponse {
  msg: string;
  code: number;
  data: {
    items: SearchResultItem[];
    pagination: Pagination;
    searchMetadata: SearchMetadata;
  };
}

/**
 * AI 智能推荐标签请求参数
 */
export interface SuggestTagsRequest {
  content: string;
  url?: string;
  title?: string;
}

/**
 * 推荐的标签
 */
export interface SuggestedTag {
  name: string;
  confidence: number;
  exists: boolean;
  id?: string;
}

/**
 * AI 智能推荐标签响应
 */
export interface SuggestTagsResponse {
  msg: string;
  code: number;
  data: {
    suggestedTags: SuggestedTag[];
  };
}

/**
 * 统计周期
 */
export type StatPeriod = 'day' | 'week' | 'month' | 'year';

/**
 * 分组方式
 */
export type GroupBy = 'day' | 'week' | 'month';

/**
 * 收藏夹统计
 */
export interface CollectionStats {
  total: number;
  newCount: number;
  mostUsed: Array<{ id: number; name: string; useCount: number }>;
}

/**
 * 项目统计
 */
export interface ItemStats {
  total: number;
  newCount: number;
  byType: {
    text: number;
    image: number;
    link: number;
  };
}

/**
 * 标签统计
 */
export interface TagStats {
  total: number;
  newCount: number;
  mostUsed: Array<{ id: number; name: string; useCount: number }>;
}

/**
 * 活动统计
 */
export interface ActivityStats {
  totalActions: number;
  searchCount: number;
  viewCount: number;
  editCount: number;
  shareCount: number;
}

/**
 * 统计周期信息
 */
export interface PeriodInfo {
  start: string;
  end: string;
}

/**
 * 用户使用情况统计响应
 */
export interface UsageStatsResponse {
  collections: CollectionStats;
  items: ItemStats;
  tags: TagStats;
  activity: ActivityStats;
  period: PeriodInfo;
}

/**
 * 用户行为数据响应
 */
export interface BehaviorStatsResponse {
  timePoints: string[];
  metrics: {
    newItems: number[];
    searches: number[];
    logins: number[];
    shares: number[];
  };
}

/**
 * 搜索和统计服务
 */
export const searchService = {
  /**
   * 全局搜索
   * @param params 搜索参数
   * @returns 搜索结果
   */
  globalSearch: async (params: GlobalSearchRequest): Promise<GlobalSearchResponse> => {
    return api.get<GlobalSearchResponse>('/search', { params });
  },

  /**
   * AI 智能推荐标签
   * @param data 推荐参数
   * @returns 推荐的标签
   */
  suggestTags: async (data: SuggestTagsRequest): Promise<SuggestTagsResponse> => {
    return api.post<SuggestTagsResponse>('/ai/suggest-tags', data);
  },

  /**
   * 获取用户使用情况统计
   * @param period 统计周期
   * @returns 使用情况统计
   */
  getUsageStats: async (period: StatPeriod): Promise<UsageStatsResponse> => {
    return api.get<UsageStatsResponse>('/stats/usage', { params: { period } });
  },

  /**
   * 获取用户行为数据
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @param groupBy 分组方式
   * @returns 用户行为数据
   */
  getBehaviorStats: async (
    startDate: string,
    endDate: string,
    groupBy: GroupBy
  ): Promise<BehaviorStatsResponse> => {
    return api.get<BehaviorStatsResponse>('/stats/behavior', {
      params: { startDate, endDate, groupBy }
    });
  }
}; 