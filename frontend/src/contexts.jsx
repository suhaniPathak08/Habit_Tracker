
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getHabits as fetchHabits } from './api';

// Auth Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  
  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Habits Context
const HabitsContext = createContext();

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHabits();
      setHabits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);
  
  return (
    <HabitsContext.Provider value={{ habits, setHabits, loading, error, loadHabits }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}
