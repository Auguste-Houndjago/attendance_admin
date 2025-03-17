import { create } from 'zustand';

export type ViewMode = "grid" | "list";
export type SortField = "course" | "teacher" | "time" | "status";
export type SortOrder = "asc" | "desc";
export type FilterStatus = "all" | "PRESENT" | "ABSENT" | "LATE";

interface ViewStore {
  // Vue
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // Tri
  sortField: SortField;
  sortOrder: SortOrder;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  
  // Filtrage
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  
 
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

interface DateStore {
  date: Date;
  setDate: (newDate: Date) => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  // Vue
  viewMode: "grid",
  setViewMode: (mode) => set({ viewMode: mode }),
  
  // Tri
  sortField: "time",
  sortOrder: "asc",
  setSortField: (field) => set({ sortField: field }),
  setSortOrder: (order) => set({ sortOrder: order }),
  
  // Filtrage
  filterStatus: "all",
  setFilterStatus: (status) => set({ filterStatus: status }),
  
  // Pagination
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
}));

export const useDateStore = create<DateStore>((set) => ({
  date: new Date(),
  setDate: (newDate: Date) => set({ date: newDate }),
}));