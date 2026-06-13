import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jharyatra_token');
    const savedUser = localStorage.getItem('jharyatra_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data.data);
          localStorage.setItem('jharyatra_user', JSON.stringify(res.data.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const data = res.data.data;
    localStorage.setItem('jharyatra_token', data.token);
    const { token, ...userData } = data;
    localStorage.setItem('jharyatra_user', JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}!`);
    return userData;
  };

  const register = async (formData) => {
    const res = await API.post('/auth/register', formData);
    const data = res.data.data;
    localStorage.setItem('jharyatra_token', data.token);
    const { token, ...userData } = data;
    localStorage.setItem('jharyatra_user', JSON.stringify(userData));
    setUser(userData);
    toast.success('Account created successfully!');
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('jharyatra_token');
    localStorage.removeItem('jharyatra_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
