"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/auth";
import { usePathname } from "next/navigation";
import { User } from "@/types/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: "login" | "signup" | "logout" | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setError: React.Dispatch<
    React.SetStateAction<"login" | "signup" | "logout" | null>
  >;
  success: "login" | "signup" | "logout" | null;
  setSuccess: React.Dispatch<
    React.SetStateAction<"login" | "signup" | "logout" | null>
  >;
  refetchProfile: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [error, setError] = useState<"login" | "signup" | "logout" | null>(
    null
  );
  const [success, setSuccess] = useState<"login" | "signup" | "logout" | null>(
    null
  );

  useEffect(() => {
    getProfile()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const refetchProfile = () => {
    getProfile()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  };

  const login = async (email: string, password: string) => {
    try {
      await loginUser({ email, password });
      const u = await getProfile();
      setUser(u);
      setSuccess("login");
    } catch (err: unknown) {
      setError("login");
      console.error("login error", err);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await registerUser({ name, email, password });
      const u = await getProfile();
      setUser(u);
      setSuccess("signup");
    } catch (err: unknown) {
      setError("signup");
      console.error("signup error", err);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setSuccess("logout");
    } catch (err: unknown) {
      setError("logout");
      console.error("logout error", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        error,
        setError,
        success,
        setSuccess,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
