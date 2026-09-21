import { createContext, useContext, useState } from "react";
import { getCurrentUser, mockSignIn, mockSignUp, mockUpdateProfile, clearSession } from "../lib/mockAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  const login = async (credentials) => {
    const loggedInUser = await mockSignIn(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (data) => {
    const newUser = await mockSignUp(data);
    setUser(newUser);
    return newUser;
  };

  const updateProfile = async (updates) => {
    const updated = await mockUpdateProfile(user.id, updates);
    setUser(updated);
    return updated;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading: false, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}