import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Chat history is scoped per user id so switching between demo accounts
// on the same browser doesn't mix one user's conversation into another's.
export const useChatStore = create(
  persist(
    (set) => ({
      messagesByUser: {},
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      setMessages: (userId, messages) => {
        if (!userId) return;
        set((state) => ({
          messagesByUser: { ...state.messagesByUser, [userId]: messages },
        }));
      },

      clearMessages: (userId) => {
        if (!userId) return;
        set((state) => {
          const next = { ...state.messagesByUser };
          delete next[userId];
          return { messagesByUser: next };
        });
      },
    }),
    {
      name: "pet-care-ai-chat-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);