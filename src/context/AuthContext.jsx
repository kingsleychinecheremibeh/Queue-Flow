'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext(undefined);


const supabase = createClient();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 3. Define the function to sync user data
  const syncUser = async (session) => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Try to get the profile from the database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.warn("Profile not found, using session metadata instead");
        // Fallback to basic session data (metadata)
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
    // 4. Run initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
    });

    // 5. Listen for Auth changes (Login, Logout, Signup)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, phone, name) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone_number: phone,
            full_name: name,
          },
        },
      });

      if (error) throw error;
      
      // If auto-login is enabled on Supabase, sync right away
      if (data?.session) {
        await syncUser(data.session);
      } else {
        alert("Check your email for confirmation link!");
      }

      return { data, error: null };
    } catch (err) {
      console.error("Signup error:", err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/dashboard');
    } catch (err) {
      console.error("Login error:", err.message);
      return {error: err};
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, login, logOut }}>
      {!loading ? children : (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
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