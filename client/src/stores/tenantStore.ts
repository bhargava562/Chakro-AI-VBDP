import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantStore {
  tenantId: string | null;
  tenantName: string | null;
  setTenant: (id: string, name: string) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      tenantId: null,
      tenantName: null,
      setTenant: (tenantId, tenantName) => set({ tenantId, tenantName }),
      clearTenant: () => set({ tenantId: null, tenantName: null }),
    }),
    { name: 'chakro-tenant' }
  )
);
