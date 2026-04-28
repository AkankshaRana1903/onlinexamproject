import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

// Define the User type with role
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'examiner' | 'student';
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved token in localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Validate the token with the backend
      authAPI.getCurrentUser()
        .then(response => {
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            // Clear invalid credentials
            localStorage.removeItem('token');
            setUser(null);
          }
        })
        .catch(() => {
          // Clear invalid credentials
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Make actual API call to your backend
      const response = await authAPI.login(email, password);
      
      if (response.data.success) {
        const { token, user } = response.data;
        setUser(user);
        localStorage.setItem('token', token);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // No logout API endpoint in your implementation
    // Just clear the local state
    setUser(null);
    localStorage.removeItem('token');
  };

  const register = async (name: string, email: string, password: string, role: string = 'student') => {
    setIsLoading(true);
    try {
      // Make actual API call to your backend
      const response = await authAPI.register(name, email, password, role);
      
      if (response.data.success) {
        const { token, user } = response.data;
        setUser(user);
        localStorage.setItem('token', token);
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};