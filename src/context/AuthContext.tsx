import React, { createContext, useContext, useState, useEffect } from "react";

// const API_BASE_URL = "http://127.0.0.1:5000/api"; // ✅ Use 127.0.0.1 instead of localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type User = {
  _id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Fetch logged-in user profile
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("❌ Error fetching user:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login user
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      await fetchUser(); // Refresh user state after login
    } catch (error) {
      console.error("❌ Login failed:", error.message);
    }
  };

  // ✅ Signup user
  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      await fetchUser(); // Refresh user state after signup
    } catch (error) {
      console.error("❌ Signup failed:", error.message);
    }
  };

  // ✅ Logout user
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("❌ Logout failed:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
