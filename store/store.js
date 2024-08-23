import { create } from 'zustand';
import { signOut } from 'next-auth/react';


const useAuthStore = create((set) => ({
  isLoggedIn: false,
  isAdminLoggedIn: false,
  checkoutDetails: {},

  initialize: () => {
    if (typeof window !== 'undefined') {
      const usertoken = localStorage.getItem('usertoken');
      set({ isLoggedIn: usertoken !== null });
      const admtoken = localStorage.getItem('admtoken');
      set({ isAdminLoggedIn: admtoken != null });

      const storedCheckoutDetails = localStorage.getItem('checkoutDetails');
      if (storedCheckoutDetails) {
        set({ checkoutDetails: JSON.parse(storedCheckoutDetails) });
      }
    }
  },

  setLogin: (token, email, isPremium) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('usertoken', token);
      set({ isLoggedIn: true });
    }
  },

  setLogout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usertoken');
      set({ isLoggedIn: false });
      signOut({ callbackUrl: '/' });
    }
  },

  setAdminLogin: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admtoken', token);
      set({ isAdminLoggedIn: true });
    }
  },

  setAdminLogout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admtoken');
      set({ isAdminLoggedIn: false });
    }
  },

  setCheckoutDetails: (details) => {
    set({ checkoutDetails: details });
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkoutDetails', JSON.stringify(details));
    }
  },

  clearCheckoutDetails: () => {
    set({ checkoutDetails: {} });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('checkoutDetails');
    }
  },
}));

export { useAuthStore };
