import {jwtDecode} from 'jwt-decode';
import withAuth from './withAuth';

const getEmailFromToken = () => {
  const token = localStorage.getItem('usertoken');
  if (!token) {
    throw new Error('No token found');
  }
  const decoded = jwtDecode(token);
  return decoded.email;
};

export default getEmailFromToken;