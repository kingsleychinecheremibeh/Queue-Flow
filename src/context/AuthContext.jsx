// function validatePassword(password) {
//   const minLength = 8;
//   const hasLowercase = /[a-z]/.test(password);
//   const hasUppercase = /[A-Z]/.test(password);
//   const hasNumber = /[0-9]/.test(password);
//   const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~` ]/.test(password);

//   if (password.length < minLength) return `Password must be at least ${minLength} characters long.`;
//   if (!hasLowercase) return 'Password must contain at least one lowercase letter.';
//   if (!hasUppercase) return 'Password must contain at least one uppercase letter.';
//   if (!hasNumber) return 'Password must contain at least one number.';
//   if (!hasSpecialChar) return 'Password must contain at least one special character (!@#$%^&*...).';
//   return null;
// }

// context/authContext.js
// context/AuthContext.js
'use client';

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation"

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (email, password, role) => {
    // Mock login - in production, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: crypto.randomUUID().slice(0, 8),
      name: email.split("@")[0],
      email,
      role,
      businessName: role === "business" ? "Sample Business" : undefined,
    });
  };

  const signUp = async (name, email, password) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: crypto.randomUUID().slice(0, 8),
      name,
      email,
      role: "user",
    });
  };

  const registerBusiness = async (
    name,
    email,
    password,
    businessName,
    category
  ) => {
    // Mock business registration
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: crypto.randomUUID().slice(0, 8),
      name,
      email,
      role: "business",
      businessName,
    });
  };

  const logOut = () => {
    router.push("/")
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, registerBusiness, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
