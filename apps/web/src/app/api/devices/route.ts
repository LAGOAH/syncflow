import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { prisma } from "@/lib/prisma";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userRecord = await prisma.user.findUnique({
      where: { email: user.email },
      select: { organizationId: true }
    });
    if (!userRecord?.organizationId) return NextResponse.json([]);

    const devices = await prisma.device.findMany({
      where: { organizationId: userRecord.organizationId },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(devices);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
