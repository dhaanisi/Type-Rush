import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const topPlayers = await prisma.player.findMany({
            orderBy: { bestScore: "desc" },
            take: 50,
            select: {
                username: true,
                bestScore: true,
                createdAt: true,
                _count: {
                    select: { gameScores: true }
                }
            }
        });

        return NextResponse.json({ leaderboard: topPlayers });
    } catch (err) {
        console.error("Failed to load leaderboard:", err);
        return NextResponse.json({ error: "System failure during ranking analysis" }, { status: 500 });
    }
}
