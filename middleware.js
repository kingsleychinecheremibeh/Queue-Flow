import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  // 1. Create an initial response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Initialize the Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
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

  // 3. Refresh the session
  const { data: { user } } = await supabase.auth.getUser();
  const url = request.nextUrl.clone();

  // 4. --- THE REDIRECT LOGIC (The Debug Zone) ---

  // Protect Dashboard: If no user, kick to login
  // Note: We check both /business and /user prefixes here
  if (!user && (url.pathname.startsWith('/business') || url.pathname.startsWith('/user'))) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Prevent logged-in users from seeing Auth pages
  if (user && (url.pathname === '/login' || url.pathname === '/signup' || url.pathname === '/')) {
    // Check metadata to decide which dashboard to send them to
    const isBusiness = user.user_metadata?.is_business === true;
    
    // REDIRECT TO THE CORRECT FOLDER
    url.pathname = isBusiness ? '/business/dashboard' : '/user/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};