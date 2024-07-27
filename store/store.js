import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  initialize: () => {
    if (typeof window !== 'undefined') {
      const usertoken = localStorage.getItem('usertoken');
      set({ isLoggedIn: usertoken !== null });
      const admtoken = localStorage.getItem('admtoken');
      set({isAdminLoggedIn: admtoken != null});
    }
  },
  setLogin: (token,email,isPremium) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('usertoken', token);
      set({ isLoggedIn: true });
    }
  },
  setLogout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usertoken');
      set({ isLoggedIn: false });
    }
  },
  isAdminLoggedIn: false,
  setAdminLogin: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admtoken', token);
      set({ isAdminLoggedIn: true });
    }
  },
  setAdminLogout: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admtoken');
      set({ isAdminLoggedIn: false });
    }
  },
 
}));

export { useAuthStore };