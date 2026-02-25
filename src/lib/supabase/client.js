import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY; 
// Note: Usually it's named ANON_KEY in the env, check your .env file!

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );