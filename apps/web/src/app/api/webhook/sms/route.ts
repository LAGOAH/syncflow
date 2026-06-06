import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    // Get the session token from Authorization header or cookie
    const authHeader = request.headers.get('Authorization');
    let token = authHeader?.split(' ')[1];
    if (!token) {
      const cookie = request.headers.get('cookie') || '';
      const match = cookie.match(/sb-access-token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized – missing token" }, { status: 401 });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized – invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { sender, amount, reference, rawText } = body;

    if (!amount || !sender || !reference) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        senderName: sender,
        reference,
        rawSms: rawText || null,
        currency: "NGN",
        status: "SUCCESSFUL",
        userId: user.id,  // 👈 Associate with logged-in user
      },
    });

    console.log("[Webhook Success] Logged for user:", user.id, transaction.id);
    return NextResponse.json({ success: true, transactionId: transaction.id }, { status: 201 });
  } catch (error: any) {
    console.error("[Webhook Error]:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Duplicate reference" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
