import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { users as initialUsers } from "@/data/users";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      registeredUsers: initialUsers,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      login: ({ email, password }) => {
        const users = get().registeredUsers;
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!found) {
          return { success: false, error: "No account found with this email." };
        }
        if (found.password !== password) {
          return { success: false, error: "Incorrect password." };
        }

        const { password: _pw, ...safeUser } = found;
        set({ currentUser: safeUser, isAuthenticated: true });
        return { success: true };
      },

      signup: ({ name, email, password }) => {
        const users = get().registeredUsers;
        const exists = users.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (exists) {
          return {
            success: false,
            error: "An account with this email already exists.",
          };
        }

        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
        };

        const { password: _pw, ...safeUser } = newUser;
        set({
          registeredUsers: [...users, newUser],
          currentUser: safeUser,
          isAuthenticated: true,
        });
        return { success: true };
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
    }),
    {
      name: "pet-care-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
);