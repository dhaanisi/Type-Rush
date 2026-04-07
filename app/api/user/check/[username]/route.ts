import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    const exists = await prisma.player.findUnique({
        where: { username },
        select: { id: true },
    });

    return NextResponse.json({ exists: !!exists });
}
