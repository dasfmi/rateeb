import { create } from "zustand";

export type Notification = {
  title: string;
  description: string;
  color: "danger" | "success" | "warn";
};

interface NotificationsStore {
  notifications: Notification[];
  queueNotification: (notification: Notification) => void;
  dismissNotification: (index: number) => void;
}

const useNotificationsStore = create<NotificationsStore>()((set) => ({
  notifications: [],
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
}));

export default useNotificationsStore;
