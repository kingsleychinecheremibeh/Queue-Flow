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
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("app_user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const router = useRouter();

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("app_user", JSON.stringify(userData));
  };

  const login = async (email, password, role) => {
    // Mock login - in production, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser = {
      id: email, // Use email as consistent ID for filtering queues/data
      name: email.split("@")[0],
      email,
      role,
      businessName: role === "business" ? "Sample Business" : undefined,
    };

    saveUser(newUser)
  };

  const signUp = async (name, email, password) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser = {
      id: email, // Use email as consistent ID
      name,
      email,
      role: "user",
    };

    saveUser(newUser);
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
    
    const newUser = {
      id: email, // Use email as consistent ID for queue filtering
      name,
      email,
      role: "business",
      businessName,
      category,
    };

    saveUser(newUser);
  };

  const logOut = () => {
    localStorage.removeItem("app_user");
    setUser(null);
    router.push("/");
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
