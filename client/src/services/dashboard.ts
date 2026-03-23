import { api } from './api';

export interface DashboardMetrics {
  smeStrengthScore: number;
  activeOpportunities: number;
  deadlinesThisWeek: number;
  aiConfidenceIndex: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  companyName: string;
  role: string;
}

export interface TenderAlert {
  id: string;
  title: string;
  organization: string;
  value: string;
  matchPercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  deadline: string;
  source: string;
}

export const dashboardService = {
  /**
   * Fetch user profile and dashboard metrics
   */
  async getMetrics(): Promise<DashboardMetrics> {
    return api.get<DashboardMetrics>('/dashboard/metrics');
  },

  /**
   * Fetch current user's profile
   */
  async getUserProfile(): Promise<UserProfile> {
    return api.get<UserProfile>('/dashboard/profile');
  },

  /**
   * Fetch active tender opportunities for the user
   */
  async getTenderAlerts(limit = 10): Promise<TenderAlert[]> {
    return api.get<TenderAlert[]>(`/dashboard/tenders?limit=${limit}`);
  },

  /**
   * Fetch user's recent proposals
   */
  async getRecentProposals() {
    return api.get('/dashboard/proposals');
  },

  /**
   * Fetch compliance warnings
   */
  async getComplianceWarnings() {
    return api.get('/dashboard/compliance');
  },

  /**
   * Fetch industry distribution for analytics
   */
  async getIndustryAnalytics() {
    return api.get('/dashboard/industry-analytics');
  },

  /**
   * Fetch win probability trends
   */
  async getWinTrendAnalytics() {
    return api.get('/dashboard/win-trends');
  },
};
