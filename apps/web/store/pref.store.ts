import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
// import type {} from '@redux-devtools/extension' // required for devtools typing

interface PrefState {
  isSidebarOpen: boolean,
  setIsSidebarOpen: (open: boolean) => void
}

const usePrefStore = create<PrefState>()(
  devtools(
    persist(
      (set) => ({
        isSidebarOpen: true,
        setIsSidebarOpen: (open: boolean) => set((state) => ({ isSidebarOpen: open })),
      }),
      {
        name: 'pref-storage',
      },
    ),
  ),
)

export default usePrefStore;