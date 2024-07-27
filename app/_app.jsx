import { useEffect } from 'react';
import { useAuthStore } from '../store/store';
import Script from 'next/script';


const MyApp = ({ Component, pageProps }) => {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <SessionProviderClient>
     <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Component {...pageProps} />
    </SessionProviderClient>
  );
};

export default MyApp;
