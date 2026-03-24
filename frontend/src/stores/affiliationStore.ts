import { create } from 'zustand'
import type {
  Affiliation,
  AffiliationPaginationMeta,
  CreateAffiliationPayload,
  AffiliationAction,
} from '@/types/affiliation'
import * as affiliationApi from '@/api/affiliationApi'
import type { AffiliationFilters } from '@/api/affiliationApi'

export interface AffiliationState {
  affiliations: Affiliation[]
  loading: boolean
  error: string | null
  pagination: AffiliationPaginationMeta | null
  currentPage: number
  pageSize: number
  filters: AffiliationFilters

  // Actions
  setFilters: (filters: AffiliationFilters) => void
  fetchAffiliations: (page?: number, filters?: AffiliationFilters) => Promise<void>
  getAffiliation: (id: string) => Promise<Affiliation>
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  approveAffiliation: (id: string, reason?: string) => Promise<void>
  rejectAffiliation: (id: string, reason?: string) => Promise<void>
  createAffiliation: (payload: CreateAffiliationPayload) => Promise<void>
  refreshAffiliations: () => Promise<void>
}

export const useAffiliationStore = create<AffiliationState>((set, get) => ({
  affiliations: [],
  loading: false,
  error: null,
  pagination: null,
  currentPage: 1,
  pageSize: 20,
  filters: {},

  setFilters: (filters) => {
    set({ filters, currentPage: 1 })
    get().fetchAffiliations(1, filters)
  },

  setPage: (page) => {
    set({ currentPage: page })
    get().fetchAffiliations(page)
  },

  setPageSize: (pageSize) => {
    set({ pageSize, currentPage: 1 })
    get().fetchAffiliations(1)
  },

  fetchAffiliations: async (page, filters) => {
    const currentPage = page || get().currentPage
    const currentFilters = filters || get().filters
    const pageSize = currentFilters.page_size || get().pageSize

    set({ loading: true, error: null })
    try {
      const response = await affiliationApi.listAffiliations(currentPage, pageSize, currentFilters)
      set({
        affiliations: response.data,
        pagination: response.pagination,
        currentPage,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch affiliations',
        loading: false,
      })
    }
  },

  getAffiliation: async (id) => {
    set({ loading: true, error: null })
    try {
      const affiliation = await affiliationApi.getAffiliation(id)
      set({ loading: false })
      return affiliation
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch affiliation',
        loading: false,
      })
      throw error
    }
  },

  approveAffiliation: async (id, reason) => {
    set({ loading: true, error: null })
    try {
      await affiliationApi.approveAffiliation(id, reason)
      set({ loading: false })
      // Refresh the list
      await get().refreshAffiliations()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to approve affiliation',
        loading: false,
      })
      throw error
    }
  },

  rejectAffiliation: async (id, reason) => {
    set({ loading: true, error: null })
    try {
      await affiliationApi.rejectAffiliation(id, reason)
      set({ loading: false })
      // Refresh the list
      await get().refreshAffiliations()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reject affiliation',
        loading: false,
      })
      throw error
    }
  },

  createAffiliation: async (payload) => {
    set({ loading: true, error: null })
    try {
      const newAffiliation = await affiliationApi.createAffiliation(payload)
      set({
        affiliations: [newAffiliation, ...get().affiliations],
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create affiliation',
        loading: false,
      })
      throw error
    }
  },

  refreshAffiliations: async () => {
    const { currentPage, filters } = get()
    await get().fetchAffiliations(currentPage, filters)
  },
}))

// Initialize affiliations on store creation
useAffiliationStore.getState().fetchAffiliations()
