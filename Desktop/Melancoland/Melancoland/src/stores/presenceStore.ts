import { create } from "zustand";
import type { PresenceUser } from "@/engine/types";

interface PresenceState {
  onlineUsers: PresenceUser[];
  count: number;
  setUsers: (users: PresenceUser[]) => void;
  addUser: (user: PresenceUser) => void;
  removeUser: (userId: string) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUsers: [],
  count: 0,
  setUsers: (users) => set({ onlineUsers: users, count: users.length }),
  addUser: (user) =>
    set((state) => {
      const users = [...state.onlineUsers, user];
      return { onlineUsers: users, count: users.length };
    }),
  removeUser: (userId) =>
    set((state) => {
      const users = state.onlineUsers.filter((u) => u.userId !== userId);
      return { onlineUsers: users, count: users.length };
    }),
}));
