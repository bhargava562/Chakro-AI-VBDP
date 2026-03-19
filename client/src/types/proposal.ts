export type ProposalStatus = 'draft' | 'ai_review' | 'pending_approval' | 'approved' | 'submitted' | 'rejected';

export interface Proposal {
  id: string;
  tenderId: string;
  tenderTitle: string;
  title: string;
  content: string;
  status: ProposalStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  complianceScore: number;
  riskScore: number;
  aiSuggestions: AISuggestion[];
  versions: ProposalVersion[];
  approvalChain: ApprovalStep[];
}

export interface ProposalVersion {
  id: string;
  version: number;
  content: string;
  createdAt: string;
  createdBy: string;
  changesSummary: string;
}

export interface AISuggestion {
  id: string;
  type: 'compliance' | 'improvement' | 'risk' | 'missing';
  clause: string;
  suggestion: string;
  explanation: string;
  confidence: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ApprovalStep {
  id: string;
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  timestamp?: string;
}
