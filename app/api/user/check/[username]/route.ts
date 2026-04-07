import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;

        const exists = await prisma.player.findUnique({
            where: { username },
            select: { id: true },
        });

        return NextResponse.json({ exists: !!exists });
    } catch (err) {
        console.error("Identity check error:", err);
        return NextResponse.json({ error: "Access denied", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
}
