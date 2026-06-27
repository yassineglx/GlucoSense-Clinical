import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!session || !userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { glucose, bloodPressure, weight, notes } = body;

    const newLog = await prisma.dailyLog.create({
      data: {
        userId: userId,
        glucose: glucose ? parseFloat(glucose) : null,
        bloodPressure: bloodPressure ? parseFloat(bloodPressure) : null,
        weight: weight ? parseFloat(weight) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating log:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create log" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!session || !userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.dailyLog.findMany({
      where: { userId: userId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ success: true, data: logs }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
