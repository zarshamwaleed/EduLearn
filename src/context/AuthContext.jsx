import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Use configured axios instance

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchUserProfile = async () => {
    const token = getToken();
    if (!token) {
      console.log('No token found in localStorage');
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/profile');
      console.log('Fetched user profile:', response.data); // Debug log
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      setUser(null);
      localStorage.removeItem('authToken'); // Clear invalid token
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', {
        email,
        password,
      });
      const { token, user: userData } = response.data;
      console.log('Login response user:', userData); // Debug log
      localStorage.setItem('authToken', token);
      setUser(userData);
      return userData.role;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}