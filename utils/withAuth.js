import { useAuthStore } from '../store/store';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { isLoggedIn, setLogin } = useAuthStore();

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('usertoken');
        if (token) {
          setLogin(token);
        } else if (!isLoggedIn) {
          window.location.href = '/login';
        }
      }
    }, [isLoggedIn, setLogin]);

    if (!isLoggedIn) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
