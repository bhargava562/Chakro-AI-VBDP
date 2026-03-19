export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface DashboardStats {
  smeStrengthScore: number;
  activeOpportunities: number;
  deadlinesThisWeek: number;
  aiConfidenceIndex: number;
  totalProposals: number;
  winRate: number;
}

export interface AnalyticsData {
  industryDistribution: { industry: string; count: number; value: number }[];
  winProbabilityTrend: { month: string; probability: number; submitted: number }[];
  tendersBySource: { source: string; count: number }[];
}
