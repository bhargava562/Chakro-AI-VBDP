export type AgentType = 'ceo' | 'discovery' | 'security' | 'analysis' | 'response';
export type AgentStatus = 'idle' | 'active' | 'processing' | 'completed' | 'error';

export interface AgentActivity {
  agentType: AgentType;
  status: AgentStatus;
  currentTask: string;
  progress: number;
  lastUpdated: string;
  metadata?: Record<string, unknown>;
}

export interface AgentEvent {
  id: string;
  agentType: AgentType;
  event: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export const agentLabels: Record<AgentType, string> = {
  ceo: 'CEO Orchestrator',
  discovery: 'Discovery Agent',
  security: 'Security Agent',
  analysis: 'Analysis Agent',
  response: 'Response Agent',
};

export const agentDescriptions: Record<AgentType, string> = {
  ceo: 'Coordinates all agents and manages strategic decisions',
  discovery: 'Scans 500+ portals for matching tender opportunities',
  security: 'Validates domains, detects fraud, and ensures compliance',
  analysis: 'Deconstructs tender documents using RAG-based analysis',
  response: 'Drafts proposals with human-in-the-loop approval',
};
