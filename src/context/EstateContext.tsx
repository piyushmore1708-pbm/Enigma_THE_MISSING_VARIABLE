'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { EstateState, DemoPersona, PlaybookTask, EstateAsset, EstateLiability, RequiredDocument, DocumentStatus } from '@/lib/types/estate';
import { DEFAULT_INITIAL_STATE } from '@/lib/store/defaultState';

interface EstateContextType {
  state: EstateState;
  personas: DemoPersona[];
  isLoading: boolean;
  isSaving: boolean;
  activePersonaId: string | null;
  refresh: () => Promise<void>;
  saveState: (newState: EstateState) => Promise<void>;
  loadPersona: (personaId: string) => Promise<void>;
  resetState: () => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  toggleDocument: (docId: string) => Promise<void>;
  updateDocumentStatus: (docId: string, status: DocumentStatus) => Promise<void>;
  syncDynamicChecklist: () => Promise<void>;
  user: { name: string; emailOrPhone: string; role: string; isAuthenticated: boolean } | null;
  loginUser: (user: { name: string; emailOrPhone: string; role?: string }) => void;
  logoutUser: () => void;
  addAsset: (asset: Omit<EstateAsset, 'id'>) => Promise<void>;
  updateAsset: (assetId: string, updates: Partial<EstateAsset>) => Promise<void>;
  removeAsset: (assetId: string) => Promise<void>;
  addLiability: (liability: Omit<EstateLiability, 'id'>) => Promise<void>;
  updateLiability: (liabilityId: string, updates: Partial<EstateLiability>) => Promise<void>;
  removeLiability: (liabilityId: string) => Promise<void>;
}

const EstateContext = createContext<EstateContextType | undefined>(undefined);

export function EstateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EstateState>(DEFAULT_INITIAL_STATE);
  const [personas, setPersonas] = useState<DemoPersona[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activePersonaId, setActivePersonaId] = useState<string | null>('persona_salaried_techie');
  const [user, setUser] = useState<{ name: string; emailOrPhone: string; role: string; isAuthenticated: boolean } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('claim_sathi_session');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        const defaultUser = {
          name: 'Pooja Sharma',
          emailOrPhone: 'pooja.sharma@example.com',
          role: 'Primary Claimant (Spouse)',
          isAuthenticated: true,
        };
        setUser(defaultUser);
        localStorage.setItem('claim_sathi_session', JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.warn('Session retrieval error:', e);
    }
  }, []);

  const loginUser = (userData: { name: string; emailOrPhone: string; role?: string }) => {
    const session = {
      name: userData.name,
      emailOrPhone: userData.emailOrPhone,
      role: userData.role || 'Verified Claimant',
      isAuthenticated: true,
    };
    setUser(session);
    try {
      localStorage.setItem('claim_sathi_session', JSON.stringify(session));
    } catch {}
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem('claim_sathi_session');
    } catch {}
  };

  const fetchEstate = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/estate');
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          setState(data.state);
        }
        if (data.personas) {
          setPersonas(data.personas);
        }
      }
    } catch (err) {
      console.error('Failed to load estate data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstate();
  }, [fetchEstate]);

  const saveState = async (newState: EstateState) => {
    setState(newState);
    try {
      setIsSaving(true);
      await fetch('/api/estate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', state: newState }),
      });
    } catch (err) {
      console.error('Error saving estate state:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const loadPersona = async (personaId: string) => {
    try {
      setIsLoading(true);
      setActivePersonaId(personaId);
      const res = await fetch('/api/estate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'load_persona', personaId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          setState(data.state);
        }
      }
    } catch (err) {
      console.error('Failed to switch persona:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = async () => {
    try {
      setIsLoading(true);
      setActivePersonaId(null);
      const res = await fetch('/api/estate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          setState(data.state);
        }
      }
    } catch (err) {
      console.error('Failed to reset estate:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    const updatedTasks = state.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined,
        };
      }
      return task;
    });
    await saveState({ ...state, tasks: updatedTasks });
  };

  const toggleDocument = async (docId: string) => {
    const updatedDocs = state.documents.map((doc) => {
      if (doc.id === docId) {
        const nextAvail = !doc.isAvailable;
        return { 
          ...doc, 
          isAvailable: nextAvail,
          status: (nextAvail ? 'gathered' : 'missing') as DocumentStatus
        };
      }
      return doc;
    });
    await saveState({ ...state, documents: updatedDocs });
  };

  const updateDocumentStatus = async (docId: string, status: DocumentStatus) => {
    const updatedDocs = state.documents.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          status,
          isAvailable: status === 'gathered',
        };
      }
      return doc;
    });
    await saveState({ ...state, documents: updatedDocs });
  };

  const syncDynamicChecklist = async () => {
    const { computeDynamicChecklist } = await import('@/lib/engine/checklistEngine');
    const computed = computeDynamicChecklist(
      state.assets,
      state.liabilities,
      state.deceased,
      state.claimant,
      state.documents
    );
    await saveState({ ...state, documents: computed });
  };

  const addAsset = async (asset: Omit<EstateAsset, 'id'>) => {
    const newAsset: EstateAsset = {
      ...asset,
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    await saveState({ ...state, assets: [...state.assets, newAsset] });
  };

  const updateAsset = async (assetId: string, updates: Partial<EstateAsset>) => {
    const updatedAssets = state.assets.map((a) => (a.id === assetId ? { ...a, ...updates } : a));
    await saveState({ ...state, assets: updatedAssets });
  };

  const removeAsset = async (assetId: string) => {
    const updatedAssets = state.assets.filter((a) => a.id !== assetId);
    await saveState({ ...state, assets: updatedAssets });
  };

  const addLiability = async (liability: Omit<EstateLiability, 'id'>) => {
    const newLiability: EstateLiability = {
      ...liability,
      id: `liab_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    await saveState({ ...state, liabilities: [...state.liabilities, newLiability] });
  };

  const updateLiability = async (liabilityId: string, updates: Partial<EstateLiability>) => {
    const updated = state.liabilities.map((l) => (l.id === liabilityId ? { ...l, ...updates } : l));
    await saveState({ ...state, liabilities: updated });
  };

  const removeLiability = async (liabilityId: string) => {
    const updated = state.liabilities.filter((l) => l.id !== liabilityId);
    await saveState({ ...state, liabilities: updated });
  };

  return (
    <EstateContext.Provider
      value={{
        state,
        personas,
        isLoading,
        isSaving,
        activePersonaId,
        refresh: fetchEstate,
        saveState,
        loadPersona,
        resetState,
        toggleTask,
        toggleDocument,
        updateDocumentStatus,
        syncDynamicChecklist,
        user,
        loginUser,
        logoutUser,
        addAsset,
        updateAsset,
        removeAsset,
        addLiability,
        updateLiability,
        removeLiability,
      }}
    >
      {children}
    </EstateContext.Provider>
  );
}

export function useEstate() {
  const context = useContext(EstateContext);
  if (!context) {
    throw new Error('useEstate must be used within an EstateProvider');
  }
  return context;
}
