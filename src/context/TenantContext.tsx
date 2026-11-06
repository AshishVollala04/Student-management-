/**
 * FutureSchool - Multi-Tenant SaaS Context
 * Manages active tenant isolation, school profiles, and subscription entitlements
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SchoolTenant, TenantStatus } from '../types/tenant';
import { INITIAL_TENANTS } from '../mock/tenants';

const TENANT_STORAGE_KEY = 'futureschool_active_tenant_id';
const TENANTS_LIST_STORAGE_KEY = 'futureschool_all_tenants_v1';

interface TenantContextType {
  currentTenant: SchoolTenant;
  activeTenant: SchoolTenant;
  allTenants: SchoolTenant[];
  switchTenant: (tenantId: string) => void;
  updateTenantStatus: (tenantId: string, status: TenantStatus) => void;
  registerNewTenant: (tenant: Omit<SchoolTenant, 'id' | 'status' | 'onboardedAt'>) => SchoolTenant;
  isCapacityExceeded: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allTenants, setAllTenants] = useState<SchoolTenant[]>(() => {
    try {
      const stored = localStorage.getItem(TENANTS_LIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(TENANT_STORAGE_KEY);
      return stored || 'GVS';
    } catch {
      return 'GVS';
    }
  });

  const currentTenant = allTenants.find(t => t.id === activeTenantId) || allTenants[0];

  useEffect(() => {
    try {
      localStorage.setItem(TENANTS_LIST_STORAGE_KEY, JSON.stringify(allTenants));
    } catch (e) {
      console.error('Failed to save tenants list', e);
    }
  }, [allTenants]);

  const switchTenant = (tenantId: string) => {
    const exists = allTenants.some(t => t.id === tenantId);
    if (exists) {
      setActiveTenantId(tenantId);
      localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
    }
  };

  const updateTenantStatus = (tenantId: string, status: TenantStatus) => {
    setAllTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        return {
          ...t,
          status,
          verifiedAt: status === 'ACTIVE' && !t.verifiedAt ? new Date().toISOString().split('T')[0] : t.verifiedAt
        };
      }
      return t;
    }));
  };

  const registerNewTenant = (data: Omit<SchoolTenant, 'id' | 'status' | 'onboardedAt'>): SchoolTenant => {
    const newId = `SCH-${Date.now().toString().slice(-4)}`;
    const newTenant: SchoolTenant = {
      ...data,
      id: newId,
      status: 'PENDING_VERIFICATION',
      onboardedAt: new Date().toISOString().split('T')[0]
    };
    setAllTenants(prev => [newTenant, ...prev]);
    return newTenant;
  };

  const isCapacityExceeded = currentTenant.currentEnrolledStudents >= currentTenant.capacityLimit;

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        activeTenant: currentTenant,
        allTenants,
        switchTenant,
        updateTenantStatus,
        registerNewTenant,
        isCapacityExceeded
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
