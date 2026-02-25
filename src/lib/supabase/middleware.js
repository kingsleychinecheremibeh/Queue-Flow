import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Define these here to keep the function clean
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY; 

export const updateSession = async (request) => {
  // 1. Create an initial response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Initialize the Supabase client specifically for Middleware
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sync cookies with the request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          
          // Refresh the response to include updated request headers
          supabaseResponse = NextResponse.next({
            request,
          });

          // Sync cookies with the response so the browser saves them
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Refresh the session (This is vital for keeping users logged in)
  const { data: { user } } = await supabase.auth.getUser();

  // 4. --- REDIRECT LOGIC ---
  const url = request.nextUrl.clone();

  // Protect dashboard: If no user, kick to login
  if (!user && url.pathname.startsWith('/dashboard')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Prevent logged-in users from seeing Auth pages
  if (user && (url.pathname === '/login' || url.pathname === '/signup')) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};