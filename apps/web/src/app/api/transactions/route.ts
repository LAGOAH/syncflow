import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Use the same Supabase client as in your app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    // Get the session from the Authorization header or cookie
    const authHeader = request.headers.get('Authorization');
    let token = authHeader?.split(' ')[1];
    
    // Fallback: get from cookie (Next.js/ Supabase SSR)
    if (!token) {
      const cookie = request.headers.get('cookie') || '';
      const match = cookie.match(/sb-access-token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch only transactions belonging to this user
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { receivedAt: "desc" },
      take: 50,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
