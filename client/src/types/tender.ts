export type TenderStatus = 'active' | 'closing_soon' | 'closed' | 'awarded' | 'cancelled';
export type TenderSource = 'gem' | 'cppp' | 'state_portal' | 'private' | 'international';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Tender {
  id: string;
  title: string;
  description: string;
  organization: string;
  source: TenderSource;
  status: TenderStatus;
  value: number;
  currency: string;
  deadline: string;
  publishedAt: string;
  category: string;
  location: string;
  eligibilityCriteria: string[];
  documents: TenderDocument[];
}

export interface TenderMatch {
  tender: Tender;
  matchScore: number;
  confidenceScore: number;
  riskLevel: RiskLevel;
  matchReasons: string[];
  missingCriteria: string[];
  estimatedEffort: string;
  estimatedCost: number;
  aiExplanation: string;
}

export interface TenderDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface TenderAnalysis {
  tenderId: string;
  eligibilityScore: number;
  financialRisk: RiskLevel;
  technicalQualification: 'qualified' | 'partially_qualified' | 'not_qualified';
  missingRequirements: string[];
  plainEnglishSummary: string;
  clauseAnalysis: ClauseAnalysis[];
}

export interface ClauseAnalysis {
  id: string;
  clause: string;
  explanation: string;
  riskLevel: RiskLevel;
  complianceStatus: 'compliant' | 'non_compliant' | 'needs_review';
}

export interface TenderFilters {
  search: string;
  status: TenderStatus[];
  source: TenderSource[];
  riskLevel: RiskLevel[];
  minValue: number;
  maxValue: number;
  category: string;
  sortBy: 'deadline' | 'value' | 'matchScore' | 'publishedAt';
  sortOrder: 'asc' | 'desc';
}
