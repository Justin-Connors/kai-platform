import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChange,
  signOut,
  singInWithEmailAndPassword,
} from 'firebase/auth';

import firebaseConfig from '../firebase/config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Authentication context
const AuthContext = createContext({
  currentUser: null,
  login: () => Promise.reject(),
  signup: () => Promise.reject(),
  logout: () => Promise.reject(),
  error: null,
});

// Manages the authentication state
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  // looking for changes in authentication state
  useEffect(() => {
    // Clean the listener on unmount
    const cleanListener = onAuthStateChange(auth, (user) => {
      setCurrentUser(user);
    });

    return cleanListener;
  }, []);

  const login = async (email, password) => {
    try {
      await singInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  const signup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      setError(e.message);
    }
  };

  // Wrap the context value in useMemo
  const memoizedValue = useMemo(
    () => ({
      currentUser,
      login,
      signup,
      logout,
      error,
    }),
    [currentUser, login, signup, logout, error]
  );

  // Provide the authentication context
  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to easily use the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
