import { Block, View } from "@/entity";
import { createNote } from "@/services/notes.client";
import { create } from "zustand";

export type Notification = {
  title: string;
  description: string;
  color: "danger" | "success" | "warn";
};

interface AppState {
  blocks: Block[];
  setBlocks: (notes: Block[]) => void;
  deleteBlock: (id: string) => void;
  createBlock: (block: Block) => void;
  // tags
  deleteTag: (id: string, tag: string) => void
  addTag(id: string, tag: string): void
  // views
  views: View[];
  setViews: (views: View[]) => void;
  // notifications: Notification[];
  notifications: Notification[];
  queueNotification: (notification: Notification) => void;
  dismissNotification: (index: number) => void;
  // sidebar
  isSidebarOpen: boolean,
  setIsSidebarOpen: (open: boolean) => void
  // tags
  tags: string[],
  setTags: (tags: string[]) => void
  // app
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
}

const useAppStore = create<AppState>()(
  (set) => ({
    blocks: [],
    notifications: [],
    isSidebarOpen: true,
    tags: [],
    isLoading: false,
    isOnline: true,
    views: [],
    setBlocks: (blocks: Block[]) =>
      set((state: AppState) => {
        return {
          ...state,
          blocks: blocks,
        };
      }),
    setViews: (views: View[]) => set((state: AppState) => ({ ...state, views })),
    createBlock: async (block: Block) => {
      const resp = await createNote(block);
      console.log({ resp })
      set((state: AppState) => {
        state.blocks.unshift(resp.data)
        return { ...state }
      })
    },
    deleteBlock: async (id: string) => {
      const p = fetch("http://localhost:4000/api/blocks/" + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(resp => resp.json())
      set((state: AppState) => {
        const index = state.blocks.findIndex((block) => block.id === id)
        state.blocks.splice(index, 1)
        return { ...state }
      })

      await p
    },
    addTag: async (id: string, tag: string) => {
      const p = fetch("http://localhost:4000/api/blocks/" + id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'append',
          target: 'tags',
          value: tag
        })
      }).then(resp => resp.json())
      set((state: AppState) => {
        console.log({ id, tag })
        const index = state.blocks.findIndex((block) => block.id === id)
        // ensure tags array exists to avoid exceptions
        if (!state.blocks[index].tags) {
          state.blocks[index].tags = []
        }
        console.log({ index, tags: state.blocks[index].tags })
        state.blocks[index].tags.push(tag)
        return { ...state }
      })
      await p
    },
    deleteTag: async (id: string, tag: string) => {
      const p = fetch("http://localhost:4000/api/blocks/" + id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'splice',
          target: 'tags',
          value: tag
        })
      }).then(resp => resp.json())
      set((state) => {
        console.log(state)
        const index = state.blocks.findIndex((block) => block.id == id)
        console.log({ id, index, tag })
        state.blocks[index].tags.splice(state.blocks[index]?.tags.indexOf(tag), 1)
        return { ...state }
      })
      await p
    },


    queueNotification: (notification: Notification) =>
      set((state) => {
        state.notifications = [...state.notifications, notification];
        return state;
      }),
    dismissNotification: (index) =>
      set((state) => {
        console.log("should dismiss notifications", index);
        state.notifications.splice(index, 1);
        console.log(state.notifications);
        return state;
      }),
    setIsSidebarOpen: (open: boolean) => set((state) => ({ isSidebarOpen: open })),
    setTags: (tags: string[]) => set((state) => {
      return {
        ...state,
        tags: tags,
      }
    }),
    setIsLoading: (isLoading: boolean) =>
      set((state) => ({ ...state, isLoading })),
    setIsOnline: (isOnline: boolean) => set((state) => ({ ...state, isOnline })),
  }),
);

export default useAppStore;
