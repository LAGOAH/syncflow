import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sender, amount, reference, rawText } = body;

    if (!amount || !sender || !reference) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        senderName: sender,
        reference,
        rawSms: rawText || null,
        currency: "NGN",
        status: "SUCCESSFUL",
      },
    });

    console.log("[Webhook Success] Logged:", transaction.id);
    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
    });
  } catch (error: any) {
    console.error("[Webhook Error]:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate reference" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}
