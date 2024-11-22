import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface TagsStore {
    tags: string[],
    setTags: (tags: string[]) => void
}

const useTagsStore = create<TagsStore>()(
    devtools(
        persist(
            (set) => ({
                tags: [],
                setTags: (tags: string[]) => set((state: TagsStore) => {
                    return {
                        ...state,
                        tags: tags,
                    }
                })
            }),
            {
                name: 'tags-storage',
            },
        ),
    ),
)

export default useTagsStore;