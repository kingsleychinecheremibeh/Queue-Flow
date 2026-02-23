import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Safety check
if (!supabaseUrl || !supabasePublishableKey) {
  console.warn("Supabase keys are missing. Check your .env.local file!");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);