import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/**
 * Create a user profile in the database
 */
async function createUserProfile(userId, profileData) {
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        full_name: profileData.full_name,
        phone: profileData.phone,
        is_business: profileData.is_business || false,
        business_name: profileData.business_name || null,
        category: profileData.category || null,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Profile creation error:", error);
    throw new Error("Failed to create user profile");
  }

  return data;
}

/**
 * Sign up a regular user
 */
export async function signUpUser({ email, password, phone, name }) {
  try {
    // First, sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone_number: phone,
          is_business: false,
        },
      },
    });

    if (error) throw error;

    // If we have a session, create the profile
    if (data?.user) {
      await createUserProfile(data.user.id, {
        full_name: name,
        phone: phone,
        is_business: false,
      });
    }

    return {
      success: true,
      data,
      message: "Check your email for confirmation link!",
      requiresConfirmation: !data?.session,
    };
  } catch (error) {
    console.error("Signup error:", error.message);
    return {
      success: false,
      error: error.message,
      message: error.message || "Failed to create account",
    };
  }
}

/**
 * Register a business user
 */
export async function registerBusiness({ email, password, name, businessName, category }) {
  try {
    // First, sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          business_name: businessName,
          category: category,
          is_business: true,
        },
      },
    });

    if (error) throw error;

    // If we have a session, create the profile
    if (data?.user) {
      await createUserProfile(data.user.id, {
        full_name: name,
        phone: null,
        is_business: true,
        business_name: businessName,
        category: category,
      });
    }

    return {
      success: true,
      data,
      message: "Business registered successfully! Check your email for confirmation.",
      requiresConfirmation: !data?.session,
    };
  } catch (error) {
    console.error("Business registration error:", error.message);
    return {
      success: false,
      error: error.message,
      message: error.message || "Failed to register business",
    };
  }
}

/**
 * Login user
 */
export async function loginUser({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      success: true,
      data,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error.message);
    return {
      success: false,
      error: error.message,
      message: error.message || "Invalid credentials",
    };
  }
}

/**
 * Logout user
 */
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get user profile from database
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Get profile error:", error.message);
    return { success: false, error: error.message };
  }
}
