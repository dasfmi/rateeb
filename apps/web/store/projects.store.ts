import { Note, Project } from '@/entity'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ProjectsStore {
    projects: Project[],
    setProjects: (projects: Project[]) => void
}

const useProjectsStore = create<ProjectsStore>()(
    devtools(
        persist(
            (set) => ({
                projects: [],
                setProjects: (projects: Project[]) => set((state: ProjectsStore) => {
                    return {
                        ...state,
                        projects,
                    }
                })
            }),
            {
                name: 'projects-storage',
            },
        ),
    ),
)

export default useProjectsStore;