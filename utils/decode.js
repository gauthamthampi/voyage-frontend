import {jwtDecode} from 'jwt-decode';
import withAuth from './withAuth';
import { useRouter } from 'next/navigation';

const getEmailFromToken = () => {
  const router = useRouter()
  const token = localStorage.getItem('usertoken');
  if (!token) {
    router.push("/login")
    // throw new Error('No token found');
  }
  const decoded = jwtDecode(token);
  return decoded.email;
};

export default getEmailFromToken;