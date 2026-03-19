import { create } from 'zustand';

interface FeatureFlags {
  [key: string]: boolean;
}

interface FeatureFlagStore {
  flags: FeatureFlags;
  setFlags: (flags: FeatureFlags) => void;
  setFlag: (key: string, value: boolean) => void;
  isEnabled: (key: string) => boolean;
}

const defaultFlags: FeatureFlags = {
  'ai-insights': true,
  'proposal-workspace': true,
  'audit-logs': true,
  'real-time-alerts': true,
  'document-visualizer': true,
  'export-pdf': true,
  'digital-signature': false,
  'sms-notifications': false,
  'advanced-analytics': true,
};

export const useFeatureFlagStore = create<FeatureFlagStore>()((set, get) => ({
  flags: defaultFlags,
  setFlags: (flags) => set({ flags: { ...defaultFlags, ...flags } }),
  setFlag: (key, value) =>
    set((state) => ({ flags: { ...state.flags, [key]: value } })),
  isEnabled: (key) => get().flags[key] ?? false,
}));
