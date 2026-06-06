import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr';
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, transactionId: transaction.id }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Duplicate reference" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
