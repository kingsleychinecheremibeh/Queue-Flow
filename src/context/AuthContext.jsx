'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUpUser, registerBusiness, loginUser, logoutUser } from "@/lib/auth-service";

const AuthContext = createContext(undefined);

const supabase = createClient();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sync user data from database
  const syncUser = async (session) => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.warn("Profile not found, using session metadata instead");
        setUser({
          id: session.user.id,
          email: session.user.email,
          phone: session.user.user_metadata?.phone_number || "",
          full_name: session.user.user_metadata?.full_name || "User",
          is_business: session.user.user_metadata?.is_business || false
        });
      } else {
        setUser(data);
      }
    } catch (e) {
      console.error("Sync error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, phone, name) => {
    const result = await signUpUser({ email, password, phone, name });
    
    if (result.success && result.requiresConfirmation) {
      // Don't redirect, show success message in component
      setLoading(false);
    } else if (result.success) {
      // Auto-login enabled, sync will handle redirect
      await syncUser(result.data.session);
    }
    
    return result;
  };

  const registerBusinessUser = async (name, email, password, businessName, category) => {
    const result = await registerBusiness({ email, password, name, businessName, category });
    
    if (result.success && result.requiresConfirmation) {
      setLoading(false);
    } else if (result.success) {
      await syncUser(result.data.session);
    }
    
    return result;
  };

  const login = async (email, password) => {
    const result = await loginUser({ email, password });
    
    if (result.success) {
      // Get user type from the synced user
      const isBusiness = result.data.user?.user_metadata?.is_business === true;
      const targetPath = isBusiness ? '/business/dashboard' : '/user/dashboard';
      router.push(targetPath);
    }
    
    return result;
  };

  const logOut = async () => {
    await logoutUser();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, registerBusiness: registerBusinessUser, login, logOut }}>
      {!loading ? children : (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'black', color: 'white'}}>
           <p>Loading QueueFlow...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
