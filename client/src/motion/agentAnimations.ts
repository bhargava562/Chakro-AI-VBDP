import type { Variants } from 'framer-motion';

export type AgentType = 'ceo' | 'discovery' | 'security' | 'analysis' | 'response';

export const agentColors: Record<AgentType, string> = {
  ceo: '#6366f1',
  discovery: '#3b82f6',
  security: '#10b981',
  analysis: '#f59e0b',
  response: '#8b5cf6',
};

export const agentPulse: Variants = {
  idle: {
    scale: 1,
    opacity: 0.6,
  },
  active: {
    scale: [1, 1.08, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const agentScan: Variants = {
  idle: { rotate: 0 },
  scanning: {
    rotate: 360,
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const agentShield: Variants = {
  idle: {
    boxShadow: '0 0 0px rgb(16 185 129 / 0)',
  },
  validating: {
    boxShadow: [
      '0 0 0px rgb(16 185 129 / 0)',
      '0 0 20px rgb(16 185 129 / 0.4)',
      '0 0 0px rgb(16 185 129 / 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const agentDataNode: Variants = {
  collapsed: { scale: 0.8, opacity: 0 },
  expanded: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export const agentDraftFlow: Variants = {
  idle: { pathLength: 0, opacity: 0 },
  drafting: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

export const orchestrationPulse: Variants = {
  idle: {
    boxShadow: '0 0 0 0 rgb(99 102 241 / 0)',
  },
  active: {
    boxShadow: [
      '0 0 0 0 rgb(99 102 241 / 0.4)',
      '0 0 0 20px rgb(99 102 241 / 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

export const connectionLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};
