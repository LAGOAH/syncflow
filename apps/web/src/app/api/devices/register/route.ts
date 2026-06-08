import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { prisma } from "@/lib/prisma";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { deviceName } = await request.json();
    if (!deviceName) return NextResponse.json({ error: "Device name required" }, { status: 400 });

    const userRecord = await prisma.user.findUnique({
      where: { email: user.email },
      select: { organizationId: true }
    });
    if (!userRecord?.organizationId) {
      return NextResponse.json({ error: "User not linked to organization" }, { status: 400 });
    }

    const deviceKey = `sf_dev_${Math.random().toString(36).substring(2, 15)}`;
    const device = await prisma.device.create({
      data: { name: deviceName, deviceKey, organizationId: userRecord.organizationId },
    });
    return NextResponse.json({ success: true, deviceKey: device.deviceKey, deviceId: device.id });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
